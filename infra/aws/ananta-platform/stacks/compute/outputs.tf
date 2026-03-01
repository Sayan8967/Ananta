output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint URL for the EKS cluster API server"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data for the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "node_role_arn" {
  description = "ARN of the IAM role used by EKS worker nodes"
  value       = module.eks.node_role_arn
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC Provider for IRSA"
  value       = module.eks.oidc_provider_arn
}

output "oidc_provider_url" {
  description = "URL of the OIDC Provider for IRSA"
  value       = module.eks.oidc_provider_url
}

output "cluster_version" {
  description = "Kubernetes version of the EKS cluster"
  value       = module.eks.cluster_version
}
