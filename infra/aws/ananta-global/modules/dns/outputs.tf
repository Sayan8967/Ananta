output "public_zone_id" {
  description = "ID of the public Route53 hosted zone"
  value       = aws_route53_zone.public.zone_id
}

output "private_zone_id" {
  description = "ID of the private Route53 hosted zone"
  value       = aws_route53_zone.private.zone_id
}

output "public_zone_name_servers" {
  description = "Name servers for the public hosted zone"
  value       = aws_route53_zone.public.name_servers
}

output "public_zone_name" {
  description = "Name of the public hosted zone"
  value       = aws_route53_zone.public.name
}

output "private_zone_name" {
  description = "Name of the private hosted zone"
  value       = aws_route53_zone.private.name
}
