
# Ansible Configuration Management - CropTrack

## Overview

This directory contains Ansible automation used to configure
the Azure Ubuntu virtual machine and deploy the CropTrack
application.

The application is deployed using the published Docker image:

rwigenza1davy/croptrack:latest

The application runs inside Docker on port 3000 and is
exposed publicly through port 80.

## Directory Structure

- site.yml: Main Ansible deployment playbook.
- inventory.ini: Azure VM inventory.
- ansible.cfg: Ansible configuration.
- group_vars/webservers.yml: Application and environment variables.
- README.md: Documentation.

## Prerequisites

- Ansible installed on the control machine.
- An Azure Ubuntu virtual machine.
- SSH access to the Azure VM.
- A valid SSH private key.
- Docker image available in Docker Hub.
- Python Docker SDK installed on the remote server.

## Install Ansible

```bash
sudo apt update
sudo apt install ansible -y
```

## Install Required Collections

```bash
ansible-galaxy collection install community.docker community.general ansible.posix
```

## Configure Inventory

Update inventory.ini with:

- Azure VM public IP address.
- SSH username (azureuser).
- SSH private key location.

## Configure Application Variables

Edit group_vars/webservers.yml.

The configuration defines:

- Docker image.
- Public application port.
- SSH port.
- Authorized teammate public SSH keys.

## Test Server Connectivity

From the project root:

```bash
ansible webservers -i ansible/inventory.ini -m ping
```

## Run the Playbook

```bash
ansible-playbook -i ansible/inventory.ini ansible/site.yml
```

## Verify Deployment

Check running Docker containers:

```bash
ansible webservers -i ansible/inventory.ini -a "docker ps"
```

Check application health:

```bash
curl http://102.37.96.80/health
```

Check SSH service:

```bash
ansible webservers -i ansible/inventory.ini -a "sudo systemctl status ssh"
```

## Security Configuration

The playbook implements:

1. Docker-based application deployment.
2. UFW firewall configuration.
3. SSH root login restriction.
4. SSH authentication hardening.
5. Authorized SSH public keys for teammates.
6. Automatic Docker container restart.

## Network Configuration

The Azure Network Security Group must allow:

- TCP port 22 for SSH administration.
- TCP port 80 for public application access.

The Docker container listens internally on port 3000.
Docker maps host port 80 to container port 3000.

Note: Docker-published ports can bypass ordinary UFW
filtering. Azure NSG rules must therefore be used as
the primary cloud-level network access control.

## Deployment Architecture

Internet -> Azure NSG -> Ubuntu VM -> Docker -> CropTrack

## Application Image

Docker Hub:

rwigenza1davy/croptrack:latest

The playbook pulls the published image rather than
rebuilding the application from source.
