# JaiClaw.io - Marketing Website

## Project Overview
React marketing website for JaiClaw (AI framework), deployed to MicroK8s on 23.227.173.107.

## Tech Stack
- React 19 + Vite 7 + React Router 7
- Bootstrap 5 + Bootstrap Icons
- Maven (frontend-maven-plugin) wrapping npm/Vite
- JKube for Docker builds
- Helm charts for K8s deployment
- Nginx serving static files

## Build Commands
```bash
# Local dev server
npm run dev

# Maven dev build (no Docker)
./mvnw clean package -Pdev

# Maven prod build with Docker image
./mvnw clean package -Pprod,docker

# Docker compose local test
docker compose up --build
```

## Project Structure
```
src/
  main.jsx, App.jsx          Entry points
  routes.jsx                  React Router config
  views/                      Page components (HomeView, FeaturesView, etc.)
  components/                 Reusable components
  config/                     Constants, feature data, examples data
  themes/styles.css           Global CSS theme
  styles/                     Page-specific CSS
deployment/helm/jaiclaw-io/   Helm chart
```

## Routes (must match nginx allowlist)
/, /home, /features, /docs, /examples, /pricing, /contact

When adding routes, update:
1. src/routes.jsx
2. nginx.conf (root)
3. deployment/helm/jaiclaw-io/templates/configmap.yaml (port 8080 version)

## Color Palette
- Primary Purple: #7851a9
- Accent Gold: #cfb53b
- Background: #ffffff
- Card BG: #f9f9f9

## Deploy
```bash
# Helm deploy to prod
./deployment/helm/deploy-prod.sh

# DNS: jaiclaw.io -> 23.227.173.107
# TLS: cert-manager with letsencrypt-prod
```
