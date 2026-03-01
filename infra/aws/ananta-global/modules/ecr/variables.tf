variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "repository_names" {
  description = "List of ECR repository names to create"
  type        = list(string)

  validation {
    condition     = length(var.repository_names) > 0
    error_message = "At least one repository name must be provided."
  }
}
