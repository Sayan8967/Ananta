###############################################################################
# Ananta — Lightweight AWS Deployment (Single EC2)
#
# Cost estimate: ~$21/month
#   - t3.medium (ap-south-1): ~$18/month
#   - 30GB gp3 EBS:           ~$2.40/month
#   - Elastic IP:              Free (attached)
#
# Usage:
#   cd deploy/terraform
#   terraform init
#   terraform plan
#   terraform apply
#
# After apply:
#   ssh -i ananta-key.pem ubuntu@<PUBLIC_IP>
#   cd /home/ubuntu/ananta && ./deploy/setup-server.sh
###############################################################################

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  default     = "ap-south-1"
  description = "AWS region"
}

variable "instance_type" {
  default     = "t3.medium"
  description = "EC2 instance type (t3.medium = 2 vCPU, 4GB RAM)"
}

variable "key_name" {
  default     = ""
  description = "Existing SSH key pair name. Leave empty to create one."
}

# ─── SSH Key (auto-generated if not provided) ────────────────

resource "tls_private_key" "ssh" {
  count     = var.key_name == "" ? 1 : 0
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated" {
  count      = var.key_name == "" ? 1 : 0
  key_name   = "ananta-key"
  public_key = tls_private_key.ssh[0].public_key_openssh
}

resource "local_file" "private_key" {
  count           = var.key_name == "" ? 1 : 0
  content         = tls_private_key.ssh[0].private_key_pem
  filename        = "${path.module}/ananta-key.pem"
  file_permission = "0400"
}

# ─── Security Group ──────────────────────────────────────────

resource "aws_security_group" "ananta" {
  name        = "ananta-server"
  description = "Ananta single-server security group"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "ananta-server"
    Project = "ananta"
  }
}

# ─── EC2 Instance ────────────────────────────────────────────

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

resource "aws_instance" "ananta" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name != "" ? var.key_name : aws_key_pair.generated[0].key_name
  vpc_security_group_ids = [aws_security_group.ananta.id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Install Docker
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker ubuntu

    # Install Docker Compose plugin
    apt-get update -qq
    apt-get install -y -qq docker-compose-plugin git

    # Clone repo (user will do this manually or via CI)
    echo "Server ready. Clone your repo and run deploy/setup-server.sh"
  EOF

  tags = {
    Name    = "ananta-server"
    Project = "ananta"
  }
}

# ─── Elastic IP ──────────────────────────────────────────────

resource "aws_eip" "ananta" {
  instance = aws_instance.ananta.id
  domain   = "vpc"

  tags = {
    Name    = "ananta-server"
    Project = "ananta"
  }
}

# ─── Outputs ─────────────────────────────────────────────────

output "public_ip" {
  value       = aws_eip.ananta.public_ip
  description = "Server public IP — point your domain here"
}

output "ssh_command" {
  value       = var.key_name != "" ? "ssh -i YOUR_KEY ubuntu@${aws_eip.ananta.public_ip}" : "ssh -i ${path.module}/ananta-key.pem ubuntu@${aws_eip.ananta.public_ip}"
  description = "SSH into the server"
}

output "deploy_steps" {
  value = <<-EOT

    ╔══════════════════════════════════════════════════════╗
    ║  Ananta Server Ready!                                ║
    ╠══════════════════════════════════════════════════════╣
    ║                                                      ║
    ║  1. SSH into server:                                 ║
    ║     ${var.key_name != "" ? "ssh -i YOUR_KEY" : "ssh -i ananta-key.pem"} ubuntu@${aws_eip.ananta.public_ip}
    ║                                                      ║
    ║  2. Clone & deploy:                                  ║
    ║     git clone <your-repo> ananta                     ║
    ║     cd ananta                                        ║
    ║     ./deploy/setup-server.sh                         ║
    ║                                                      ║
    ║  3. (Optional) Setup SSL:                            ║
    ║     ./deploy/setup-ssl.sh your-domain.com            ║
    ║                                                      ║
    ║  Monthly cost: ~$21                                  ║
    ╚══════════════════════════════════════════════════════╝
  EOT
}
