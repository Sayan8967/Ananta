terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    key = "states/networking.tfstate"
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = var.env_name
      ManagedBy   = "terraform"
      Project     = "ananta"
      Stack       = "networking"
    }
  }
}
