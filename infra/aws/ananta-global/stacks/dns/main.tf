################################################################################
# DNS Stack - Route53 Hosted Zones
################################################################################

# Read networking remote state for VPC ID
data "terraform_remote_state" "networking" {
  backend = "s3"

  config = {
    bucket = var.state_bucket
    key    = "states/networking.tfstate"
    region = var.region
  }
}

module "dns" {
  source = "../../modules/dns"

  env_name    = var.env_name
  domain_name = var.domain_name
  vpc_id      = data.terraform_remote_state.networking.outputs.vpc_id
}
