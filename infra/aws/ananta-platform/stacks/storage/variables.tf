variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "state_bucket" {
  description = "S3 bucket name for Terraform remote state"
  type        = string
}

variable "backup_expiration_days" {
  description = "Number of days after which backup objects expire"
  type        = number
  default     = 365
}
