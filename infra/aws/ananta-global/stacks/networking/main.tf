################################################################################
# Networking Stack - VPC
################################################################################

module "vpc" {
  source = "../../modules/vpc"

  env_name           = var.env_name
  region             = var.region
  vpc_cidr           = var.vpc_cidr
  single_nat_gateway = var.single_nat_gateway
}
