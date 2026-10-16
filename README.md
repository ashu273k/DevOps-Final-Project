# TaskBoard DevSecOps Capstone

TaskBoard is a small project-management application used to demonstrate a complete DevSecOps workflow. It includes a React frontend, FastAPI backend, PostgreSQL, automated tests, Docker, GitHub Actions, Trivy, GHCR, Terraform, EKS, Kubernetes, Helm, Prometheus, and Grafana.

## Architecture

```text
Developer -> GitHub -> GitHub Actions -> GHCR
                                      |
                           Terraform -> AWS VPC + EKS
                                      |
                         Helm -> Frontend -> Backend -> PostgreSQL
                                      |
                              Prometheus -> Grafana
```

## Technology Stack

- Frontend: React, Vite, Nginx
- Backend: Python, FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL
- Testing: Pytest and an isolated SQLite test database
- Delivery: Docker Compose, GitHub Actions, GHCR
- Security: Trivy image scanning for HIGH and CRITICAL vulnerabilities
- Infrastructure: Terraform, AWS VPC, EKS, managed node group
- Platform: Kubernetes, Helm, Ingress, HPA
- Observability: Prometheus, ServiceMonitor, Grafana

## Repository Layout

```text
backend/                 FastAPI application, migrations, and tests
frontend/                React application and Nginx configuration
docker-compose.yml       Local frontend, backend, and PostgreSQL stack
.github/workflows/       GitHub Actions CI/CD workflow
terraform/               AWS VPC and EKS infrastructure
helm/taskboard/          Kubernetes Helm chart
k8s/                     Namespace and standalone manifests
monitoring/              Prometheus and Grafana values
troubleshooting/         Deliberately broken Kubernetes examples
demo/                    Final presentation slides and video
```

## Modular DevOps Documentation

The implementation is documented by topic in [`docs/README.md`](docs/README.md). The docs cover local development, CI/CD and security gates, Terraform and AWS, Kubernetes and Helm, observability, and screenshot-based submission evidence.

## Run Locally with Docker Compose

Requirements:

- Docker Engine and Docker Compose

Start the stack:

```bash
docker compose up --build
```

Open the frontend at `http://localhost:3000`.

Useful backend URLs:

```text
http://localhost:8000/docs
http://localhost:8000/health
http://localhost:8000/metrics
```

The PostgreSQL container is published on host port `5433` to avoid conflicts with a locally installed PostgreSQL server. Inside Compose, the backend still connects to `postgres:5432`.

Stop the stack:

```bash
docker compose down
```

Remove the local database volume too:

```bash
docker compose down -v
```

## Backend Development and Tests

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -v
```

The tests use `DATABASE_URL=sqlite:///./test.db` and create isolated tables for the test session. They do not use the production PostgreSQL database.

The API includes:

```text
GET    /health
GET    /ready
GET    /metrics
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
GET    /api/tasks/stats
```

## Frontend Build

```bash
cd frontend
npm ci
npm run build
```

The frontend Dockerfile uses a Node build stage and an Nginx runtime stage. Nginx proxies `/api` requests to the backend service.

## GitHub Actions CI/CD

The active workflow is `.github/workflows/ci-cd.yml`.

On pull requests and pushes, it:

1. Installs backend dependencies.
2. Runs the Pytest suite.
3. Builds the frontend with `npm ci`.

On pushes to `main`, it also:

1. Builds backend and frontend images.
2. Scans both images with Trivy.
3. Fails when unfixed HIGH or CRITICAL findings are detected.
4. Publishes both images to GHCR.

Images are tagged with the full Git commit SHA:

```text
ghcr.io/YOUR_GITHUB_USERNAME/taskboard-backend:COMMIT_SHA
ghcr.io/YOUR_GITHUB_USERNAME/taskboard-frontend:COMMIT_SHA
```

The workflow requires package write permission. It does not automatically deploy to Kubernetes; Helm deployment is performed after the EKS cluster is available.

## AWS Credentials

Install and configure the AWS CLI locally. Do not commit credentials.

```bash
aws configure
aws sts get-caller-identity
```

The default region for this project is `ap-south-1`.

## Terraform and EKS

Terraform creates the VPC, public and private subnets, NAT gateway, EKS cluster, and managed worker node group. The example variables are in `terraform/terraform.tfvars.example`.

```bash
cd terraform
terraform init
terraform fmt -check -recursive
terraform validate
terraform plan
terraform apply
```

The current classroom configuration uses one `t3.micro` worker by default because some accounts restrict instance types to Free Tier-eligible resources. AWS control-plane, NAT Gateway, and other resources may still incur charges.

Configure kubectl after the cluster is ready:

```bash
aws eks update-kubeconfig --region ap-south-1 --name taskboard-eks
kubectl get nodes
```

Destroy all infrastructure after the demonstration:

```bash
terraform destroy
```

## Kubernetes and Helm

The normal deployment path is the Helm chart:

```bash
helm upgrade --install taskboard ./helm/taskboard \
  --namespace taskboard \
  --create-namespace \
  --values helm/taskboard/values-dev.yaml \
  --set replicaCount=1 \
  --set backend.image=ghcr.io/YOUR_GITHUB_USERNAME/taskboard-backend \
  --set backend.tag=COMMIT_SHA \
  --set frontend.image=ghcr.io/YOUR_GITHUB_USERNAME/taskboard-frontend \
  --set frontend.tag=COMMIT_SHA
```

Check the release:

```bash
kubectl get pods -n taskboard
kubectl get svc -n taskboard
kubectl get ingress -n taskboard
helm list -n taskboard
```

The small worker configuration uses one replica for the classroom demonstration. A larger node group can run two frontend and two backend replicas to meet the high-availability rubric target.

The Ingress expects an Nginx Ingress Controller and the hostname `taskboard.local`. An Ingress resource alone does not provide a controller.

## Prometheus and Grafana

Install the Prometheus Operator before enabling the chart's `ServiceMonitor`:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install kube-prometheus-stack \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring/prometheus-values.yaml
```

Then enable the TaskBoard ServiceMonitor:

```bash
helm upgrade taskboard ./helm/taskboard \
  --namespace taskboard \
  --values helm/taskboard/values-dev.yaml \
  --set monitoring.serviceMonitor.enabled=true
```

Verify the monitoring resources:

```bash
kubectl get servicemonitor -n taskboard
kubectl get pods -n monitoring
```

To test the backend metrics endpoint locally:

```bash
kubectl port-forward -n taskboard svc/taskboard-taskboard-backend 8000:8000
curl http://localhost:8000/metrics
```

Prometheus should show the TaskBoard target as `UP`. Grafana should contain a populated HTTP request or latency panel.

## Troubleshooting

Useful commands:

```bash
kubectl describe pod POD_NAME -n taskboard
kubectl get events -n taskboard --sort-by=.lastTimestamp
kubectl get endpoints -n taskboard
kubectl logs deployment/taskboard-taskboard-backend -n taskboard
```

Common problems:

- `Pending`: inspect Pod events and node allocatable CPU/memory.
- `ImagePullBackOff`: make the GHCR packages public or configure an image pull secret.
- `ServiceMonitor` CRD error: install `kube-prometheus-stack` before enabling the ServiceMonitor.
- Port `5432` conflict: Compose publishes PostgreSQL on host port `5433`.
- `Ingress` has no address: install an Ingress Controller.

## Submission Evidence

The final `demo/` directory should contain:

```text
demo/presentation.pdf or demo/slides.pptx
demo/presentation.mp4
```

The video should show the slides first, then the application, CI/CD run, GHCR images, Terraform plan and AWS resources, Kubernetes and Helm resources, Prometheus target, Grafana dashboard, and cleanup. No AWS credentials, kubeconfig files, Terraform state, or other secrets should be committed.

## Known Limitations

- PostgreSQL is deployed inside Kubernetes for classroom demonstration; production systems should normally use a managed database such as Amazon RDS.
- The current CI workflow publishes images but does not perform automatic Kubernetes deployment.
- The default small AWS node group is intended for a short demonstration and may not have enough capacity for every monitoring component simultaneously.
- ArgoCD configuration is not included in this repository; add it only if the course requires a live GitOps demonstration.
