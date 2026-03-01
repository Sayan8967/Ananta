################################################################################
# RDS Outputs
################################################################################

output "rds_endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "rds_address" {
  description = "Hostname of the RDS instance"
  value       = module.rds.db_instance_address
}

output "rds_port" {
  description = "Port of the RDS instance"
  value       = module.rds.db_instance_port
}

output "rds_db_name" {
  description = "Name of the default database"
  value       = module.rds.db_name
}

output "rds_master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret for RDS master user password"
  value       = module.rds.db_master_user_secret_arn
}

output "rds_security_group_id" {
  description = "Security group ID for the RDS instance"
  value       = module.rds.db_security_group_id
}

################################################################################
# DocumentDB Outputs
################################################################################

output "docdb_endpoint" {
  description = "Primary endpoint for the DocumentDB cluster"
  value       = module.documentdb.cluster_endpoint
}

output "docdb_reader_endpoint" {
  description = "Reader endpoint for the DocumentDB cluster"
  value       = module.documentdb.cluster_reader_endpoint
}

output "docdb_port" {
  description = "Port of the DocumentDB cluster"
  value       = module.documentdb.cluster_port
}

output "docdb_master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret for DocumentDB master user password"
  value       = module.documentdb.cluster_master_user_secret_arn
}

output "docdb_security_group_id" {
  description = "Security group ID for the DocumentDB cluster"
  value       = module.documentdb.security_group_id
}
