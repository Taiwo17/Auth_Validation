variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
}

variable "docker_image" {
  description = "Public Docker Hub Image to deploy"
  type        = string
}

variable "allowed_cidr" {
  description = "Your public IPv4 address in /32 CIDR format"
  type        = string

  validation {
    condition = (
      can(cidrnetmask(var.allowed_cidr)) &&
      can(regex("/32$", var.allowed_cidr))
    )
    error_message = "Use your public IPv4 address with /32, not 0.0.0.0/0."
  }
}


variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

