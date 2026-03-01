################################################################################
# KMS Key for EKS Secrets Encryption
################################################################################

resource "aws_kms_key" "eks" {
  description             = "KMS key for EKS cluster ${var.env_name} secrets encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.env_name}-eks-kms"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_kms_alias" "eks" {
  name          = "alias/${var.env_name}-eks"
  target_key_id = aws_kms_key.eks.key_id
}

################################################################################
# EKS Cluster IAM Role
################################################################################

resource "aws_iam_role" "eks_cluster" {
  name = "${var.env_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.env_name}-eks-cluster-role"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster.name
}

################################################################################
# EKS Cluster Security Group
################################################################################

resource "aws_security_group" "eks_cluster" {
  name_prefix = "${var.env_name}-eks-cluster-"
  description = "Security group for EKS cluster ${var.env_name}"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.env_name}-eks-cluster-sg"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "eks_cluster_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.eks_cluster.id
  description       = "Allow all outbound traffic"
}

################################################################################
# CloudWatch Log Group for EKS
################################################################################

resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${var.env_name}/cluster"
  retention_in_days = 30

  tags = {
    Name        = "${var.env_name}-eks-logs"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# EKS Cluster
################################################################################

resource "aws_eks_cluster" "this" {
  name     = "${var.env_name}-eks"
  version  = var.cluster_version
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids              = var.private_subnet_ids
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]

  tags = {
    Name        = "${var.env_name}-eks"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
    aws_cloudwatch_log_group.eks,
  ]
}

################################################################################
# OIDC Provider for IRSA
################################################################################

data "tls_certificate" "eks" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.this.identity[0].oidc[0].issuer

  tags = {
    Name        = "${var.env_name}-eks-oidc"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# EKS Node Group IAM Role
################################################################################

resource "aws_iam_role" "eks_nodes" {
  name = "${var.env_name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.env_name}-eks-node-role"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry_read" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_nodes.name
}

resource "aws_iam_role_policy_attachment" "eks_ssm_managed_instance" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.eks_nodes.name
}

################################################################################
# EKS Managed Node Group
################################################################################

resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.env_name}-default"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = var.private_subnet_ids

  instance_types = var.node_instance_types
  capacity_type  = "ON_DEMAND"

  scaling_config {
    desired_size = var.node_desired_count
    min_size     = var.node_min_count
    max_size     = var.node_max_count
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    Environment = var.env_name
    NodeGroup   = "default"
  }

  tags = {
    Name        = "${var.env_name}-eks-node-group"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_read,
    aws_iam_role_policy_attachment.eks_ssm_managed_instance,
  ]

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}

################################################################################
# EKS Addons
################################################################################

resource "aws_eks_addon" "vpc_cni" {
  cluster_name                = aws_eks_cluster.this.name
  addon_name                  = "vpc-cni"
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name        = "${var.env_name}-vpc-cni"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_eks_node_group.this]
}

resource "aws_eks_addon" "coredns" {
  cluster_name                = aws_eks_cluster.this.name
  addon_name                  = "coredns"
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name        = "${var.env_name}-coredns"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_eks_node_group.this]
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name                = aws_eks_cluster.this.name
  addon_name                  = "kube-proxy"
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name        = "${var.env_name}-kube-proxy"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_eks_node_group.this]
}

resource "aws_eks_addon" "ebs_csi" {
  cluster_name                = aws_eks_cluster.this.name
  addon_name                  = "aws-ebs-csi-driver"
  service_account_role_arn    = aws_iam_role.ebs_csi.arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name        = "${var.env_name}-ebs-csi"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_eks_node_group.this]
}

################################################################################
# EBS CSI Driver IAM Role (IRSA)
################################################################################

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "ebs_csi" {
  name = "${var.env_name}-ebs-csi-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.eks.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(aws_eks_cluster.this.identity[0].oidc[0].issuer, "https://", "")}:aud" = "sts.amazonaws.com"
            "${replace(aws_eks_cluster.this.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.env_name}-ebs-csi-role"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_iam_role_policy_attachment" "ebs_csi" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.ebs_csi.name
}
