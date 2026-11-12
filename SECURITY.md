
# CropTrack Security Documentation

## 1. Introduction

This document describes the security measures implemented during the deployment of CropTrack on Microsoft Azure. It covers infrastructure security, network access controls, server hardening, automated security scanning, identified vulnerabilities, and application verification.

The objective is to ensure that CropTrack is deployed using secure infrastructure configurations and that potential security vulnerabilities are identified and addressed throughout the development and deployment process.

## 2. Infrastructure Security

CropTrack is hosted on Microsoft Azure using Terraform for Infrastructure as Code (IaC).

The infrastructure was deployed in the South Africa North region under the resource group `rg-croptrack-dev`.

The deployed infrastructure includes:

- Resource Group: `rg-croptrack-dev`
- Virtual Network: `vnet-croptrack-dev`
- Subnet: `snet-croptrack-dev`
- Network Security Group: `nsg-croptrack-dev`
- Public IP: `102.37.96.80`
- Virtual Machine: `vm-croptrack-dev`
- Operating System: Ubuntu 22.04.5 LTS

### 2.1 Network Security

A Network Security Group (NSG) was configured to control inbound traffic to the virtual machine.

The network access configuration includes:

| Port | Protocol | Access | Purpose |
|---|---|---|---|
| 22 | TCP | Restricted to approved IP addresses | SSH remote administration |
| 80 | TCP | Public | HTTP application access |

SSH access is restricted to approved public IP addresses to reduce unauthorized remote access. HTTP traffic is publicly accessible to allow users to access the CropTrack application.

## 3. Server Security and Hardening

The CropTrack application server runs Ubuntu 22.04.5 LTS.

Ansible is used to automate server configuration and security hardening.

The planned server configuration includes:

- Installation and configuration of Docker.
- Firewall configuration.
- SSH security hardening.
- Configuration of authorized SSH public keys.
- Restriction of administrative access.
- Deployment of the CropTrack application in a Docker container.

The final implementation status and verification evidence will be updated after the Ansible playbook has been executed successfully.

## 4. Automated Security Scanning

The project integrates automated security checks into its GitHub Actions CI/CD workflow.

The security tools used include:

### 4.1 Checkov

Checkov scans Terraform infrastructure code to identify security misconfigurations and infrastructure security risks.

### 4.2 Trivy

Trivy scans container images and identifies known vulnerabilities in operating system packages and application dependencies.

### 4.3 npm audit

npm audit checks project dependencies against known vulnerability databases and identifies packages with reported security issues.

### 4.4 Gitleaks

Gitleaks scans the repository for accidentally committed secrets, credentials, API keys, and other sensitive information.

These tools help identify security issues early in the development process and support continuous security monitoring.

## 5. Security Findings and Remediation

Security scan findings will be documented below as the automated scans are completed.

| Security Tool | Finding | Severity | Recommended Remediation | Status |
|---|---|---|---|---|
| Checkov | Pending scan results | TBD | Review and remediate Terraform security misconfigurations | Pending |
| Trivy | Pending scan results | TBD | Update vulnerable packages and rebuild affected images | Pending |
| npm audit | Pending scan results | TBD | Update or replace vulnerable dependencies | Pending |
| Gitleaks | Pending scan results | TBD | Remove exposed secrets and rotate affected credentials | Pending |

All findings will be reviewed and prioritized according to their severity and potential impact.

## 6. Application Security and Verification

Following server configuration and application deployment, the CropTrack application will be tested to verify that it is accessible and functioning correctly.

The application health endpoint is:

`http://102.37.96.80/health`

The endpoint will be used to verify application availability and confirm that the deployed service responds successfully.

Screenshots and test results will be added as deployment evidence.

## 7. Security Evidence

The following evidence will be included to demonstrate the security implementation:

1. Terraform deployment output showing successful infrastructure creation.
2. SSH login to the Azure virtual machine.
3. Azure resource group and network security configuration.
4. Ansible playbook execution results.
5. GitHub Actions security scan results.
6. Application health endpoint response.

## 8. Security Recommendations

The following practices are recommended to maintain the security of the CropTrack deployment:

- Restrict SSH access to trusted IP addresses.
- Use SSH public-key authentication for authorized users.
- Avoid storing passwords, private keys, or credentials in the Git repository.
- Regularly update system packages and Docker images.
- Review security scan findings and address vulnerabilities.
- Maintain secure firewall configurations.
- Monitor application availability and server activity.

## 9. Conclusion

CropTrack incorporates infrastructure security controls, restricted remote access, automated vulnerability scanning, and server hardening as part of its DevSecOps implementation.

The combination of Terraform, Ansible, Docker, and GitHub Actions supports a repeatable deployment process and helps integrate security checks throughout the software development lifecycle.

Final security findings, remediation actions, and deployment verification evidence will be documented following completion of the remaining integration activities.
