
variable "app_subnet_cidr" {
  type    = string
  default = "10.0.2.0/24"
}

variable "app_container_port" {
  description = "Port the app listens on inside the VM"
  type        = number
  default     = 3000
}

variable "app_vm_size" {
  type    = string
  default = "Standard_DS1_v2"
}

variable "app_ssh_public_keys" {
  description = "SSH public keys for the private app VM. Falls back to ssh_public_keys if empty."
  type        = list(string)
  default     = []
}

locals {
  app_ssh_keys = length(var.app_ssh_public_keys) > 0 ? var.app_ssh_public_keys : var.ssh_public_keys
}

module "compute" {
  source = "./modules/compute"

  name_prefix         = local.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  vnet_name           = azurerm_virtual_network.vnet.name
  app_subnet_cidr     = var.app_subnet_cidr
  bastion_subnet_cidr = var.subnet_cidr
  app_container_port  = var.app_container_port
  vm_size             = var.app_vm_size
  admin_username      = var.admin_username
  ssh_public_keys     = local.app_ssh_keys
}

module "loadbalancer" {
  source = "./modules/loadbalancer"

  name_prefix         = local.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  frontend_port       = var.app_port
  backend_port        = var.app_container_port
  nic_id              = module.compute.nic_id
}

output "bastion_ip" {
  value = azurerm_public_ip.pip.ip_address
}

output "app_private_ip" {
  value = module.compute.private_ip
}

output "lb_public_ip" {
  value = module.loadbalancer.public_ip
}

output "app_url" {
  value = "http://${module.loadbalancer.public_ip}"
}
