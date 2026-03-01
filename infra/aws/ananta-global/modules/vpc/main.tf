################################################################################
# VPC
################################################################################

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.env_name}-vpc"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# Internet Gateway
################################################################################

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.env_name}-igw"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

################################################################################
# Data Source - Availability Zones
################################################################################

data "aws_availability_zones" "available" {
  state = "available"
}

################################################################################
# Public Subnets
################################################################################

resource "aws_subnet" "public" {
  count = 3

  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name                     = "${var.env_name}-public-${data.aws_availability_zones.available.names[count.index]}"
    Environment              = var.env_name
    ManagedBy                = "terraform"
    Project                  = "ananta"
    "kubernetes.io/role/elb" = "1"
    Tier                     = "public"
  }
}

################################################################################
# Private Subnets
################################################################################

resource "aws_subnet" "private" {
  count = 3

  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 3)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name                              = "${var.env_name}-private-${data.aws_availability_zones.available.names[count.index]}"
    Environment                       = var.env_name
    ManagedBy                         = "terraform"
    Project                           = "ananta"
    "kubernetes.io/role/internal-elb" = "1"
    Tier                              = "private"
  }
}

################################################################################
# Elastic IPs for NAT Gateway(s)
################################################################################

resource "aws_eip" "nat" {
  count = var.single_nat_gateway ? 1 : 3

  domain = "vpc"

  tags = {
    Name        = "${var.env_name}-nat-eip-${count.index}"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_internet_gateway.this]
}

################################################################################
# NAT Gateway(s)
################################################################################

resource "aws_nat_gateway" "this" {
  count = var.single_nat_gateway ? 1 : 3

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name        = "${var.env_name}-nat-${count.index}"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }

  depends_on = [aws_internet_gateway.this]
}

################################################################################
# Public Route Table
################################################################################

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.env_name}-public-rt"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_route_table_association" "public" {
  count = 3

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

################################################################################
# Private Route Tables
################################################################################

resource "aws_route_table" "private" {
  count = var.single_nat_gateway ? 1 : 3

  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.env_name}-private-rt-${count.index}"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_route" "private_nat" {
  count = var.single_nat_gateway ? 1 : 3

  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.this[count.index].id
}

resource "aws_route_table_association" "private" {
  count = 3

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[var.single_nat_gateway ? 0 : count.index].id
}

################################################################################
# VPC Flow Logs
################################################################################

resource "aws_flow_log" "this" {
  vpc_id               = aws_vpc.this.id
  traffic_type         = "ALL"
  log_destination_type = "cloud-watch-logs"
  log_destination      = aws_cloudwatch_log_group.flow_log.arn
  iam_role_arn         = aws_iam_role.flow_log.arn

  tags = {
    Name        = "${var.env_name}-vpc-flow-log"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_cloudwatch_log_group" "flow_log" {
  name              = "/aws/vpc/flow-log/${var.env_name}"
  retention_in_days = 30

  tags = {
    Name        = "${var.env_name}-vpc-flow-log"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_iam_role" "flow_log" {
  name = "${var.env_name}-vpc-flow-log-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.env_name}-vpc-flow-log-role"
    Environment = var.env_name
    ManagedBy   = "terraform"
    Project     = "ananta"
  }
}

resource "aws_iam_role_policy" "flow_log" {
  name = "${var.env_name}-vpc-flow-log-policy"
  role = aws_iam_role.flow_log.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}
