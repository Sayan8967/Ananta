################################################################################
# KMS Key for S3 Encryption
################################################################################

resource "aws_kms_key" "s3" {
  description             = "KMS key for S3 bucket encryption ${var.env_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.env_name}-s3-kms"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_kms_alias" "s3" {
  name          = "alias/${var.env_name}-s3"
  target_key_id = aws_kms_key.s3.key_id
}

################################################################################
# Prescriptions Bucket
################################################################################

resource "aws_s3_bucket" "prescriptions" {
  bucket = "${var.env_name}-ananta-prescriptions-${var.region}"

  tags = {
    Name        = "${var.env_name}-ananta-prescriptions"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
    Purpose     = "prescriptions"
  }
}

resource "aws_s3_bucket_versioning" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }
}

################################################################################
# Documents Bucket
################################################################################

resource "aws_s3_bucket" "documents" {
  bucket = "${var.env_name}-ananta-documents-${var.region}"

  tags = {
    Name        = "${var.env_name}-ananta-documents"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
    Purpose     = "documents"
  }
}

resource "aws_s3_bucket_versioning" "documents" {
  bucket = aws_s3_bucket.documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "documents" {
  bucket = aws_s3_bucket.documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }
}

################################################################################
# Backups Bucket
################################################################################

resource "aws_s3_bucket" "backups" {
  bucket = "${var.env_name}-ananta-backups-${var.region}"

  tags = {
    Name        = "${var.env_name}-ananta-backups"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
    Purpose     = "backups"
  }
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "transition-to-glacier"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = var.backup_expiration_days
    }
  }
}

################################################################################
# S3 Bucket Logging (all buckets log to backups bucket)
################################################################################

resource "aws_s3_bucket_logging" "prescriptions" {
  bucket = aws_s3_bucket.prescriptions.id

  target_bucket = aws_s3_bucket.backups.id
  target_prefix = "s3-access-logs/prescriptions/"
}

resource "aws_s3_bucket_logging" "documents" {
  bucket = aws_s3_bucket.documents.id

  target_bucket = aws_s3_bucket.backups.id
  target_prefix = "s3-access-logs/documents/"
}
