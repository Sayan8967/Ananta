################################################################################
# Route53 Public Hosted Zone
################################################################################

resource "aws_route53_zone" "public" {
  name    = var.domain_name
  comment = "Public hosted zone for ${var.env_name} - ${var.domain_name}"

  tags = {
    Name        = "${var.env_name}-public-zone"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
    Visibility  = "public"
  }
}

################################################################################
# Route53 Private Hosted Zone
################################################################################

resource "aws_route53_zone" "private" {
  name    = "internal.${var.domain_name}"
  comment = "Private hosted zone for ${var.env_name} - internal.${var.domain_name}"

  vpc {
    vpc_id = var.vpc_id
  }

  tags = {
    Name        = "${var.env_name}-private-zone"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
    Visibility  = "private"
  }
}
