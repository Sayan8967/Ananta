#!/usr/bin/env bash
################################################################################
# Terraform Backend Initialization Script
#
# Creates S3 bucket and DynamoDB table for Terraform state management.
#
# Usage:
#   ./init.sh <environment>
#
# Examples:
#   ./init.sh dev-ap-south-1
#   ./init.sh prod-ap-south-1
#   ./init.sh prod-us-east-1
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

usage() {
  echo "Usage: $0 <environment>"
  echo ""
  echo "Supported environments:"
  echo "  dev-ap-south-1"
  echo "  prod-ap-south-1"
  echo "  prod-us-east-1"
  exit 1
}

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Validate arguments
if [[ $# -ne 1 ]]; then
  usage
fi

ENVIRONMENT="$1"

# Map environment to AWS region
case "$ENVIRONMENT" in
  dev-ap-south-1)
    REGION="ap-south-1"
    ENV_NAME="dev"
    ;;
  prod-ap-south-1)
    REGION="ap-south-1"
    ENV_NAME="prod"
    ;;
  prod-us-east-1)
    REGION="us-east-1"
    ENV_NAME="prod"
    ;;
  *)
    log_error "Unknown environment: $ENVIRONMENT"
    usage
    ;;
esac

BUCKET_NAME="ananta-terraform-state-${ENVIRONMENT}"
DYNAMODB_TABLE="ananta-terraform-locks-${ENVIRONMENT}"

log_info "Initializing Terraform backend for environment: ${ENVIRONMENT}"
log_info "  Region:         ${REGION}"
log_info "  S3 Bucket:      ${BUCKET_NAME}"
log_info "  DynamoDB Table: ${DYNAMODB_TABLE}"
echo ""

################################################################################
# Create S3 Bucket
################################################################################

log_info "Creating S3 bucket: ${BUCKET_NAME}"

if aws s3api head-bucket --bucket "${BUCKET_NAME}" --region "${REGION}" 2>/dev/null; then
  log_warn "S3 bucket '${BUCKET_NAME}' already exists, skipping creation."
else
  # ap-south-1 and us-east-1 have different bucket creation semantics
  if [[ "$REGION" == "us-east-1" ]]; then
    aws s3api create-bucket \
      --bucket "${BUCKET_NAME}" \
      --region "${REGION}"
  else
    aws s3api create-bucket \
      --bucket "${BUCKET_NAME}" \
      --region "${REGION}" \
      --create-bucket-configuration LocationConstraint="${REGION}"
  fi
  log_info "S3 bucket created successfully."
fi

# Enable versioning
log_info "Enabling versioning on S3 bucket..."
aws s3api put-bucket-versioning \
  --bucket "${BUCKET_NAME}" \
  --versioning-configuration Status=Enabled \
  --region "${REGION}"

# Enable server-side encryption
log_info "Enabling server-side encryption on S3 bucket..."
aws s3api put-bucket-encryption \
  --bucket "${BUCKET_NAME}" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "aws:kms"
        },
        "BucketKeyEnabled": true
      }
    ]
  }' \
  --region "${REGION}"

# Block public access
log_info "Blocking public access on S3 bucket..."
aws s3api put-public-access-block \
  --bucket "${BUCKET_NAME}" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --region "${REGION}"

# Add tags
log_info "Tagging S3 bucket..."
aws s3api put-bucket-tagging \
  --bucket "${BUCKET_NAME}" \
  --tagging "TagSet=[
    {Key=Environment,Value=${ENV_NAME}},
    {Key=ManagedBy,Value=terraform-bootstrap},
    {Key=Project,Value=ananta},
    {Key=Purpose,Value=terraform-state}
  ]" \
  --region "${REGION}"

################################################################################
# Create DynamoDB Table
################################################################################

log_info "Creating DynamoDB table: ${DYNAMODB_TABLE}"

if aws dynamodb describe-table --table-name "${DYNAMODB_TABLE}" --region "${REGION}" 2>/dev/null; then
  log_warn "DynamoDB table '${DYNAMODB_TABLE}' already exists, skipping creation."
else
  aws dynamodb create-table \
    --table-name "${DYNAMODB_TABLE}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --tags \
      Key=Environment,Value="${ENV_NAME}" \
      Key=ManagedBy,Value=terraform-bootstrap \
      Key=Project,Value=ananta \
      Key=Purpose,Value=terraform-locks \
    --region "${REGION}"

  log_info "Waiting for DynamoDB table to become active..."
  aws dynamodb wait table-exists \
    --table-name "${DYNAMODB_TABLE}" \
    --region "${REGION}"
  log_info "DynamoDB table created successfully."
fi

# Enable point-in-time recovery
log_info "Enabling point-in-time recovery on DynamoDB table..."
aws dynamodb update-continuous-backups \
  --table-name "${DYNAMODB_TABLE}" \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true \
  --region "${REGION}"

echo ""
log_info "=========================================="
log_info "Backend initialization complete!"
log_info "=========================================="
echo ""
log_info "You can now initialize Terraform with:"
echo ""
echo "  terraform init \\"
echo "    -backend-config=\"bucket=${BUCKET_NAME}\" \\"
echo "    -backend-config=\"region=${REGION}\" \\"
echo "    -backend-config=\"dynamodb_table=${DYNAMODB_TABLE}\" \\"
echo "    -backend-config=\"encrypt=true\""
echo ""
