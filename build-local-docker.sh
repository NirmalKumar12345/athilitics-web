#!/bin/bash
set -e

IMAGE_NAME="my-app:local"

# Build the Docker image
docker build -t $IMAGE_NAME .

# Run tests inside the container
docker run --rm $IMAGE_NAME yarn test

echo "✅ Build and tests successful."
