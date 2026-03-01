################################################################################
# ACM Certificate
################################################################################

resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  tags = {
    Name        = "${var.env_name}-acm-cert"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

################################################################################
# DNS Validation Records
################################################################################

resource "aws_route53_record" "validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  allow_overwrite = true
  name            = each.value.name
  type            = each.value.type
  zone_id         = var.route53_zone_id
  records         = [each.value.record]
  ttl             = 60
}

################################################################################
# Certificate Validation
################################################################################

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}
