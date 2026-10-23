
const API_URL = "/api/prices";

const elements = {
  crop: document.getElementById("cropFilter"),
  province: document.getElementById("provinceFilter"),
  search: document.getElementById("searchButton"),
  reset: document.getElementById("resetButton"),
  status: document.getElementById("statusMessage"),
  currentPrice: document.getElementById("currentPrice"),
  currentCrop: document.getElementById("currentCrop"),
  cropCount: document.getElementById("cropCount"),
  marketCount: document.getElementById("marketCount"),
  averagePrice: document.getElementById("averagePrice"),
  priceList: document.getElementById("priceList"),
  table: document.getElementById("priceTableBody"),
  recordCount: document.getElementById("recordCount")
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
  return String(getFirst(record, [
    "crop", "cropName", "crop_name", "name"
  ]) || "Unknown crop");
}

function priceValue(record) {
  const value = Number(getFirst(record, [
    "price", "price_per_kg", "pricePerKg", "market_price", "amount"
  ]));

  return Number.isFinite(value) && value > 0 ? value : null;
}

function provinceName(record) {
  return String(getFirst(record, [
    "province", "provinceName", "province_name", "region"
  ]) || "");
}

function marketName(record) {
  return String(getFirst(record, [
    "market", "marketName", "market_name", "district", "location"
  ]) || "Unknown market");
}

function recordDate(record) {
  return getFirst(record, [
    "date", "recorded_at", "recordedAt", "created_at", "createdAt"
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
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    for (const key of ["prices", "data", "results", "records"]) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }

  return [];
}

function populateCropOptions(records) {
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
  const selectedCrop = elements.crop.value;
  const selectedProvince = elements.province.value.toLowerCase();

  return allPrices.filter(record => {
    const matchesCrop =
      !selectedCrop || cropName(record) === selectedCrop;

    const matchesProvince =
      !selectedProvince ||
      provinceName(record).toLowerCase().includes(selectedProvince);

    return matchesCrop && matchesProvince;
  });
}

function renderStats(records) {
  const validPrices = records
    .map(priceValue)
    .filter(value => value !== null);

  const crops = new Set(records.map(cropName));
  const markets = new Set(records.map(marketName));

  elements.cropCount.textContent = crops.has("Unknown crop")
    ? crops.size - 1
    : crops.size;

  elements.marketCount.textContent = markets.size;

  if (validPrices.length) {
    const average =
      validPrices.reduce((sum, price) => sum + price, 0) /
      validPrices.length;

    elements.averagePrice.textContent = formatRWF(average);

    const latest = records.find(record => priceValue(record) !== null);

    elements.currentPrice.textContent = formatRWF(priceValue(latest));
    elements.currentCrop.textContent =
      `${cropName(latest)} · ${marketName(latest)}`;
  } else {
    elements.averagePrice.textContent = "—";
    elements.currentPrice.textContent = "—";
    elements.currentCrop.textContent = "No valid price records";
  }
}

function renderPriceList(records) {
  elements.priceList.replaceChildren();

  const sorted = [...records]
    .filter(record => priceValue(record) !== null)
    .sort((a, b) => {
      const dateA = new Date(recordDate(a)).getTime() || 0;
      const dateB = new Date(recordDate(b)).getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  if (!sorted.length) {
    elements.priceList.textContent = "No prices available for this selection.";
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
  elements.table.replaceChildren();
  elements.recordCount.textContent =
    `${records.length} record${records.length === 1 ? "" : "s"}`;

  if (!records.length) {
    const row = elements.table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No data available. Try another filter.";
    return;
  }

  records.forEach(record => {
    const row = elements.table.insertRow();

    const values = [
      cropName(record),
      marketName(record),
      provinceName(record) || "—",
      priceValue(record) !== null
        ? formatRWF(priceValue(record))
        : "—",
      recordDate(record)
        ? new Date(recordDate(record)).toLocaleDateString()
        : "—"
    ];

    values.forEach(value => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}

function renderChart(records) {
  const grouped = new Map();

  records.forEach(record => {
    const price = priceValue(record);
    if (price === null) return;

    const date = recordDate(record);
    const label = date
      ? new Date(date).toLocaleDateString()
      : cropName(record);

    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(price);
  });

  const labels = [...grouped.keys()].slice(-12);
  const values = labels.map(label => {
    const prices = grouped.get(label);
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  });

  const canvas = document.getElementById("priceChart");

  if (priceChart) priceChart.destroy();

  priceChart = new Chart(canvas, {
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
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: value => new Intl.NumberFormat("en-RW").format(value)
          }
        },
        x: {
          grid: { display: false }
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

  if (records.length) {
    setStatus(`Showing ${records.length} matching crop price record(s).`);
  } else {
    setStatus("No matching prices found. Try another crop or province.");
  }
}

async function loadPrices() {
  setStatus("Loading crop prices...");

  try {
    const response = await fetch(API_URL, {
      headers: { Accept: "application/json" }
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
    renderDashboard();

    setStatus(
      "Could not load crop prices. Check the API endpoint and server terminal.",
      true
    );
  }
}

elements.search.addEventListener("click", renderDashboard);

elements.reset.addEventListener("click", () => {
  elements.crop.value = "";
  elements.province.value = "";
  renderDashboard();
});

loadPrices();
