const API_URL = "/api/prices";

const elements = {
  crop: document.getElementById("cropFilter"),
  province: document.getElementById("provinceFilter"),
  search: document.getElementById("searchButton"),
  reset: document.getElementById("resetButton"),
  status: document.getElementById("statusMessage"),
  error: document.getElementById("errorMessage"),
  currentPrice: document.getElementById("currentPrice"),
  currentCrop: document.getElementById("currentCrop"),
  cropCount: document.getElementById("cropCount"),
  marketCount: document.getElementById("marketCount"),
  averagePrice: document.getElementById("averagePrice"),
  priceList: document.getElementById("priceList"),
  table: document.getElementById("priceTableBody"),
  recordCount: document.getElementById("recordCount"),
  chart: document.getElementById("priceChart")
};

let allPrices = [];
let priceChart = null;

function getFirst(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }

  return "";
}

function cropName(record) {
  return String(
    getFirst(record, ["crop", "cropName", "crop_name", "name"]) ||
    "Unknown crop"
  );
}

function priceValue(record) {
  const value = Number(
    getFirst(record, [
      "price",
      "price_per_kg",
      "pricePerKg",
      "market_price",
      "amount"
    ])
  );

  return Number.isFinite(value) && value > 0 ? value : null;
}

function provinceName(record) {
  return String(
    getFirst(record, [
      "province",
      "provinceName",
      "province_name",
      "region"
    ]) || ""
  );
}

function marketName(record) {
  return String(
    getFirst(record, [
      "market",
      "marketName",
      "market_name",
      "district",
      "location"
    ]) || "Unknown market"
  );
}

function recordDate(record) {
  return getFirst(record, [
    "date",
    "recorded_at",
    "recordedAt",
    "created_at",
    "createdAt"
  ]);
}

function formatRWF(value) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0
  }).format(value);
}

function setStatus(message, isError = false) {
  if (elements.status) {
    elements.status.textContent = message;
    elements.status.classList.toggle("error", isError);
  }

  if (elements.error) {
    elements.error.hidden = !isError;
    elements.error.textContent = isError ? message : "";
  }
}

function extractRecords(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    for (const key of ["prices", "data", "results", "records"]) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }

  return [];
}

function populateCropOptions(records) {
  if (!elements.crop) return;

  const previousValue = elements.crop.value;

  const crops = [...new Set(records.map(cropName))]
    .filter(name => name !== "Unknown crop")
    .sort();

  elements.crop.replaceChildren(new Option("All crops", ""));

  crops.forEach(name => {
    elements.crop.add(new Option(name, name));
  });

  if (crops.includes(previousValue)) {
    elements.crop.value = previousValue;
  }
}

function getFilteredPrices() {
  const selectedCrop = elements.crop?.value || "";
  const selectedLocation = (elements.province?.value || "")
    .trim()
    .toLowerCase();

  return allPrices.filter(record => {
    const matchesCrop =
      !selectedCrop || cropName(record) === selectedCrop;

    const province = provinceName(record).toLowerCase();
    const market = marketName(record).toLowerCase();

    const matchesLocation =
      !selectedLocation ||
      province.includes(selectedLocation) ||
      market.includes(selectedLocation);

    return matchesCrop && matchesLocation;
  });
}

function renderStats(records) {
  const validRecords = records.filter(
    record => priceValue(record) !== null
  );

  const validPrices = validRecords.map(priceValue);
  const crops = new Set(records.map(cropName));
  const markets = new Set(records.map(marketName));

  if (elements.cropCount) {
    elements.cropCount.textContent = crops.has("Unknown crop")
      ? crops.size - 1
      : crops.size;
  }

  if (elements.marketCount) {
    elements.marketCount.textContent = markets.size;
  }

  if (validPrices.length > 0) {
    const average =
      validPrices.reduce((sum, price) => sum + price, 0) /
      validPrices.length;

    if (elements.averagePrice) {
      elements.averagePrice.textContent = formatRWF(average);
    }

    if (elements.currentPrice) {
      elements.currentPrice.textContent = formatRWF(
        validPrices[0]
      );
    }

    if (elements.currentCrop) {
      elements.currentCrop.textContent =
        `${cropName(validRecords[0])} · ${marketName(validRecords[0])}`;
    }
  } else {
    if (elements.averagePrice) {
      elements.averagePrice.textContent = "—";
    }

    if (elements.currentPrice) {
      elements.currentPrice.textContent = "—";
    }

    if (elements.currentCrop) {
      elements.currentCrop.textContent = "No valid price records";
    }
  }
}

function renderPriceList(records) {
  if (!elements.priceList) return;

  elements.priceList.replaceChildren();

  const sorted = [...records]
    .filter(record => priceValue(record) !== null)
    .sort((a, b) => {
      const dateA = Date.parse(recordDate(a)) || 0;
      const dateB = Date.parse(recordDate(b)) || 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  if (sorted.length === 0) {
    elements.priceList.textContent =
      "No prices available for this selection.";
    return;
  }

  sorted.forEach(record => {
    const item = document.createElement("div");
    item.className = "price-item";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    const location = document.createElement("small");
    const price = document.createElement("div");

    name.textContent = cropName(record);
    location.textContent = marketName(record);

    price.className = "price-value";
    price.textContent = formatRWF(priceValue(record));

    info.append(name, location);
    item.append(info, price);
    elements.priceList.append(item);
  });
}

function renderTable(records) {
  if (!elements.table) return;

  elements.table.replaceChildren();

  if (elements.recordCount) {
    elements.recordCount.textContent =
      `${records.length} record${records.length === 1 ? "" : "s"}`;
  }

  if (records.length === 0) {
    const row = elements.table.insertRow();
    const cell = row.insertCell();

    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No data available. Try another filter.";

    return;
  }

  records.forEach(record => {
    const row = elements.table.insertRow();

    const date = recordDate(record);
    const parsedDate = date ? new Date(date) : null;

    const validDate =
      parsedDate && !Number.isNaN(parsedDate.getTime());

    const values = [
      cropName(record),
      marketName(record),
      provinceName(record) || "—",
      priceValue(record) !== null
        ? formatRWF(priceValue(record))
        : "—",
      validDate ? parsedDate.toLocaleDateString() : "—"
    ];

    values.forEach(value => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}

function renderChart(records) {
  if (!elements.chart || typeof Chart === "undefined") {
    return;
  }

  const grouped = new Map();

  records.forEach(record => {
    const price = priceValue(record);
    if (price === null) return;

    const date = recordDate(record);
    const parsedDate = date ? new Date(date) : null;

    const validDate =
      parsedDate && !Number.isNaN(parsedDate.getTime());

    const label = validDate
      ? parsedDate.toLocaleDateString()
      : cropName(record);

    if (!grouped.has(label)) {
      grouped.set(label, []);
    }

    grouped.get(label).push(price);
  });

  const labels = [...grouped.keys()].slice(-12);

  const values = labels.map(label => {
    const prices = grouped.get(label);

    return prices.reduce((sum, price) => sum + price, 0) /
      prices.length;
  });

  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(elements.chart, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Average price (RWF)",
        data: values,
        borderColor: "#207a48",
        backgroundColor: "rgba(32, 122, 72, 0.12)",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#207a48",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: value =>
              new Intl.NumberFormat("en-RW").format(value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderDashboard() {
  const records = getFilteredPrices();

  renderStats(records);
  renderPriceList(records);
  renderTable(records);
  renderChart(records);

  if (records.length > 0) {
    setStatus(
      `Showing ${records.length} matching crop price record(s).`
    );
  } else {
    setStatus(
      "No matching prices found. Try another crop or location."
    );
  }
}

async function loadPrices() {
  setStatus("Loading crop prices...");

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    allPrices = extractRecords(payload);

    populateCropOptions(allPrices);
    renderDashboard();
  } catch (error) {
    console.error("Unable to load crop prices:", error);

    allPrices = [];

    renderStats([]);
    renderPriceList([]);
    renderTable([]);

    if (priceChart) {
      priceChart.destroy();
      priceChart = null;
    }

    setStatus(
      "Could not load crop prices. Check the API endpoint and server terminal.",
      true
    );
  }
}

if (elements.search) {
  elements.search.addEventListener("click", renderDashboard);
}

if (elements.reset) {
  elements.reset.addEventListener("click", () => {
    if (elements.crop) elements.crop.value = "";
    if (elements.province) elements.province.value = "";

    renderDashboard();
  });
}

loadPrices();