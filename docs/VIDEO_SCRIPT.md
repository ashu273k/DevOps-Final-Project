# TaskBoard DevSecOps Capstone — Recording Script

Target length: 5–7 minutes. Record from the actual repository and environment. The submitted video is mandatory under `GRADING.md`; this script is a guide, not a substitute for the recording.

## 1. Open with the slides (0:00–1:15)

Show `presentation.pptx` or `presentation.pdf` first. Explain the goal: demonstrate a small React/FastAPI/PostgreSQL app delivered through tests, containerization, image security scanning, Terraform, Kubernetes/Helm and observability. Walk through the architecture and clarify that the documented workflow publishes images to GHCR but a Helm deployment is a separate step.

Suggested narration: “A code change is tested first. On pushes to main, the frontend and backend images are built, scanned with Trivy, and published with the commit SHA as the tag. Terraform provisions AWS networking and EKS. Helm deploys the application, and Prometheus/Grafana provide metrics.”

## 2. Codebase and running application (1:15–2:00)

Open the repository. Point to `backend/`, `frontend/`, `.github/workflows/`, `terraform/`, `helm/taskboard/`, `k8s/`, `monitoring/` and `docs/`. Show the app in the browser and then `/docs` and `/health`; mention `/ready` and `/metrics`. If helpful, show the local Compose command `docker compose up --build` and the mapped frontend/API/database ports.

Evidence file names to locate in advance: `docs/images/application_running.png`, `docs/images/Open_api_documentation.png`, `docs/images/health_ping.png`, `docs/images/docker_compose_built.png`.

## 3. Tests and CI/CD/security (2:00–2:50)

Show the current `pytest -v` result or Actions test job, then open a successful GitHub Actions run. Explain the test/frontend-build stage and the main-branch image build, Trivy scan and GHCR publication. Show the actual run URL, scan output and image package page. Point out the immutable full commit-SHA tags; read the SHA from the real run rather than using a placeholder.

Evidence file names: `docs/images/running_test.png`, `docs/images/CI-CD_passed_all.png`, `docs/images/git-pushing.png`, `docs/images/git_image.png`.

## 4. Terraform and AWS proof (2:50–3:40)

Show `terraform/` and a fresh `terraform plan` output. In the AWS Console, show the VPC/subnets and EKS cluster in `ap-south-1`. Explain what the plan will create before applying anything. Use live output; old screenshots should be presented only as historical evidence. After the demonstration, run `terraform destroy` and show successful completion to demonstrate cost awareness.

Evidence file names: `docs/images/terraform.png`, `docs/images/terraform_apply.png`, `docs/images/aws_instances_created.png`, `docs/images/verifying_aws_instances.png`, `docs/images/terraform_destroy.png`.

## 5. ArgoCD / GitOps segment (3:40–4:10)

The rubric's video checklist explicitly asks for the synced ArgoCD application and GitOps flow. The repository docs reviewed for this deliverable do not describe an ArgoCD installation or app manifest. Only include this segment after the application is actually configured: show the real ArgoCD application state, sync status, source repo/revision and destination cluster/namespace. If ArgoCD has not been configured, do not simulate a synced UI or claim it is present; resolve the rubric requirement before submission.

## 6. Kubernetes and Helm (4:10–5:00)

Show live outputs:

```bash
kubectl get pods -n taskboard
kubectl get svc -n taskboard
kubectl get ingress -n taskboard
helm list -n taskboard
```

Explain frontend/backend Services, Ingress routing and the Helm release. The rubric expects at least two frontend and two backend replicas; confirm the actual pod counts. The repository's small development values use one replica, so switch to an appropriate values/capacity configuration if necessary and demonstrate the actual result.

Evidence file names: `docs/images/helm.png`, `docs/images/kubernetes_pods_svc.png`.

## 7. Prometheus and Grafana (5:00–5:50)

Show `/metrics` output, the ServiceMonitor, Prometheus Targets with the TaskBoard target `UP`, then a Grafana dashboard with a populated request/latency panel. Explain that metrics include request counts, response latency and status codes. Capture fresh screenshots of Prometheus Targets and the Grafana panel if the indexed screenshots do not explicitly show these views.

Evidence file names: `docs/images/metrics.png`, `docs/images/application_metric.png`, `docs/images/svc_monitor.png`, `docs/images/helm_prometus.png`.

## 8. Close (5:50–6:10)

Summarize the delivery chain and key learning: reproducibility, security gates, SHA traceability, infrastructure as code and operational visibility. Mention any real limitations honestly. If AWS resources were created for this session, show the destroy result or confirm teardown completed.

## Pre-record checklist

- [ ] Slide deck opens and all 13 slides render correctly.
- [ ] Repository URL and actual Actions run URL are ready to show.
- [ ] Live application/API proof is working.
- [ ] Pytest output is current and uses the isolated test database.
- [ ] GHCR tags match the displayed commit SHA.
- [ ] Terraform plan and AWS Console show the expected resources.
- [ ] ArgoCD is configured and synced if this rubric requirement is being assessed.
- [ ] Kubernetes pod counts, Services, Ingress and Helm release are healthy.
- [ ] Prometheus target is `UP` and Grafana has a populated panel.
- [ ] MP4 is saved under `demo/` or uploaded as an accepted release asset.
- [ ] AWS demonstration resources have been destroyed after recording.
