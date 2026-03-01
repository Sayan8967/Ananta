variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "repository_names" {
  description = "List of ECR repository names to create"
  type        = list(string)
  default = [
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
}
