

variable "project_name" {
  type    = string
  default = "croptrack"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "southafricanorth"
}

variable "vm_size" {
  type    = string
  default = "Standard_DS1_v2"
}

variable "admin_username" {
  type    = string
  default = "azureuser"
}

variable "ssh_public_keys" {
  description = "SSH public keys allowed on the VM (one per teammate)"
  type        = list(string)
}

variable "allowed_ssh_cidrs" {
  description = "CIDRs allowed to SSH, e.g. [\"203.0.113.5/32\"]"
  type        = list(string)
}

variable "app_port" {
  description = "Public port for the website"
  type        = number
  default     = 80
}

variable "vnet_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}
