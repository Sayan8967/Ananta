variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "vpc_cidr must be a valid CIDR block."
  }
}

variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "single_nat_gateway" {
  description = "Use a single NAT Gateway instead of one per AZ (cost saving for non-prod)"
  type        = bool
  default     = true
}
