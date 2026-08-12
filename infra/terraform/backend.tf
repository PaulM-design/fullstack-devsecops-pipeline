terraform {
  backend "s3" {
    bucket         = "paulm-design-fullstack-devsecops-terraform-state"
    key            = "devsecops-demo/production.tfstate"
    region         = "us-east-1"
    dynamodb_table = "paulm-design-fullstack-devsecops-terraform-locks"
    encrypt        = true
  }
}

