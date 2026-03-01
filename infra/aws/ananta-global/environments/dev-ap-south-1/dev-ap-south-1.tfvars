env_name           = "dev"
region             = "ap-south-1"
vpc_cidr           = "10.0.0.0/16"
single_nat_gateway = true
domain_name        = "dev.ananta.health"
state_bucket       = "ananta-terraform-state-dev-ap-south-1"

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
