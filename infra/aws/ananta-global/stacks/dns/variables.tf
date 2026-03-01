variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "domain_name" {
  description = "Root domain name for hosted zones"
  type        = string
}

variable "state_bucket" {
  description = "S3 bucket name for Terraform remote state"
  type        = string
}
