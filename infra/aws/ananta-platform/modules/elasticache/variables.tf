variable "env_name" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+$", var.env_name))
    error_message = "env_name must start with a letter and contain only lowercase alphanumeric characters and hyphens."
  }
}

variable "vpc_id" {
  description = "VPC ID where ElastiCache will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the ElastiCache subnet group"
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "At least 2 private subnets are required for ElastiCache."
  }
}

variable "app_security_group_id" {
  description = "Security group ID of the application (EKS nodes) allowed to access Redis"
  type        = string
}

variable "node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.medium"
}

variable "num_cache_nodes" {
  description = "Number of cache nodes in the replication group"
  type        = number
  default     = 1
}

variable "snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 7
}
