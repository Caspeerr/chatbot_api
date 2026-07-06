########################################
# Frontend — S3 + CloudFront
########################################

# S3 bucket to hold the built React static files
resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name

  tags = {
    Project = "CONC"
    Owner   = "frontend"
  }
}

# Block all public access — CloudFront reaches the bucket via
# Origin Access Control (OAC), not a public bucket policy
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Origin Access Control — lets CloudFront authenticate to the
# private S3 bucket without the bucket needing to be public
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.frontend_bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # cheapest tier — NA/EU edges only, fine for a student project

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "s3-frontend-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods          = ["GET", "HEAD"]
    target_origin_id       = "s3-frontend-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress                = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # React Router / client-side routing fix:
  # any path S3 doesn't have (e.g. /todos/5) gets a 403 from S3 —
  # CloudFront rewrites that to index.html so React Router can handle it
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # using *.cloudfront.net domain, no custom domain/ACM needed
  }

  tags = {
    Project = "CONC"
    Owner   = "frontend"
  }
}

# Bucket policy — only allow access from THIS CloudFront distribution
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}