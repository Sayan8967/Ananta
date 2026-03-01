################################################################################
# Database Stack - RDS PostgreSQL + DocumentDB
################################################################################

# Read networking remote state for VPC and subnet information
data "terraform_remote_state" "networking" {
  backend = "s3"

  config = {
    bucket = var.state_bucket
    key    = "states/networking.tfstate"
    region = var.region
  }
}

# Read compute remote state for EKS security group
data "terraform_remote_state" "compute" {
  backend = "s3"

  config = {
    bucket = var.state_bucket
    key    = "states/compute.tfstate"
    region = var.region
  }
}

################################################################################
# RDS PostgreSQL
################################################################################

module "rds" {
  source = "../../modules/rds"

  env_name              = var.env_name
  vpc_id                = data.terraform_remote_state.networking.outputs.vpc_id
  private_subnet_ids    = data.terraform_remote_state.networking.outputs.private_subnet_ids
  app_security_group_id = data.terraform_remote_state.compute.outputs.cluster_security_group_id

  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  max_allocated_storage   = var.rds_max_allocated_storage
  database_name           = var.rds_database_name
  master_username         = var.rds_master_username
  multi_az                = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention_period
  deletion_protection     = var.rds_deletion_protection
}

################################################################################
# DocumentDB
################################################################################

module "documentdb" {
  source = "../../modules/documentdb"

  env_name              = var.env_name
  vpc_id                = data.terraform_remote_state.networking.outputs.vpc_id
  private_subnet_ids    = data.terraform_remote_state.networking.outputs.private_subnet_ids
  app_security_group_id = data.terraform_remote_state.compute.outputs.cluster_security_group_id

  instance_class          = var.docdb_instance_class
  instance_count          = var.docdb_instance_count
  master_username         = var.docdb_master_username
  backup_retention_period = var.docdb_backup_retention_period
  deletion_protection     = var.docdb_deletion_protection
}
