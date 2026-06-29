output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "client_url" {
  description = "URL to access the client application"
  value       = "http://${aws_lb.main.dns_name}/"
}

output "server_api_url" {
  description = "URL to access the server API"
  value       = "http://${aws_lb.main.dns_name}/api"
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}
