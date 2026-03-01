output "public_zone_id" {
  description = "ID of the public Route53 hosted zone"
  value       = module.dns.public_zone_id
}

output "private_zone_id" {
  description = "ID of the private Route53 hosted zone"
  value       = module.dns.private_zone_id
}

output "public_zone_name_servers" {
  description = "Name servers for the public hosted zone"
  value       = module.dns.public_zone_name_servers
}
