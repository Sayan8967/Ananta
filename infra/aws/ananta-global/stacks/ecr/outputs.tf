output "repository_urls" {
  description = "Map of repository name to repository URL"
  value       = module.ecr.repository_urls
}

output "repository_arns" {
  description = "Map of repository name to repository ARN"
  value       = module.ecr.repository_arns
}
