output "app_hostname" {
  description = "Workshop hostname managed by this Terraform stack."
  value       = local.app_hostname
}

output "proxied" {
  description = "Whether the app hostname is proxied through Cloudflare."
  value       = cloudflare_dns_record.cobold_app.proxied
}

output "record_id" {
  description = "Cloudflare DNS record ID."
  value       = cloudflare_dns_record.cobold_app.id
}
