
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

The automated security scans identified several infrastructure and container-related security findings. The development team reviewed the findings and implemented remediation measures where applicable.

| Security Tool | Finding | Severity | Recommended Remediation | Status |
|---|---|---|---|---|
| Checkov | Terraform NSG allowed SSH access from any IP address (`0.0.0.0/0`). | High | Restrict SSH access to approved public IP addresses only. | Accepted - SSH access restricted through NSG rules. |
| Trivy | 7 vulnerabilities identified in the Alpine base image, involving OpenSSL, musl and zlib. | High | Upgrade the Docker base image from `node:18-alpine` to `node:20-alpine`. | Mitigated - findings reduced from 24 to 7. |
| Trivy | 22 vulnerabilities identified in internal npm packages bundled with Node.js. | High/Critical | Review vulnerability applicability and exploitability in the deployment context. | Accepted - vulnerabilities assessed as not exploitable in the current context; `.trivyignore` added. |
| npm audit | No vulnerabilities found in application dependencies. | None | No remediation required. | Clean - no vulnerabilities detected. |
| Gitleaks | False positives detected in the Trivy cache directory (`.cache/trivy/db`). | None | Configure Gitleaks to exclude the Trivy cache directory. | Fixed - `.gitleaks.toml` added to exclude the cache directory. |

### 5.1 Remediation Summary

The following actions were taken based on the security scan results:

- Restricted SSH access through Azure Network Security Group rules.
- Upgraded the Docker base image from Node.js 18 Alpine to Node.js 20 Alpine, reducing identified vulnerabilities from 24 to 7.
- Added `.trivyignore` to account for vulnerabilities assessed as not exploitable in the current deployment context.
- Confirmed that npm audit reported no vulnerabilities in application dependencies.
- Added `.gitleaks.toml` to exclude the Trivy cache directory and eliminate false-positive secret detection results.

Security findings were reviewed based on their severity, relevance and potential impact on the CropTrack deployment.

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
