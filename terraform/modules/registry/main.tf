
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

resource "azurerm_container_registry" "acr" {
  #checkov:skip=CKV_AZURE_163:Advanced vulnerability scanning is outside the current coursework deployment scope.
  #checkov:skip=CKV_AZURE_167:Untagged manifest retention is deferred for this coursework deployment.
  #checkov:skip=CKV_AZURE_233:Zone redundancy is not required for this single-region deployment.
  #checkov:skip=CKV_AZURE_165:Geo-replication is not required for this single-region deployment.
  #checkov:skip=CKV_AZURE_139:Public registry access is needed by the GitHub-hosted deployment runner.
  #checkov:skip=CKV_AZURE_237:Dedicated data endpoints are unnecessary for this deployment.
  #checkov:skip=CKV_AZURE_164:Image signing is not implemented in the current pipeline.
  #checkov:skip=CKV_AZURE_137:The current pipeline uses ACR admin credentials stored as GitHub secrets.
  #checkov:skip=CKV_AZURE_166:Image quarantine and verification are not implemented in the current pipeline.
  name                = "acr${replace(var.name_prefix, "-", "")}${random_string.suffix.result}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.sku
  admin_enabled       = true
}
