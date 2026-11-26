
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

resource "random_string" "suffix" {
  length  = 5
  upper   = false
  special = false
}

resource "random_password" "admin" {
  length  = 24
  special = false
}

# ==========================================
# 1. DATABASE SUBNET
# ==========================================

resource "azurerm_subnet" "db" {
  name                 = "snet-${var.name_prefix}-db"
  resource_group_name  = var.resource_group_name
  virtual_network_name = var.vnet_name
  address_prefixes     = [var.db_subnet_cidr]

  delegation {
    name = "postgres-delegation"

    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

# ==========================================
# 2. DATABASE NETWORK SECURITY GROUP
# ==========================================

resource "azurerm_network_security_group" "db" {
  name                = "nsg-${var.name_prefix}-db"
  location            = var.location
  resource_group_name = var.resource_group_name

  # Priority 100: Allow PostgreSQL from application subnet
  security_rule {
    name                       = "allow-postgres-from-app"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = "10.0.2.0/24"
    destination_address_prefix = "*"
  }

  # Priority 110: Allow PostgreSQL internal subnet traffic
  security_rule {
    name                       = "allow-postgres-internal"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = var.db_subnet_cidr
    destination_address_prefix = "*"
  }

  # Priority 200: Deny other Virtual Network inbound traffic
  security_rule {
    name                       = "deny-other-vnet-inbound"
    priority                   = 200
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }
}

# ==========================================
# 3. ASSOCIATE NSG WITH DATABASE SUBNET
# ==========================================

resource "azurerm_subnet_network_security_group_association" "db" {
  subnet_id                 = azurerm_subnet.db.id
  network_security_group_id = azurerm_network_security_group.db.id
}

# ==========================================
# 4. PRIVATE DNS ZONE
# ==========================================

resource "azurerm_private_dns_zone" "db" {
  name                = "${var.name_prefix}.private.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
}

resource "azurerm_private_dns_zone_virtual_network_link" "db" {
  name                  = "link-${var.name_prefix}-db"
  private_dns_zone_name = azurerm_private_dns_zone.db.name
  resource_group_name   = var.resource_group_name
  virtual_network_id    = var.vnet_id
}

# ==========================================
# 5. POSTGRESQL FLEXIBLE SERVER
# ==========================================

resource "azurerm_postgresql_flexible_server" "db" {
  name                          = "psql-${var.name_prefix}-${random_string.suffix.result}"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = "16"
  delegated_subnet_id           = azurerm_subnet.db.id
  private_dns_zone_id           = azurerm_private_dns_zone.db.id
  public_network_access_enabled = false
  administrator_login           = var.admin_username
  administrator_password        = random_password.admin.result
  sku_name                      = var.sku_name
  storage_mb                    = var.storage_mb
  backup_retention_days         = 7

  depends_on = [
    azurerm_private_dns_zone_virtual_network_link.db,
    azurerm_subnet_network_security_group_association.db
  ]

  lifecycle {
    ignore_changes = [zone]
  }
}

# ==========================================
# 6. APPLICATION DATABASE
# ==========================================

resource "azurerm_postgresql_flexible_server_database" "app" {
  name      = var.db_name
  server_id = azurerm_postgresql_flexible_server.db.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}
