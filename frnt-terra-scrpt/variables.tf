variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "frontend_bucket_name" {
  description = "Globally unique S3 bucket name for the frontend static site"
  type        = string
  default     = "sambrid-terraform-state-bucket"
}