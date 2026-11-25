output "private_ip" {
  value = azurerm_network_interface.app.private_ip_address
}

output "nic_id" {
  value = azurerm_network_interface.app.id
}

output "vm_id" {
  value = azurerm_linux_virtual_machine.app.id
}
