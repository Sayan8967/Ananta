output "redis_primary_endpoint" {
  description = "Primary endpoint address of the Redis replication group"
  value       = module.elasticache.primary_endpoint_address
}

output "redis_reader_endpoint" {
  description = "Reader endpoint address of the Redis replication group"
  value       = module.elasticache.reader_endpoint_address
}

output "redis_port" {
  description = "Port number of the Redis cluster"
  value       = module.elasticache.port
}

output "redis_security_group_id" {
  description = "Security group ID for the ElastiCache cluster"
  value       = module.elasticache.security_group_id
}
