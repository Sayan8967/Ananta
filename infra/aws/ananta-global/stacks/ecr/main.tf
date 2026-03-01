################################################################################
# ECR Stack - Container Registries
################################################################################

module "ecr" {
  source = "../../modules/ecr"

  env_name         = var.env_name
  repository_names = var.repository_names
}
