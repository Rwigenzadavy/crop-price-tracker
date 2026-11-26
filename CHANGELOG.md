# Changelog

All notable project changes are documented in this file.

## [Summative] - 2026-11-26

### Added
- Azure private application VM deployment architecture.
- Azure Load Balancer for public application access.
- Azure Database for PostgreSQL Flexible Server with private networking.
- Azure Container Registry integration.
- GitHub Actions CD workflow for deployment after successful CI on `main`.
- Ansible deployment through the jumpbox to the private application VM.
- Application health verification including database connectivity.

### Improved
- Terraform infrastructure security checks and documented Checkov exceptions.
- CI security scanning using npm audit, Trivy, Checkov and Gitleaks.
- Deployment image tagging using Git commit SHA.
- Protected application environment variables during deployment.

### Verification
- Terraform formatting and validation passed.
- CI build and test checks passed.
- Infrastructure-as-code scanning passed.
- Security scanning passed.

### Pending verification
- Successful post-merge CD deployment.
- Public Load Balancer URL and database connectivity verification.
- Final infrastructure lifecycle demonstration.

## [F3] - 2026-11-13

### Added
- Terraform infrastructure on Azure.
- Ansible playbook for server configuration and container deployment.
- CI security scans using npm audit, Trivy, Checkov and Gitleaks.
- SECURITY.md vulnerability reporting policy.

## [F2] - 2026-10-31

### Added
- ESLint configuration.
- Dockerfile with non-root user.
- Docker Compose configuration.
- GitHub Actions CI pipeline for linting, testing and Docker builds.

## [F1] - 2026-10-23

### Added
- Express API with crop price, search, filter and cheapest-market endpoints.
- JSON sample data containing five crops and three markets.
- Frontend dashboard using HTML, CSS and JavaScript.
- Jest and Supertest tests.
- Initial README and project structure.