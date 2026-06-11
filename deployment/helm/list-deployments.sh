#!/bin/bash
# List all JaiClaw.io deployments
# Shows status of dev, staging, and production releases

echo "=========================================="
echo "JaiClaw.io - Deployment Status"
echo "=========================================="
echo ""

if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed or not in PATH"
    exit 1
fi

check_release() {
    local release_name=$1
    local env_name=$2
    local namespace=$3

    echo "[$env_name Environment]"
    echo "Release: $release_name"
    echo "Namespace: $namespace"

    if helm status "$release_name" -n "$namespace" &> /dev/null; then
        echo "Status: DEPLOYED"
        echo ""
        helm status "$release_name" -n "$namespace" --show-desc
        echo ""

        echo "Pods:"
        kubectl get pods -n "$namespace" -l "app.kubernetes.io/instance=$release_name" 2>/dev/null || echo "  No pods found"
        echo ""

        echo "Services:"
        kubectl get svc -n "$namespace" -l "app.kubernetes.io/instance=$release_name" 2>/dev/null || echo "  No services found"
        echo ""

        echo "Ingress:"
        kubectl get ingress -n "$namespace" -l "app.kubernetes.io/instance=$release_name" 2>/dev/null || echo "  No ingress found"
    else
        echo "Status: NOT DEPLOYED"
    fi

    echo ""
    echo "=========================================="
    echo ""
}

check_release "jaiclaw-io-dev" "Development" "jaiclaw-dev"
check_release "jaiclaw-io-staging" "Staging" "jaiclaw-staging"
check_release "jaiclaw-io-prod" "Production" "default"

echo "[All Helm Releases]"
helm list -A 2>/dev/null | grep -i jaiclaw || echo "  No JaiClaw releases found"
echo ""
