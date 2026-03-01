variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "vpc_id" {
  description = "VPC ID where DocumentDB will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the DocumentDB subnet group"
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "At least 2 private subnets are required for DocumentDB."
  }
}

variable "app_security_group_id" {
  description = "Security group ID of the application (EKS nodes) allowed to access DocumentDB"
  type        = string
}

variable "instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "instance_count" {
  description = "Number of DocumentDB cluster instances"
  type        = number
  default     = 1
}

variable "master_username" {
  description = "Master username for the DocumentDB cluster"
  type        = string
  default     = "ananta_admin"
}

variable "backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = false
}
