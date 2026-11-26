
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

# Checkov skips for the coursework registry configuration
#checkov:skip=CKV_AZURE_163:Advanced vulnerability scanning is outside the current coursework deployment scope and may require additional Azure security services.
#checkov:skip=CKV_AZURE_167:Untagged manifest retention is deferred to avoid introducing an untested registry lifecycle policy.
#checkov:skip=CKV_AZURE_233:Zone redundancy is not required for this single-region coursework deployment.
#checkov:skip=CKV_AZURE_165:Geo-replication is not required for this single-region deployment and would add cost.
#checkov:skip=CKV_AZURE_139:Public registry access is needed by the GitHub-hosted deployment runner; registry authentication remains enabled.
#checkov:skip=CKV_AZURE_237:Dedicated data endpoints are unnecessary for the current single-region deployment.
#checkov:skip=CKV_AZURE_164:Image signing is not yet implemented in the CI/CD pipeline.
#checkov:skip=CKV_AZURE_137:The current deployment pipeline uses ACR admin credentials stored as GitHub secrets; disabling the account requires migrating to another authentication method.
#checkov:skip=CKV_AZURE_166:Image quarantine and verification are not implemented in the current deployment pipeline
resource "azurerm_container_registry" "acr" {
  name                = "acr${replace(var.name_prefix, "-", "")}${random_string.suffix.result}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.sku
  admin_enabled       = true
}
