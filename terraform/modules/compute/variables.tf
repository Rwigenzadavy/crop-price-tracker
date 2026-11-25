variable "name_prefix" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "vnet_name" {
  type = string
}

variable "app_subnet_cidr" {
  type = string
}

variable "bastion_subnet_cidr" {
  type = string
}

variable "app_container_port" {
  type = number
}

variable "vm_size" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "ssh_public_keys" {
  type = list(string)
}
