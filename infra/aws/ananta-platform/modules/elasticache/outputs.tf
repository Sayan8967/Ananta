output "replication_group_id" {
  description = "ID of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.this.id
}

output "replication_group_arn" {
  description = "ARN of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.this.arn
}

output "primary_endpoint_address" {
  description = "Primary endpoint address of the Redis replication group"
  value       = aws_elasticache_replication_group.this.primary_endpoint_address
}

output "reader_endpoint_address" {
  description = "Reader endpoint address of the Redis replication group"
  value       = aws_elasticache_replication_group.this.reader_endpoint_address
}

output "port" {
  description = "Port number of the Redis cluster"
  value       = aws_elasticache_replication_group.this.port
}

output "security_group_id" {
  description = "Security group ID for the ElastiCache cluster"
  value       = aws_security_group.redis.id
}
