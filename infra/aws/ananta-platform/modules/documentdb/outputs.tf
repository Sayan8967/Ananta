output "cluster_id" {
  description = "ID of the DocumentDB cluster"
  value       = aws_docdb_cluster.this.id
}

output "cluster_arn" {
  description = "ARN of the DocumentDB cluster"
  value       = aws_docdb_cluster.this.arn
}

output "cluster_endpoint" {
  description = "Primary endpoint for the DocumentDB cluster"
  value       = aws_docdb_cluster.this.endpoint
}

output "cluster_reader_endpoint" {
  description = "Reader endpoint for the DocumentDB cluster"
  value       = aws_docdb_cluster.this.reader_endpoint
}

output "cluster_port" {
  description = "Port of the DocumentDB cluster"
  value       = aws_docdb_cluster.this.port
}

output "cluster_master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret for the master user password"
  value       = aws_docdb_cluster.this.master_user_secret[0].secret_arn
}

output "security_group_id" {
  description = "Security group ID for the DocumentDB cluster"
  value       = aws_security_group.docdb.id
}
