################################################################################
# DocumentDB Subnet Group
################################################################################

resource "aws_docdb_subnet_group" "this" {
  name        = "${var.env_name}-docdb-subnet-group"
  description = "DocumentDB subnet group for ${var.env_name}"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name        = "${var.env_name}-docdb-subnet-group"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# DocumentDB Security Group
################################################################################

resource "aws_security_group" "docdb" {
  name_prefix = "${var.env_name}-docdb-"
  description = "Security group for DocumentDB ${var.env_name}"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.env_name}-docdb-sg"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "docdb_ingress" {
  type                     = "ingress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  source_security_group_id = var.app_security_group_id
  security_group_id        = aws_security_group.docdb.id
  description              = "Allow DocumentDB access from application"
}

resource "aws_security_group_rule" "docdb_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.docdb.id
  description       = "Allow all outbound traffic"
}

################################################################################
# KMS Key for DocumentDB Encryption
################################################################################

resource "aws_kms_key" "docdb" {
  description             = "KMS key for DocumentDB encryption ${var.env_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.env_name}-docdb-kms"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_kms_alias" "docdb" {
  name          = "alias/${var.env_name}-docdb"
  target_key_id = aws_kms_key.docdb.key_id
}

################################################################################
# DocumentDB Parameter Group
################################################################################

resource "aws_docdb_cluster_parameter_group" "this" {
  name_prefix = "${var.env_name}-docdb-"
  family      = "docdb5.0"
  description = "Custom parameter group for DocumentDB 5.0 - ${var.env_name}"

  parameter {
    name  = "audit_logs"
    value = "enabled"
  }

  parameter {
    name  = "tls"
    value = "enabled"
  }

  tags = {
    Name        = "${var.env_name}-docdb-params"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

################################################################################
# DocumentDB Cluster
################################################################################

resource "aws_docdb_cluster" "this" {
  cluster_identifier = "${var.env_name}-ananta-docdb"

  engine         = "docdb"
  engine_version = "5.0.0"

  master_username                 = var.master_username
  manage_master_user_password     = true

  port = 27017

  vpc_security_group_ids          = [aws_security_group.docdb.id]
  db_subnet_group_name            = aws_docdb_subnet_group.this.name
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.this.name

  storage_encrypted = true
  kms_key_id        = aws_kms_key.docdb.arn

  backup_retention_period   = var.backup_retention_period
  preferred_backup_window   = "03:00-04:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"

  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = var.env_name == "dev" ? true : false
  final_snapshot_identifier = var.env_name == "dev" ? null : "${var.env_name}-ananta-docdb-final"

  enabled_cloudwatch_logs_exports = ["audit", "profiler"]

  tags = {
    Name        = "${var.env_name}-ananta-docdb"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# DocumentDB Instances
################################################################################

resource "aws_docdb_cluster_instance" "this" {
  count = var.instance_count

  identifier         = "${var.env_name}-ananta-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.this.id
  instance_class     = var.instance_class

  auto_minor_version_upgrade = true

  tags = {
    Name        = "${var.env_name}-ananta-docdb-${count.index}"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}
