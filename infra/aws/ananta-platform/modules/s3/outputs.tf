output "prescriptions_bucket_id" {
  description = "ID of the prescriptions S3 bucket"
  value       = aws_s3_bucket.prescriptions.id
}

output "prescriptions_bucket_arn" {
  description = "ARN of the prescriptions S3 bucket"
  value       = aws_s3_bucket.prescriptions.arn
}

output "documents_bucket_id" {
  description = "ID of the documents S3 bucket"
  value       = aws_s3_bucket.documents.id
}

output "documents_bucket_arn" {
  description = "ARN of the documents S3 bucket"
  value       = aws_s3_bucket.documents.arn
}

output "backups_bucket_id" {
  description = "ID of the backups S3 bucket"
  value       = aws_s3_bucket.backups.id
}

output "backups_bucket_arn" {
  description = "ARN of the backups S3 bucket"
  value       = aws_s3_bucket.backups.arn
}

output "s3_kms_key_arn" {
  description = "ARN of the KMS key used for S3 encryption"
  value       = aws_kms_key.s3.arn
}
