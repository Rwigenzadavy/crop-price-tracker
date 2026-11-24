output "fqdn" {
  value = azurerm_postgresql_flexible_server.db.fqdn
}

output "db_name" {
  value = azurerm_postgresql_flexible_server_database.app.name
}

output "admin_username" {
  value = var.admin_username
}

output "admin_password" {
  value     = random_password.admin.result
  sensitive = true
}
output "db_fqdn" {
  value = module.database.fqdn
}

output "db_name" {
  value = module.database.db_name
}

output "db_admin_username" {
  value = module.database.admin_username
}

output "db_admin_password" {
  value     = module.database.admin_password
  sensitive = true
}
