variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "domain_name" {
  description = "Primary domain name for the ACM certificate"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9*][a-z0-9.-]+[a-z0-9]$", var.domain_name))
    error_message = "domain_name must be a valid domain name."
  }
}

variable "subject_alternative_names" {
  description = "List of Subject Alternative Names (SANs) for the certificate"
  type        = list(string)
  default     = []
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS validation"
  type        = string
}
