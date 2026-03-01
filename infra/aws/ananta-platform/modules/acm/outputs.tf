output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.this.arn
}

output "certificate_domain_name" {
  description = "Domain name of the ACM certificate"
  value       = aws_acm_certificate.this.domain_name
}

output "certificate_status" {
  description = "Status of the ACM certificate"
  value       = aws_acm_certificate.this.status
}

output "certificate_domain_validation_options" {
  description = "Domain validation options for the certificate"
  value       = aws_acm_certificate.this.domain_validation_options
}
