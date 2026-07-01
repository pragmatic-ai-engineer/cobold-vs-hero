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

output "preview_wildcard_hostname" {
  description = "Wildcard hostname for pull request preview deployments."
  value       = var.preview_wildcard_enabled ? "${var.preview_wildcard_record_name}.${var.zone_name}" : null
}

output "preview_wildcard_record_id" {
  description = "Cloudflare DNS wildcard record ID for pull request previews."
  value       = var.preview_wildcard_enabled ? cloudflare_dns_record.cobold_preview_wildcard[0].id : null
}
