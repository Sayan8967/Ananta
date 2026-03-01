# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

# Install tesseract-ocr and cleanup in single layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends tesseract-ocr && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY app/ ./app/

EXPOSE 3005

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3005"]
