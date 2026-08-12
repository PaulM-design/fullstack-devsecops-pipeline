terraform {
  backend "s3" {
    # Replace these bootstrap values before `terraform init`.
    bucket         = "REPLACE_ME-devsecops-terraform-state"
    key            = "devsecops-demo/production.tfstate"
    region         = "us-east-1"
    dynamodb_table = "REPLACE_ME-terraform-locks"
    encrypt        = true
  }
}

