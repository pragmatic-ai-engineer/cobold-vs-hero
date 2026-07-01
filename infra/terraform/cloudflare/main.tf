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
