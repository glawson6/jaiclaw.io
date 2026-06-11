#!/bin/bash
# Deploy or upgrade JaiClaw.io to Staging environment
#
# Usage:
#   ./deploy-staging.sh [IMAGE] [additional-helm-flags]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHART_PATH="${SCRIPT_DIR}/jaiclaw-io"
VALUES_FILE="${CHART_PATH}/values-staging.yaml"
RELEASE_NAME="jaiclaw-io-staging"
NAMESPACE="${NAMESPACE:-jaiclaw-staging}"

# Parse optional image parameter
IMAGE_FULL=""
IMAGE_REGISTRY=""
IMAGE_REPOSITORY=""
IMAGE_TAG=""

if [ -n "$1" ] && [[ ! "$1" =~ ^-- ]]; then
    IMAGE_FULL="$1"
    shift

    if [[ "$IMAGE_FULL" =~ ^(.+):([^:]+)$ ]]; then
        IMAGE_REPO_PART="${BASH_REMATCH[1]}"
        IMAGE_TAG="${BASH_REMATCH[2]}"

        if [[ "$IMAGE_REPO_PART" =~ ^(.+)/([^/]+)$ ]]; then
            IMAGE_REGISTRY="${BASH_REMATCH[1]}"
            IMAGE_REPOSITORY="${BASH_REMATCH[2]}"
        else
            IMAGE_REPOSITORY="$IMAGE_REPO_PART"
        fi
    else
        echo "Error: Invalid image format. Expected format: [registry/]repository:tag"
        exit 1
    fi
fi

echo "=========================================="
echo "Deploying JaiClaw.io - STAGING"
echo "=========================================="
echo "Release Name: ${RELEASE_NAME}"
echo "Namespace: ${NAMESPACE}"
echo "Chart Path: ${CHART_PATH}"
echo "Values File: ${VALUES_FILE}"
if [ -n "${IMAGE_FULL}" ]; then
    echo "Image Override: ${IMAGE_FULL}"
    [ -n "${IMAGE_REGISTRY}" ] && echo "  Registry: ${IMAGE_REGISTRY}"
    echo "  Repository: ${IMAGE_REPOSITORY}"
    echo "  Tag: ${IMAGE_TAG}"
fi
echo "=========================================="
echo ""

if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed or not in PATH"
    exit 1
fi

if [ ! -d "${CHART_PATH}" ]; then
    echo "Error: Chart directory not found at ${CHART_PATH}"
    exit 1
fi

if [ ! -f "${VALUES_FILE}" ]; then
    echo "Error: Values file not found at ${VALUES_FILE}"
    exit 1
fi

echo "Deploying with helm upgrade --install..."
if [ -n "${IMAGE_FULL}" ]; then
    IMAGE_OVERRIDES=""
    [ -n "${IMAGE_REGISTRY}" ] && IMAGE_OVERRIDES="${IMAGE_OVERRIDES} --set image.registry=${IMAGE_REGISTRY}"
    IMAGE_OVERRIDES="${IMAGE_OVERRIDES} --set image.repository=${IMAGE_REPOSITORY}"
    IMAGE_OVERRIDES="${IMAGE_OVERRIDES} --set image.tag=${IMAGE_TAG}"

    helm upgrade --install "${RELEASE_NAME}" "${CHART_PATH}" \
        --namespace "${NAMESPACE}" \
        --create-namespace \
        --values "${VALUES_FILE}" \
        ${IMAGE_OVERRIDES} \
        --wait \
        --timeout 5m \
        "$@"
else
    helm upgrade --install "${RELEASE_NAME}" "${CHART_PATH}" \
        --namespace "${NAMESPACE}" \
        --create-namespace \
        --values "${VALUES_FILE}" \
        --wait \
        --timeout 5m \
        "$@"
fi

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Check deployment status:"
echo "  helm status ${RELEASE_NAME} -n ${NAMESPACE}"
echo ""
echo "Check pods:"
echo "  kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/instance=${RELEASE_NAME}"
echo ""
echo "View logs:"
echo "  kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/instance=${RELEASE_NAME} --tail=50"
echo ""
