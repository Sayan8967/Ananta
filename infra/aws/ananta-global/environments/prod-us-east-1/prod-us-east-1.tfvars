env_name           = "prod"
region             = "us-east-1"
vpc_cidr           = "10.2.0.0/16"
single_nat_gateway = false
domain_name        = "us.ananta.health"
state_bucket       = "ananta-terraform-state-prod-us-east-1"

repository_names = [
  "api-gateway",
  "auth-service",
  "patient-service",
  "appointment-service",
  "clinical-service",
  "notification-service",
  "billing-service",
  "document-service",
  "analytics-service",
  "web-app"
]
