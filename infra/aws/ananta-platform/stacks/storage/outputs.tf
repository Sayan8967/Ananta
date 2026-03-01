output "prescriptions_bucket_id" {
  description = "ID of the prescriptions S3 bucket"
  value       = module.s3.prescriptions_bucket_id
}

output "prescriptions_bucket_arn" {
  description = "ARN of the prescriptions S3 bucket"
  value       = module.s3.prescriptions_bucket_arn
}

output "documents_bucket_id" {
  description = "ID of the documents S3 bucket"
  value       = module.s3.documents_bucket_id
}

output "documents_bucket_arn" {
  description = "ARN of the documents S3 bucket"
  value       = module.s3.documents_bucket_arn
}

output "backups_bucket_id" {
  description = "ID of the backups S3 bucket"
  value       = module.s3.backups_bucket_id
}

output "backups_bucket_arn" {
  description = "ARN of the backups S3 bucket"
  value       = module.s3.backups_bucket_arn
}

output "s3_kms_key_arn" {
  description = "ARN of the KMS key used for S3 encryption"
  value       = module.s3.s3_kms_key_arn
}
