# Evidence Index

The screenshots in [`docs/images`](images) provide a visual record of the DevOps workflow. Use them alongside the live commands in the topic pages during the final demonstration.

| Evidence | Screenshot |
|---|---|
| Application running | [`application_running.png`](images/application_running.png) |
| OpenAPI documentation | [`Open_api_documentation.png`](images/Open_api_documentation.png) |
| Health check | [`health_ping.png`](images/health_ping.png) |
| Backend environment | [`backend_virtual_env_stepup.png`](images/backend_virtual_env_stepup.png) |
| Passing tests | [`running_test.png`](images/running_test.png) |
| Docker Compose build | [`docker_compose_built.png`](images/docker_compose_built.png) |
| Docker Compose shutdown | [`docker_compose_down.png`](images/docker_compose_down.png) |
| CI/CD success | [`CI-CD_passed_all.png`](images/CI-CD_passed_all.png) |
| Git push and image publication | [`git-pushing.png`](images/git-pushing.png), [`git_image.png`](images/git_image.png) |
| Terraform plan, apply, and destroy | [`terraform.png`](images/terraform.png), [`terraform_apply.png`](images/terraform_apply.png), [`terraform_destroy.png`](images/terraform_destroy.png) |
| AWS resources | [`aws_instances_created.png`](images/aws_instances_created.png), [`verifying_aws_instances.png`](images/verifying_aws_instances.png) |
| Helm and Kubernetes | [`helm.png`](images/helm.png), [`kubernetes_pods_svc.png`](images/kubernetes_pods_svc.png) |
| Metrics and monitoring | [`metrics.png`](images/metrics.png), [`application_metric.png`](images/application_metric.png), [`svc_monitor.png`](images/svc_monitor.png), [`helm_prometus.png`](images/helm_prometus.png) |

## Suggested presentation order

1. Show the application and API documentation.
2. Show passing tests and the Docker Compose stack.
3. Show the GitHub Actions run and SHA-tagged images.
4. Show Terraform plan/apply and the AWS resources.
5. Show the Helm release, pods, and Services.
6. Show the metrics endpoint, ServiceMonitor, Prometheus target, and Grafana panel.
7. Finish with `terraform destroy` evidence and the known limitations in the root README.