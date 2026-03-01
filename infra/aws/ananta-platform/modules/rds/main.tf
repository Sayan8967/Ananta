################################################################################
# RDS Subnet Group
################################################################################

resource "aws_db_subnet_group" "this" {
  name        = "${var.env_name}-rds-subnet-group"
  description = "RDS subnet group for ${var.env_name}"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name        = "${var.env_name}-rds-subnet-group"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# RDS Security Group
################################################################################

resource "aws_security_group" "rds" {
  name_prefix = "${var.env_name}-rds-"
  description = "Security group for RDS PostgreSQL ${var.env_name}"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.env_name}-rds-sg"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "rds_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.app_security_group_id
  security_group_id        = aws_security_group.rds.id
  description              = "Allow PostgreSQL access from application"
}

resource "aws_security_group_rule" "rds_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.rds.id
  description       = "Allow all outbound traffic"
}

################################################################################
# KMS Key for RDS Encryption
################################################################################

resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption ${var.env_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.env_name}-rds-kms"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.env_name}-rds"
  target_key_id = aws_kms_key.rds.key_id
}

################################################################################
# RDS Parameter Group
################################################################################

resource "aws_db_parameter_group" "this" {
  name_prefix = "${var.env_name}-pg16-"
  family      = "postgres16"
  description = "Custom parameter group for PostgreSQL 16 - ${var.env_name}"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_statement"
    value = "ddl"
  }

  parameter {
    name         = "shared_preload_libraries"
    value        = "pg_stat_statements"
    apply_method = "pending-reboot"
  }

  tags = {
    Name        = "${var.env_name}-pg16-params"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

################################################################################
# RDS Instance
################################################################################

resource "aws_db_instance" "this" {
  identifier = "${var.env_name}-ananta-postgres"

  engine         = "postgres"
  engine_version = "16"
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn

  db_name  = var.database_name
  username = var.master_username
  port     = 5432

  manage_master_user_password = true

  multi_az               = var.multi_az
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.this.name

  backup_retention_period = var.backup_retention_period
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = var.env_name == "dev" ? true : false
  final_snapshot_identifier = var.env_name == "dev" ? null : "${var.env_name}-ananta-postgres-final"
  copy_tags_to_snapshot     = true

  performance_insights_enabled    = true
  performance_insights_kms_key_id = aws_kms_key.rds.arn

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  auto_minor_version_upgrade = true

  tags = {
    Name        = "${var.env_name}-ananta-postgres"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}
