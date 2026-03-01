variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "single_nat_gateway" {
  description = "Use a single NAT Gateway instead of one per AZ"
  type        = bool
  default     = true
}
