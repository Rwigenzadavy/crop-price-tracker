# Terraform: CropTrack infrastructure on Azure

Provisions the infrastructure for CropTrack: a resource group, virtual network and subnet,
a network security group (SSH restricted, HTTP public), a static public IP, and one Ubuntu 22.04 VM.

## Prerequisites
- Terraform >= 1.5
- Azure CLI (`az login`), or Azure Cloud Shell (already authenticated)
- An Azure subscription that can create VMs in the chosen region
- An SSH key pair: `ssh-keygen -t rsa -b 4096 -f ~/.ssh/alu-devops -N ""`

## Variables
| Name | Description | Default |
|---|---|---|
| `project_name` | Name prefix for resources | `croptrack` |
| `environment` | Environment label | `dev` |
| `location` | Azure region | `southafricanorth` |
| `vm_size` | VM size | `Standard_DS1_v2` |
| `admin_username` | VM admin user | `azureuser` |
| `ssh_public_keys` | List of SSH public keys allowed on the VM | none (required) |
| `allowed_ssh_cidrs` | CIDRs allowed to SSH (port 22) | none (required) |
| `app_port` | Public web port | `80` |
| `vnet_cidr` / `subnet_cidr` | Network ranges | `10.0.0.0/16` / `10.0.1.0/24` |

## Usage
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # edit with your keys and IPs
terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform output
```

## Outputs
`public_ip_address`, `vm_id`, `vnet_id`, `resource_group_name`, `ssh_command`.

## Connect
```bash
ssh -i ~/.ssh/alu-devops azureuser@<public_ip_address>
```

## Destroy
```bash
terraform destroy
```

## Notes
- `terraform.tfvars` and state files are git-ignored. Never commit keys or state.
- Azure for Students limits regions and VM sizes. If apply fails with `SkuNotAvailable`,
  change `vm_size` or `location` in `terraform.tfvars`.
- The provider block sets `resource_provider_registrations = "none"` because automatic
  registration of every Azure provider stalls on student subscriptions.
- Changing `ssh_public_keys` replaces the VM. Prefer managing extra keys with Ansible after first deploy.
