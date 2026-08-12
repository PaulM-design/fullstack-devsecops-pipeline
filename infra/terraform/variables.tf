variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "project_name" {
  type    = string
  default = "devsecops-demo"
}
variable "github_repository" {
  type        = string
  description = "GitHub repository in owner/name form"
}
variable "container_image" {
  type        = string
  description = "Immutable API image URI; deploy workflow creates subsequent revisions"
}
variable "desired_count" {
  type    = number
  default = 1
}
