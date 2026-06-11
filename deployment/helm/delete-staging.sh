#!/bin/bash
# Delete JaiClaw.io from Staging environment

set -e

RELEASE_NAME="jaiclaw-io-staging"
NAMESPACE="${NAMESPACE:-jaiclaw-staging}"

echo "=========================================="
echo "Deleting JaiClaw.io - STAGING"
echo "=========================================="
echo "Release Name: ${RELEASE_NAME}"
echo "Namespace: ${NAMESPACE}"
echo "=========================================="
echo ""

if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed or not in PATH"
    exit 1
fi

if ! helm status "${RELEASE_NAME}" -n "${NAMESPACE}" &> /dev/null; then
    echo "Warning: Release '${RELEASE_NAME}' not found in namespace '${NAMESPACE}'"
    echo "Nothing to delete."
    exit 0
fi

read -p "Are you sure you want to delete the staging deployment? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deletion cancelled."
    exit 0
fi

echo "Uninstalling Helm release..."
helm uninstall "${RELEASE_NAME}" -n "${NAMESPACE}" --wait "$@"

echo ""
echo "=========================================="
echo "Deletion completed successfully!"
echo "=========================================="
echo ""
echo "Verify deletion:"
echo "  helm list -n ${NAMESPACE}"
echo "  kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/instance=${RELEASE_NAME}"
echo ""
