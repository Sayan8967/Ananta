################################################################################
# Cache Stack - ElastiCache Redis
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

module "elasticache" {
  source = "../../modules/elasticache"

  env_name              = var.env_name
  vpc_id                = data.terraform_remote_state.networking.outputs.vpc_id
  private_subnet_ids    = data.terraform_remote_state.networking.outputs.private_subnet_ids
  app_security_group_id = data.terraform_remote_state.compute.outputs.cluster_security_group_id

  node_type                = var.redis_node_type
  num_cache_nodes          = var.redis_num_cache_nodes
  snapshot_retention_limit = var.redis_snapshot_retention_limit
}
