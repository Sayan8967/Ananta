################################################################################
# ElastiCache Subnet Group
################################################################################

resource "aws_elasticache_subnet_group" "this" {
  name        = "${var.env_name}-redis-subnet-group"
  description = "ElastiCache Redis subnet group for ${var.env_name}"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name        = "${var.env_name}-redis-subnet-group"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# ElastiCache Security Group
################################################################################

resource "aws_security_group" "redis" {
  name_prefix = "${var.env_name}-redis-"
  description = "Security group for ElastiCache Redis ${var.env_name}"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.env_name}-redis-sg"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "redis_ingress" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = var.app_security_group_id
  security_group_id        = aws_security_group.redis.id
  description              = "Allow Redis access from application"
}

resource "aws_security_group_rule" "redis_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.redis.id
  description       = "Allow all outbound traffic"
}

################################################################################
# KMS Key for ElastiCache Encryption
################################################################################

resource "aws_kms_key" "redis" {
  description             = "KMS key for ElastiCache Redis encryption ${var.env_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.env_name}-redis-kms"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_kms_alias" "redis" {
  name          = "alias/${var.env_name}-redis"
  target_key_id = aws_kms_key.redis.key_id
}

################################################################################
# ElastiCache Parameter Group
################################################################################

resource "aws_elasticache_parameter_group" "this" {
  name_prefix = "${var.env_name}-redis7-"
  family      = "redis7"
  description = "Custom parameter group for Redis 7 - ${var.env_name}"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = {
    Name        = "${var.env_name}-redis7-params"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  lifecycle {
    create_before_destroy = true
  }
}

################################################################################
# ElastiCache Redis Replication Group
################################################################################

resource "aws_elasticache_replication_group" "this" {
  replication_group_id = "${var.env_name}-ananta-redis"
  description          = "Redis replication group for Ananta ${var.env_name}"

  engine         = "redis"
  engine_version = "7.1"
  node_type      = var.node_type
  port           = 6379

  num_cache_clusters = var.num_cache_nodes

  parameter_group_name = aws_elasticache_parameter_group.this.name
  subnet_group_name    = aws_elasticache_subnet_group.this.name
  security_group_ids   = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  kms_key_id                 = aws_kms_key.redis.arn
  transit_encryption_enabled = true

  automatic_failover_enabled = var.num_cache_nodes > 1 ? true : false
  multi_az_enabled           = var.num_cache_nodes > 1 ? true : false

  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window          = "03:00-04:00"
  maintenance_window       = "sun:04:00-sun:05:00"

  auto_minor_version_upgrade = true

  tags = {
    Name        = "${var.env_name}-ananta-redis"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}
