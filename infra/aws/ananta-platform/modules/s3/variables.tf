variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "region" {
  description = "AWS region (used in bucket naming for global uniqueness)"
  type        = string
}

variable "backup_expiration_days" {
  description = "Number of days after which backup objects expire"
  type        = number
  default     = 365
}
