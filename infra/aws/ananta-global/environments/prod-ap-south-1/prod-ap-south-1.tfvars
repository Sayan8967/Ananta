env_name           = "prod"
region             = "ap-south-1"
vpc_cidr           = "10.1.0.0/16"
single_nat_gateway = false
domain_name        = "ananta.health"
state_bucket       = "ananta-terraform-state-prod-ap-south-1"

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
