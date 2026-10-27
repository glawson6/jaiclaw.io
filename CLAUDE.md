# JaiClaw.io - Marketing Website

## Project Overview
React marketing website for JaiClaw (AI framework), deployed to MicroK8s on 23.227.173.107.

## Tech Stack
- React 19 + Vite 7 + React Router 7
- Bootstrap 5 + Bootstrap Icons
- Maven (frontend-maven-plugin) wrapping npm/Vite
- JKube for Docker builds
- GitOps (Kustomize + Argo CD) for K8s deployment — manifests live in taptech-gitops, not here
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
deployment/helm/jaiclaw-io/   Legacy Helm chart (no longer the deploy path)
```

## Routes (must match nginx allowlist)
/, /home, /features, /docs, /examples, /pricing, /contact

When adding routes, update:
1. src/routes.jsx
2. nginx.conf (root)
3. deployment/helm/jaiclaw-io/templates/configmap.yaml (legacy Helm chart only — the GitOps
   deployment serves the nginx.conf baked into the image, so step 2 is what reaches prod)

## Color Palette
- Primary Purple: #7851a9
- Accent Gold: #cfb53b
- Background: #ffffff
- Card BG: #f9f9f9

## Deploy
Prod runs from GitOps. Helm (`deployment/helm/deploy-prod.sh`) and Jenkins are no longer the
deploy path.

```bash
# 1+2. Build the site and the image in one go (JKube, linux/amd64, immutable tag) — same
#      command the old Jenkinsfile used. Plain `-Pprod` only runs the React build; the
#      `docker` profile binds k8s:build.
TAG=1.0.0-SNAPSHOT-$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short=7 HEAD)
IMG=tooling.taptech.net:5000/jaiclaw-io:$TAG
./mvnw clean package k8s:build -Pprod,docker -Ddocker.image.tag=$TAG
docker push "$IMG"

# 3. Bump the image tag in GitOps, commit, push
#    /Users/tap/dev/workspaces/taptech-gitops
#    applications/jaiclaw-io/overlays/prod/kustomization.yaml -> images[].newTag: <TAG>
git -C /Users/tap/dev/workspaces/taptech-gitops commit -am "jaiclaw-io prod: $TAG"
git -C /Users/tap/dev/workspaces/taptech-gitops push
GITOPS_SHA=$(git -C /Users/tap/dev/workspaces/taptech-gitops rev-parse HEAD)

# 4. Hard-refresh and sync the Argo CD app at the new gitops sha
kubectl --context taptech-mgmt -n argocd annotate application jaiclaw-io-prod \
  argocd.argoproj.io/refresh=hard --overwrite
kubectl --context taptech-mgmt -n argocd patch application jaiclaw-io-prod --type merge \
  -p "{\"operation\":{\"sync\":{\"revision\":\"$GITOPS_SHA\"}}}"

# 5. Verify the rollout (deployment jaiclaw-io, namespace taptech-prod)
kubectl --context taptech-prod -n taptech-prod rollout status deploy/jaiclaw-io
kubectl --context taptech-prod -n taptech-prod get deploy jaiclaw-io \
  -o jsonpath='{.spec.template.spec.containers[0].image}'

# DNS: jaiclaw.io -> 23.227.173.107
# TLS: cert-manager with letsencrypt-prod
```
