# TaskBoard DevOps Documentation

This section explains how TaskBoard moves from source code to a monitored workload on Kubernetes. Each page focuses on one operational concern and links the implementation to repository files and captured evidence.

## Documentation map

| Topic | What it covers |
|---|---|
| [Local development](01-local-development.md) | Application services, tests, builds, and the local Docker workflow |
| [CI/CD and security](02-ci-cd-security.md) | GitHub Actions, SHA-tagged images, Trivy gates, and GHCR |
| [Terraform and AWS](03-terraform-aws.md) | VPC, subnets, NAT, EKS, node groups, and lifecycle commands |
| [Kubernetes and Helm](04-kubernetes-helm.md) | Chart values, Deployments, Services, Ingress, HPA, and release checks |
| [Observability](05-observability.md) | Metrics, Prometheus, ServiceMonitor, Grafana, and troubleshooting |
| [Evidence index](06-evidence.md) | Screenshot catalogue mapped to the workflow and grading modules |

## End-to-end flow

```text
Code change
    -> GitHub Actions tests and frontend build
    -> Docker image build
    -> Trivy HIGH/CRITICAL gate
    -> GHCR image published with commit SHA
    -> Helm release on EKS
    -> Prometheus scrape and Grafana dashboard
```

## Repository conventions

- The default AWS region is `ap-south-1`.
- The Kubernetes namespace is `taskboard`.
- The local frontend is exposed at `http://localhost:3000` and the backend at `http://localhost:8000`.
- Commands that create AWS resources should be followed by `terraform destroy` after the demonstration.
- Credentials, kubeconfig files, and Terraform state must not be committed.