################################################################################
# Backend Configuration for prod-us-east-1
################################################################################
# Usage: terraform init -backend-config=backend.tf
#
# This file is used with:
#   terraform init \
#     -backend-config="bucket=ananta-terraform-state-prod-us-east-1" \
#     -backend-config="region=us-east-1" \
#     -backend-config="dynamodb_table=ananta-terraform-locks-prod-us-east-1" \
#     -backend-config="encrypt=true"
################################################################################

bucket         = "ananta-terraform-state-prod-us-east-1"
region         = "us-east-1"
dynamodb_table = "ananta-terraform-locks-prod-us-east-1"
encrypt        = true
