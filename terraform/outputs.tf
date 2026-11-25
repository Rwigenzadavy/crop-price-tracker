output "public_ip_address" {
  value = azurerm_public_ip.pip.ip_address
}

output "vm_id" {
  value = azurerm_linux_virtual_machine.vm.id
}

output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "ssh_command" {
  value = "ssh ${var.admin_username}@${azurerm_public_ip.pip.ip_address}"
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
