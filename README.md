# Netflix TVmaze Clone

A Netflix-inspired React + TypeScript application that uses the **TVmaze public API** instead of TMDB.

## Features

- Netflix-style responsive UI
- TV shows, not TMDB movies
- Popular, top-rated and recently premiered rows
- TVmaze genre filtering
- Show search/detail architecture
- Episode metadata
- Official TVmaze/show links
- Redux Toolkit Query for API calls
- Docker + Nginx production image
- Jenkins CI/CD pipeline
- Trivy filesystem and container scans
- Kubernetes manifests
- SQL schema for caching TVmaze metadata

## API

The application uses:

`https://api.tvmaze.com`

No TMDB API key is required.

Environment variable:

```env
VITE_TVMAZE_API_BASE_URL=https://api.tvmaze.com
```

## Local development

```bash
yarn install
yarn dev
```

Build:

```bash
yarn build
```

## Docker

```bash
docker build \
  --build-arg VITE_TVMAZE_API_BASE_URL=https://api.tvmaze.com \
  -t YOUR_DOCKERHUB_USERNAME/netflix-tvmaze:latest .
```

Run:

```bash
docker run -d --name netflix-tvmaze -p 8081:80 YOUR_DOCKERHUB_USERNAME/netflix-tvmaze:latest
```

Open:

`http://localhost:8081`

## Jenkins

The `Jenkinsfile` builds the application, scans it with Trivy, builds and pushes the Docker image, and deploys the container.

Before running it, change:

```text
YOUR_DOCKERHUB_USERNAME
```

to your Docker Hub username and configure the Jenkins credential ID `docker`.

## Kubernetes

Replace the Docker Hub placeholder in:

```text
Kubernetes/deployment.yml
```

Then:

```bash
kubectl apply -f Kubernetes/deployment.yml
kubectl apply -f Kubernetes/service.yml
```

## Database

`database/tvmaze.sql` contains a relational schema for caching shows, genres and episodes.

The current frontend intentionally uses live TVmaze data. A separate backend/sync job can populate the SQL database later.

## Important TVmaze limitation

TVmaze provides show and episode metadata, images and links. It does **not** provide a Netflix-like database of copyrighted video streams. The application therefore does not pretend that TVmaze supplies downloadable episode videos.
