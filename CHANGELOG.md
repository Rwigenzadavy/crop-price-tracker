# Changelog

## [Summative] - 2026-11-26

### Added
- CD workflow for auto-deploy to Azure VM on push to main
- CHENGELOG.md file for documenting the process

## [F3] - 2026-11-13

### Added
- Terraform infrastructure on Azure
- Ansible playbook to install Docker, deploy container, and harden SSH
- CI security scans: npm audit, Trivy, Checkov, Gitleaks
- SECURITY.md with vulnerability reporting policy

## [F2] - 2026-10-31

### Added
- ESLint configuration
- Dockerfile with non-root user
- docker-compose.yml
- GitHub Actions CI pipeline (lint, test, docker build)

## [F1] - 2026-10-23

### Added
- Express API with prices, search, filter, and cheapest endpoints
- JSON data file which was used as storage contain 5 crops and 3 markets
- Frontend dashboard (HTML, CSS, JavaScript)
- Jest and Supertest tests
- README and project structure
