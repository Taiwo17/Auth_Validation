#!/bin/bash
set -euxo pipefail

dnf install -y docker
systemctl enable --now docker

docker pull ${docker_image}

docker run -d \
  --name auth-validation \
  --restart unless-stopped \
  -p 3000:3000 \
  ${docker_image}