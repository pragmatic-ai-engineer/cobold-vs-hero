variable "zone_id" {
  description = "Cloudflare zone ID for zone_name."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.zone_id) > 0
    error_message = "zone_id must not be empty."
  }
}

variable "zone_name" {
  description = "Cloudflare zone name that hosts the workshop app record."
  type        = string
  default     = "pragmatic-ai.engineer"
}

variable "record_name" {
  description = "DNS record name inside zone_name. Use cobold for cobold.pragmatic-ai.engineer."
  type        = string
  default     = "cobold"
}

variable "origin_ipv4" {
  description = "Public IPv4 address of the pai server."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$", var.origin_ipv4))
    error_message = "origin_ipv4 must be a valid IPv4 address."
  }
}

variable "proxied" {
  description = "Whether Cloudflare should proxy the record. Keep false until Cloudflare TLS/origin settings are verified."
  type        = bool
  default     = false
}

variable "ttl" {
  description = "DNS TTL in seconds. Cloudflare uses 1 for automatic TTL."
  type        = number
  default     = 1

  validation {
    condition     = var.ttl == 1 || (var.ttl >= 60 && var.ttl <= 86400)
    error_message = "ttl must be 1 for automatic TTL or a value from 60 through 86400."
  }
}

variable "record_comment" {
  description = "Cloudflare DNS record comment."
  type        = string
  default     = "Managed by Terraform for cobold-vs-hero workshop deployment."
}

variable "preview_wildcard_enabled" {
  description = "Whether to manage *.cobold.<zone_name> for pull request preview deployments."
  type        = bool
  default     = true
}

variable "preview_wildcard_record_name" {
  description = "Wildcard DNS record name for pull request preview deployments."
  type        = string
  default     = "*.cobold"
}

variable "preview_wildcard_record_comment" {
  description = "Cloudflare DNS record comment for pull request preview deployments."
  type        = string
  default     = "Managed by Terraform for cobold-vs-hero pull request previews."
}
