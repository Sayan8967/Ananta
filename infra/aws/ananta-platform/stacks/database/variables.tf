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

################################################################################
# RDS Variables
################################################################################

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "rds_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "Maximum allocated storage for RDS autoscaling in GB"
  type        = number
  default     = 100
}

variable "rds_database_name" {
  description = "Name of the default PostgreSQL database"
  type        = string
  default     = "ananta"
}

variable "rds_master_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "ananta_admin"
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

variable "rds_backup_retention_period" {
  description = "Number of days to retain RDS backups"
  type        = number
  default     = 7
}

variable "rds_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = false
}

################################################################################
# DocumentDB Variables
################################################################################

variable "docdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "docdb_instance_count" {
  description = "Number of DocumentDB cluster instances"
  type        = number
  default     = 1
}

variable "docdb_master_username" {
  description = "Master username for the DocumentDB cluster"
  type        = string
  default     = "ananta_admin"
}

variable "docdb_backup_retention_period" {
  description = "Number of days to retain DocumentDB backups"
  type        = number
  default     = 7
}

variable "docdb_deletion_protection" {
  description = "Enable deletion protection for DocumentDB"
  type        = bool
  default     = false
}
