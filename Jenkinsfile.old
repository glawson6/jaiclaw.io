#!/usr/bin/env groovy

@groovy.transform.Field
def DEPLOY_YES = 'yes'

def executeHelmAction(String action, String chartPath, String releaseName, String namespace, String valuesFile) {
    switch (action) {
        case 'install':
            return """
                helm install ${releaseName} ${chartPath} \\
                    --namespace ${namespace} \\
                    --values helm-values.yaml \\
                    --values ${valuesFile} \\
                    --wait --timeout=10m
            """
        case 'upgrade':
            return """
                helm upgrade --install ${releaseName} ${chartPath} \\
                    --namespace ${namespace} \\
                    --values helm-values.yaml \\
                    --values ${valuesFile} \\
                    --wait --timeout=10m
            """
        case 'rollback':
            return """
                echo "Rolling back to previous version..."
                helm rollback ${releaseName} \\
                    --namespace ${namespace}
            """
        default:
            error("Unknown Helm action: ${action}")
    }
}

def verifyDeployment(String namespace, String releaseName) {
    sh """
        export KUBECONFIG=${KUBECONFIG}

        # Wait for deployment to be ready
        kubectl wait --for=condition=available --timeout=300s \\
            deployment/jaiclaw-io -n ${namespace} || true

        # Check pod status
        kubectl get pods -n ${namespace} -l app.kubernetes.io/name=jaiclaw-io

        # Get service information
        kubectl get services -n ${namespace} -l app.kubernetes.io/name=jaiclaw-io

        # Describe deployment for troubleshooting
        kubectl describe deployment jaiclaw-io -n ${namespace}

        # Check Helm release status
        helm status ${releaseName} -n ${namespace}
    """
}

def buildDockerImage() {
    echo 'Building React application with Maven and JKube...'

    sh """
        ./mvnw clean package -Pprod,docker \\
            -Ddocker.image.tag=${env.FINAL_DOCKER_TAG} \\
            -DskipTests=false \\
            ${MAVEN_OPTS}
    """
}

def pushDockerImage() {
    echo 'Pushing Docker image to registry...'

    // Tag image with additional tags
    sh """
        docker tag ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG} ${DOCKER_IMAGE}:latest
        docker tag ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG} ${DOCKER_IMAGE}:${params.ENVIRONMENT}
    """

    // Push to registry
    sh """
        docker push ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}
        docker push ${DOCKER_IMAGE}:latest
        docker push ${DOCKER_IMAGE}:${params.ENVIRONMENT}
    """
}

def deployToKubernetes() {
    def releaseName = "jaiclaw-io-${params.ENVIRONMENT}"
    def valuesFile = "${HELM_CHART_PATH}/values-${params.ENVIRONMENT}.yaml"

    echo "Deploying to Kubernetes environment: ${params.ENVIRONMENT}"

    // Verify Helm chart exists
    sh """
        if [ ! -d "${HELM_CHART_PATH}" ]; then
            echo "ERROR: Helm chart not found at ${HELM_CHART_PATH}"
            exit 1
        fi

        echo "Using Helm chart at: ${HELM_CHART_PATH}"
        helm lint ${HELM_CHART_PATH}
    """

    // Set Helm values based on environment
    def helmValues = """
        image.repository=${DOCKER_IMAGE}
        image.tag=${env.FINAL_DOCKER_TAG}
        environment=${params.ENVIRONMENT}
        namespace=${env.TARGET_NAMESPACE}
    """

    writeFile file: 'helm-values.yaml', text: helmValues

    // Execute Helm deployment
    sh """
        export KUBECONFIG=${KUBECONFIG}

        # Ensure namespace exists
        kubectl create namespace ${env.TARGET_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

        # Execute Helm command based on action
        ${executeHelmAction(params.HELM_ACTION, HELM_CHART_PATH, releaseName, env.TARGET_NAMESPACE, valuesFile)}

        # Verify deployment
        kubectl get pods -n ${env.TARGET_NAMESPACE} -l app.kubernetes.io/name=jaiclaw-io
        kubectl get services -n ${env.TARGET_NAMESPACE} -l app.kubernetes.io/name=jaiclaw-io
    """
}

pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TO_K8S',
            choices: ['no', 'yes'],
            description: 'Deploy to Kubernetes cluster after build?'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Target environment for deployment'
        )
        choice(
            name: 'HELM_ACTION',
            choices: ['upgrade', 'install', 'rollback'],
            description: 'Helm deployment action'
        )
        string(
            name: 'DOCKER_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag (defaults to latest)'
        )
    }

    environment {
        // Docker configuration
        DOCKER_REGISTRY = 'tooling.taptech.net:5000'
        IMAGE_NAME = 'jaiclaw-io'
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${IMAGE_NAME}"

        // Build configuration
        MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository'
        NODE_VERSION = '18.20.4'

        // Kubernetes configuration
        KUBECONFIG = credentials('kubeconfig-file')
        HELM_CHART_PATH = './deployment/helm/jaiclaw-io'

        // Environment-specific namespaces
        DEV_NAMESPACE = 'jaiclaw-dev'
        STAGING_NAMESPACE = 'jaiclaw-staging'
        PROD_NAMESPACE = 'default'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        skipStagesAfterUnstable()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    cleanWs()
                    checkout scm

                    currentBuild.displayName = "#${BUILD_NUMBER}-${params.ENVIRONMENT}"
                    if (params.DEPLOY_TO_K8S == DEPLOY_YES) {
                        currentBuild.displayName += '-deploy'
                    }
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    env.FINAL_DOCKER_TAG = params.DOCKER_TAG == 'latest' ?
                        "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}" : params.DOCKER_TAG

                    switch (params.ENVIRONMENT) {
                        case 'dev':
                            env.TARGET_NAMESPACE = env.DEV_NAMESPACE
                            break
                        case 'staging':
                            env.TARGET_NAMESPACE = env.STAGING_NAMESPACE
                            break
                        case 'prod':
                            env.TARGET_NAMESPACE = env.PROD_NAMESPACE
                            break
                        default:
                            env.TARGET_NAMESPACE = env.DEV_NAMESPACE
                    }

                    echo "Building image: ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}"
                    echo "Target environment: ${params.ENVIRONMENT}"
                    echo "Target namespace: ${env.TARGET_NAMESPACE}"
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    buildDockerImage()
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'target/*.tar.gz,target/*.zip', allowEmptyArchive: true
                }
            }
        }

        stage('Docker Image Info') {
            steps {
                script {
                    echo 'Verifying Docker image...'
                    sh '''
                        docker images | grep ${IMAGE_NAME} || echo "No images found yet"
                        docker image inspect ${DOCKER_IMAGE}:${FINAL_DOCKER_TAG} || echo "Image not found"
                    '''
                }
            }
        }

        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    expression { params.DEPLOY_TO_K8S == DEPLOY_YES }
                }
            }
            steps {
                script {
                    pushDockerImage()
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { params.DEPLOY_TO_K8S == DEPLOY_YES }
            }
            steps {
                script {
                    deployToKubernetes()
                }
            }
            post {
                always {
                    sh 'rm -f helm-values.yaml'
                }
                success {
                    echo "Successfully deployed to ${params.ENVIRONMENT} environment"
                }
                failure {
                    echo "Deployment to ${params.ENVIRONMENT} environment failed"
                }
            }
        }

        stage('Health Check') {
            when {
                expression { params.DEPLOY_TO_K8S == DEPLOY_YES }
            }
            steps {
                script {
                    def releaseName = "jaiclaw-io-${params.ENVIRONMENT}"
                    echo 'Performing health check on deployed application...'
                    verifyDeployment(env.TARGET_NAMESPACE, releaseName)
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed for ${params.ENVIRONMENT} environment"
            sh '''
                docker image prune -f || true
                docker system df || true
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        cleanup {
            cleanWs()
        }
    }
}
