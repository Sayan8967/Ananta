output "cluster_id" {
  description = "ID of the EKS cluster"
  value       = aws_eks_cluster.this.id
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "Endpoint URL for the EKS cluster API server"
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data for the cluster"
  value       = aws_eks_cluster.this.certificate_authority[0].data
}

output "cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = aws_eks_cluster.this.arn
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_security_group.eks_cluster.id
}

output "node_group_arn" {
  description = "ARN of the EKS managed node group"
  value       = aws_eks_node_group.this.arn
}

output "node_role_arn" {
  description = "ARN of the IAM role used by EKS worker nodes"
  value       = aws_iam_role.eks_nodes.arn
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC Provider for IRSA"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "URL of the OIDC Provider for IRSA"
  value       = aws_iam_openid_connect_provider.eks.url
}

output "cluster_version" {
  description = "Kubernetes version of the EKS cluster"
  value       = aws_eks_cluster.this.version
}
