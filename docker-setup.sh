#!/bin/bash

# Loan API Docker Setup Script
# This script builds and runs the Loan Eligibility API Docker container

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="loan-api"
CONTAINER_NAME="loan-api-container"
PORT="3000"
API_KEY="your-secret-api-key-here"

echo -e "${BLUE}🐳 Loan API Docker Setup${NC}"
echo "================================"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_status "Docker is installed"

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_warning "Stopping and removing existing container..."
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
fi

# Remove existing image if it exists
if docker images --format 'table {{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
    print_warning "Removing existing image..."
    docker rmi ${IMAGE_NAME} 2>/dev/null || true
fi

# Build the Docker image
print_status "Building Docker image..."
if docker build -t ${IMAGE_NAME} .; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Run the container
print_status "Starting Docker container..."
if docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}; then
    print_status "Docker container started successfully"
else
    print_error "Failed to start Docker container"
    exit 1
fi

# Wait for container to be healthy
print_status "Waiting for container to be healthy..."
sleep 5

# Check container status
if docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -q "${CONTAINER_NAME}.*Up"; then
    print_status "Container is running"
else
    print_error "Container failed to start properly"
    echo "Container logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

# Test the API
print_status "Testing API health endpoint..."
sleep 2
if curl -f http://localhost:${PORT}/health > /dev/null 2>&1; then
    print_status "API is responding correctly"
else
    print_warning "API health check failed, but container is running"
    echo "You can check the logs with: docker logs ${CONTAINER_NAME}"
fi

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "Container Information:"
echo "  Name: ${CONTAINER_NAME}"
echo "  Image: ${IMAGE_NAME}"
echo "  Port: ${PORT}"
echo "  API URL: http://localhost:${PORT}"
echo "  Health Check: http://localhost:${PORT}/health"
echo ""
echo "Useful commands:"
echo "  View logs:        docker logs ${CONTAINER_NAME}"
echo "  Stop container:   docker stop ${CONTAINER_NAME}"
echo "  Start container:  docker start ${CONTAINER_NAME}"
echo "  Remove container: docker rm ${CONTAINER_NAME}"
echo "  Remove image:     docker rmi ${IMAGE_NAME}"
echo ""
echo "API Key for testing: ${API_KEY}"
echo ""

