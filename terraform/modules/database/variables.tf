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

variable "vnet_id" {
  type = string
}

variable "db_subnet_cidr" {
  type    = string
  default = "10.0.3.0/24"
}

variable "admin_username" {
  type    = string
  default = "croptrackadmin"
}

variable "db_name" {
  type    = string
  default = "croptrack"
}

variable "sku_name" {
  type    = string
  default = "B_Standard_B1ms"
}

variable "storage_mb" {
  type    = number
  default = 32768
}
