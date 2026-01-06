FROM python:3.9-slim

WORKDIR /app

# Install system dependencies if any (none obvious from requirements, but good practice)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Run uvicorn on port 8000, accessible from outside
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
