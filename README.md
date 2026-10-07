# Dockerized Node.js Application

A containerized Node.js application built as part of my **30 Days of DevOps** journey, demonstrating Docker-based application packaging, deployment, and runtime verification.

## Architecture

```text
Node.js Application
        ↓
    Dockerfile
        ↓
    Docker Image
        ↓
 Docker Container
        ↓
   Application
```

## Tech Stack

- Node.js
- JavaScript
- Docker
- Git & GitHub
- Linux/Bash

## Docker Setup

### The Dockerfile

![Dockerfile Code](docs/images/dockerfile.png)

### Build the image

```bash
docker build -t auth-validation .
```

### Run the container

```bash
docker run -d --name auth-validation -p 3000:3000 --env-file .env auth-validation
```

### Verify the container

```bash
docker ps
docker logs auth-validation
```

The application can then be accessed at:

```text
http://localhost:3000
```

## Implementation

### Docker Build

![Docker Build](docs/images/docker-build.png)

### Running Container

![Docker Container](docs/images/docker-ps.png)

### Application

![Application](docs/images/application-running.png)

## DevOps Focus

This project demonstrates:

- Application containerization
- Docker image creation
- Container lifecycle management
- Port mapping
- Container logging
- Reproducible application environments

## Next Steps

This project will evolve throughout my 30 Days of DevOps journey with:

**CI/CD → Terraform → AWS → Kubernetes → Monitoring**

---

**Shobo Adefowope**
DevOps Engineer | AWS | Docker | Kubernetes | Terraform | CI/CD
