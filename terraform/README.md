# Terraform - CropTrack Azure Infrastructure

## Overview

Terraform provisions the Azure infrastructure used by CropTrack.

The infrastructure includes:

- Resource group and virtual network.
- Public jumpbox VM.
- Private application subnet and VM.
- Network security groups.
- Azure Load Balancer and public IP.
- Azure PostgreSQL Flexible Server.
- Private DNS zone and virtual network link.
- Azure Container Registry.

## Prerequisites

- Terraform 1.5 or newer.
- Azure CLI.
- Authenticated Azure subscription.
- SSH key pair.
- Required Azure permissions.

## Directory Structure

```text
terraform/
├── main.tf
├── app.tf
├── outputs.tf
├── variables.tf
├── modules/
│   ├── compute/
│   ├── database/
│   ├── loadbalancer/
│   └── registry/
└── README.md
```

## Network Architecture

| Component | Network |
|---|---|
| Virtual network | `10.0.0.0/16` |
| Jumpbox subnet | `10.0.1.0/24` |
| Application subnet | `10.0.2.0/24` |
| Database subnet | Configured using `db_subnet_cidr` |
| Application VM | Private IP, currently configured as `10.0.2.4` |

The application VM is not assigned a public IP. Administration is performed through the jumpbox.

## Terraform Workflow

Initialize the Terraform working directory:

```bash
terraform -chdir=terraform init
```

Format Terraform files:

```bash
terraform -chdir=terraform fmt -recursive
```

Validate the configuration:

```bash
terraform -chdir=terraform validate
```

Review planned infrastructure changes:

```bash
terraform -chdir=terraform plan
```

**Important:** Apply and destroy operations must be coordinated with the team member maintaining the shared Terraform state. Do not independently create or destroy shared Azure resources.

## Outputs

After infrastructure has been provisioned, useful outputs include:

| Output | Description |
|---|---|
| `bastion_ip` | Public IP of the jumpbox |
| `app_private_ip` | Private IP of the application VM |
| `lb_public_ip` | Public IP of the Load Balancer |
| `app_url` | Public application URL |
| `db_fqdn` | PostgreSQL server hostname |
| `db_name` | Application database name |
| `acr_login_server` | Azure Container Registry hostname |

Retrieve outputs:

```bash
terraform -chdir=terraform output
```

Retrieve the application URL:

```bash
terraform -chdir=terraform output app_url
```

Sensitive database and registry credentials must never be published in documentation or committed to Git.

## Security

- The application VM is privately addressed.
- SSH administration uses key-based authentication.
- Network security groups restrict inbound traffic.
- PostgreSQL public network access is disabled.
- PostgreSQL uses delegated subnet and private DNS configuration.
- Terraform state and secrets must remain outside version control.

## Teardown

Destroying infrastructure is a team-coordinated operation.

Before destroying resources:

1. Confirm the team has approved the operation.
2. Confirm the correct Terraform state is available.
3. Check which resources depend on the infrastructure.
4. Ensure any required demonstration or evidence has been collected.

Run `terraform destroy` only through the agreed state-owning workflow.

## Notes

- Do not commit `terraform.tfvars`, Terraform state files or secret credentials.
- Use the same shared state when managing existing infrastructure.
- Avoid enabling additional paid Azure features unless the team has agreed to the cost.