################################################################################
# Backend Configuration for prod-ap-south-1
################################################################################
# Usage: terraform init -backend-config=backend.tf
#
# This file is used with:
#   terraform init \
#     -backend-config="bucket=ananta-terraform-state-prod-ap-south-1" \
#     -backend-config="region=ap-south-1" \
#     -backend-config="dynamodb_table=ananta-terraform-locks-prod-ap-south-1" \
#     -backend-config="encrypt=true"
################################################################################

bucket         = "ananta-terraform-state-prod-ap-south-1"
region         = "ap-south-1"
dynamodb_table = "ananta-terraform-locks-prod-ap-south-1"
encrypt        = true
