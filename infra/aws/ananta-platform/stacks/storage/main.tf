################################################################################
# Storage Stack - S3 Buckets
################################################################################

module "s3" {
  source = "../../modules/s3"

  env_name               = var.env_name
  region                 = var.region
  backup_expiration_days = var.backup_expiration_days
}
