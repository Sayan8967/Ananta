################################################################################
# Compute Stack - EKS Cluster
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

module "eks" {
  source = "../../modules/eks"

  env_name           = var.env_name
  vpc_id             = data.terraform_remote_state.networking.outputs.vpc_id
  private_subnet_ids = data.terraform_remote_state.networking.outputs.private_subnet_ids
  cluster_version    = var.cluster_version
  node_instance_types = var.node_instance_types
  node_desired_count = var.node_desired_count
  node_min_count     = var.node_min_count
  node_max_count     = var.node_max_count
}
