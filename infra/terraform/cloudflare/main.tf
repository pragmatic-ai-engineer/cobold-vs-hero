locals {
  app_hostname = var.record_name == "@" ? var.zone_name : "${var.record_name}.${var.zone_name}"
}

resource "cloudflare_dns_record" "cobold_app" {
  zone_id = var.zone_id
  name    = var.record_name
  content = var.origin_ipv4
  type    = "A"
  ttl     = var.ttl
  proxied = var.proxied
  comment = var.record_comment
}

resource "cloudflare_dns_record" "cobold_preview_wildcard" {
  count = var.preview_wildcard_enabled ? 1 : 0

  zone_id = var.zone_id
  name    = var.preview_wildcard_record_name
  content = var.origin_ipv4
  type    = "A"
  ttl     = var.ttl
  proxied = var.proxied
  comment = var.preview_wildcard_record_comment
}
