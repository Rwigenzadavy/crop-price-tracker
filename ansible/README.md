# Ansible - CropTrack Deployment

## Overview

Ansible automates the configuration of the private Azure application VM and deployment of CropTrack.

The deployment uses a Docker image stored in Azure Container Registry (ACR).

The application VM is privately addressed and is accessed through the public jumpbox using SSH ProxyJump.

## Deployment Architecture

```text
GitHub Actions
      |
      v
Azure Container Registry
      |
      v
Ansible deployment
      |
      v
Public jumpbox
      |
      | SSH ProxyJump
      v
Private application VM
      |
      v
Docker Compose
      |
      v
CropTrack container
      |
      v
PostgreSQL Flexible Server
```

## Directory Structure

- `site.yml`: Main deployment playbook.
- `inventory.ini`: Ansible inventory.
- `ansible.cfg`: Ansible configuration.
- `group_vars/webservers.yml`: Application and database connection settings.
- `requirements.yml`: Pinned Ansible collections.

## Prerequisites

- Ansible installed on the control machine.
- SSH access to the jumpbox.
- SSH configuration allowing access to the private VM through the jumpbox.
- Azure Container Registry credentials.
- PostgreSQL database credentials.
- Required Ansible collections.

## Install Ansible

On Ubuntu:

```bash
sudo apt update
sudo apt install ansible -y
```

## Install Required Collections

```bash
ansible-galaxy collection install -r ansible/requirements.yml
```

The project pins the following collection versions:

- `community.docker` 4.8.1
- `community.general` 11.4.1
- `ansible.posix` 2.1.0

## Inventory and SSH Access

The Ansible inventory identifies the private application VM.

SSH access is routed through the jumpbox using ProxyJump. The CD workflow prepares the SSH configuration and known-hosts information using GitHub Actions secrets.

The private VM should not be accessed through a public IP.

## Application Configuration

The deployment uses the following settings:

| Variable | Purpose |
|---|---|
| `acr_login_server` | Azure Container Registry hostname |
| `image_repository` | Application image repository |
| `image_tag` | Git commit SHA used for deployment |
| `db_host` | PostgreSQL server hostname |
| `db_port` | PostgreSQL port |
| `db_name` | Application database |
| `db_user` | Database username |
| `db_password` | Database password |

Credentials are passed securely through GitHub Actions secrets and are not stored in the repository.

## Deployment Process

The Ansible playbook performs the following tasks:

1. Updates the Ubuntu package cache.
2. Installs required dependencies.
3. Installs Docker Engine and Docker Compose.
4. Starts and enables the Docker service.
5. Creates `/opt/croptrack`.
6. Authenticates to Azure Container Registry.
7. Copies the Docker Compose configuration.
8. Creates a protected environment file with database settings.
9. Deploys the application using Docker Compose.
10. Checks application health and database connectivity.

## Continuous Deployment

The GitHub Actions CD workflow starts after a successful CI workflow on a push to `main`.

It checks out the exact commit that passed CI, prepares SSH access, installs Ansible and the required collections, and runs the deployment playbook.

The application image is tagged using the Git commit SHA.

## Deployment Verification

The playbook checks the local application health endpoint:

```text
http://127.0.0.1:3000/health
```

A successful response must indicate:

```json
{
  "status": "ok",
  "database": "connected"
}
```

The playbook requires HTTP 200 and a connected database before reporting a successful deployment.

The public application endpoint is exposed through the Azure Load Balancer.

## Security

- SSH key-based administration.
- Private application VM without a public IP.
- SSH access through the jumpbox.
- ACR authentication using protected credentials.
- Database credentials stored in a root-owned environment file with restricted permissions.
- Ansible tasks handling credentials use `no_log` where appropriate.
- PostgreSQL public network access is disabled.

## Important Notes

- Do not commit passwords, private keys or GitHub secrets.
- Do not replace the private VM architecture with a publicly exposed application VM.
- Infrastructure operations must be coordinated with the team member maintaining Terraform state.
- A successful Ansible deployment includes both application and database health verification.