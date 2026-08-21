#!/usr/bin/env groovy
//
// GitOps-flavored pipeline for jaiclaw.io.
//
// Old flow: build image  ->  helm upgrade against a live cluster (imperative).
// New flow: build image  ->  git commit + push a tag bump to taptech-gitops.
//           ArgoCD on the mgmt cluster picks up the commit and syncs
//           applications/jaiclaw-io/overlays/prod/ to apps-prod.
//
// Two immediate consequences vs the previous Jenkinsfile:
//   1. Jenkins never talks to the target cluster. No kubeconfig credential.
//   2. Deploys are auditable via git log of the taptech-gitops repo.
//
// Rollback = `git revert <sha>` in taptech-gitops. No `helm rollback`.
//

def isDeployment(String env) {
    return env in ['dev', 'staging', 'prod']
}

// Extract the version straight from pom.xml. Cheaper than shelling out to
// Maven (no JVM startup, no container hop) and works before any build stage
// has run. Uses XmlSlurper via a script-security-friendly parse.
// NOTE: this reads project/version, not project/parent/version -- add a
// fallback if this repo ever gains a parent pom whose version we care about.
@NonCPS
def readPomVersion() {
    def pomText = readFile('pom.xml')
    def pom = new XmlSlurper().parseText(pomText)
    return pom.version.text().trim()
}

def buildDockerImage() {
    echo "Building React app + docker image ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}"

    // jkube's k8s:build. Runs INSIDE the `maven` container of the pod-template;
    // jkube shells out to the docker daemon via DOCKER_HOST=tcp://localhost:2375
    // which the `dind` sibling container exposes.
    container('maven') {
        sh """
            ./mvnw clean package k8s:build -Pprod,docker \\
                -Ddocker.image.tag=${env.FINAL_DOCKER_TAG} \\
                -DskipTests \\
                ${MAVEN_OPTS}
        """
    }
}

def pushDockerImage() {
    echo "Pushing ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}"

    // Push via jkube too -- it already knows the image name/tag from the pom
    // + -Ddocker.image.tag override above, and reuses whatever docker
    // credential the daemon has for tooling.taptech.net:5000.
    //
    // Deliberately do NOT push :latest for prod. GitOps commits an immutable
    // tag; :latest muddies rollback and Argo diffs.
    container('maven') {
        sh """
            ./mvnw k8s:push -Pdocker \\
                -Ddocker.image.tag=${env.FINAL_DOCKER_TAG} \\
                ${MAVEN_OPTS}
        """
    }
}

def bumpKustomizeImage() {
    // Clone taptech-gitops, edit the overlay's image tag, commit, push.
    // ArgoCD polls the repo (default 3 min) and syncs the change to apps-prod.
    // Nothing in this stage touches the target cluster.
    def overlayPath = "applications/jaiclaw-io/overlays/${params.ENVIRONMENT}"

    // The maven container has git but not kustomize. Install a pinned release
    // to a local dir so we're not root-writing the image, and add it to PATH
    // for this shell invocation only.
    container('maven') {
        sh """
            set -e
            KUSTOMIZE_VERSION=5.4.3
            if [ ! -x ./bin/kustomize ]; then
                mkdir -p ./bin
                curl -sSL "https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv\${KUSTOMIZE_VERSION}/kustomize_v\${KUSTOMIZE_VERSION}_linux_amd64.tar.gz" \\
                    | tar -xz -C ./bin
                chmod +x ./bin/kustomize
            fi
            export PATH=\$PWD/bin:\$PATH

            rm -rf taptech-gitops
            git clone --depth=1 https://\${GITOPS_TOKEN_USR}:\${GITOPS_TOKEN_PSW}@github.com/glawson6/taptech-gitops.git
            cd taptech-gitops

            git config user.email 'jenkins@taptech.net'
            git config user.name  'jenkins-jaiclaw-io'

            cd ${overlayPath}
            kustomize edit set image ${DOCKER_IMAGE}=${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}
            cd -

            # If nothing changed (identical tag), no-op cleanly.
            if git diff --quiet; then
                echo 'no image change; skipping commit'
                exit 0
            fi

            git add ${overlayPath}/kustomization.yaml
            git commit -m 'jaiclaw-io ${params.ENVIRONMENT}: ${env.FINAL_DOCKER_TAG}

Auto-committed by Jenkins build #${env.BUILD_NUMBER}.
Overlay: ${overlayPath}
Image:   ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}
Source:  ${env.GIT_URL}@${env.GIT_COMMIT}'
            git push origin main
        """
    }
}

// Pod template used for every build of this pipeline. Kept inline (not as a
// PodTemplate CR on the cluster) so each app owns its own toolchain -- no
// mgmt-cluster changes needed to bump image versions.
//
// Containers:
//   * jnlp    -- the Jenkins remoting agent. Every pod-template needs one.
//   * maven   -- JDK 21 + Maven + git. Runs everything Maven-related. The
//                frontend-maven-plugin downloads Node 18.20.4 + npm 10.8.2 into
//                target/node on the first `mvn package` invocation; not
//                cached across builds by design (workspace wiped each run).
//   * docker  -- docker CLI. Talks to the sibling `dind` container over
//                tcp://localhost:2375 (shared pod network). jkube's
//                k8s:build/push runs here via `container('docker')`.
//   * dind    -- privileged Docker-in-Docker daemon. Fresh per build; no
//                cross-build leakage. Container tears down when the pod does.
//
// The dind container needs privileged: true. The jenkins-agents namespace
// must allow that -- typically by not enforcing the K8s "restricted" Pod
// Security Standard. Verify with:
//   kubectl get ns jenkins-agents -o jsonpath='{.metadata.labels}'
def POD_YAML = '''
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: jnlp
      image: jenkins/inbound-agent:latest
      resources:
        requests: { cpu: "200m", memory: "512Mi" }
        limits:   { cpu: "1",    memory: "1Gi" }
    - name: maven
      image: maven:3.9-eclipse-temurin-21
      command: [ "sleep" ]
      args:    [ "infinity" ]
      env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
        # jkube reads $DOCKER_CONFIG/config.json (falls back to $HOME/.docker/config.json).
        # Setting DOCKER_CONFIG to the mount path avoids clashing with anything
        # else that might live under /root/.docker.
        - name: DOCKER_CONFIG
          value: /root/.docker
      resources:
        requests: { cpu: "500m", memory: "1Gi" }
        limits:   { cpu: "2",    memory: "3Gi" }
      volumeMounts:
        - name: workspace-volume
          mountPath: /home/jenkins/agent
        # Docker push credential -- projected from the K8s secret `registry-push`
        # (populated by ESO from 1P). jkube's k8s:push consults this file when
        # pushing to tooling.taptech.net:5000, otherwise the push is anonymous
        # and hits 401. `subPath` avoids clobbering anything else the container
        # image ships in /root/.docker/.
        - name: docker-config
          mountPath: /root/.docker/config.json
          subPath: config.json
          readOnly: true
    - name: docker
      image: docker:27-cli
      command: [ "sleep" ]
      args:    [ "infinity" ]
      env:
        - name: DOCKER_HOST
          value: tcp://localhost:2375
        - name: DOCKER_CONFIG
          value: /root/.docker
      resources:
        requests: { cpu: "100m", memory: "128Mi" }
        limits:   { cpu: "500m", memory: "512Mi" }
      volumeMounts:
        - name: workspace-volume
          mountPath: /home/jenkins/agent
        - name: docker-config
          mountPath: /root/.docker/config.json
          subPath: config.json
          readOnly: true
    - name: dind
      image: docker:27-dind
      securityContext:
        privileged: true
      # --insecure-registry so `docker push` accepts the plain-HTTP
      # tooling.taptech.net:5000 without TLS. Remove once that registry
      # is fronted by HTTPS.
      args:
        - "--host=tcp://0.0.0.0:2375"
        - "--insecure-registry=tooling.taptech.net:5000"
      env:
        - name: DOCKER_TLS_CERTDIR
          value: ""
      resources:
        requests: { cpu: "500m", memory: "1Gi" }
        limits:   { cpu: "2",    memory: "3Gi" }
      volumeMounts:
        - name: docker-graph
          mountPath: /var/lib/docker
  volumes:
    - name: workspace-volume
      emptyDir: {}
    - name: docker-graph
      emptyDir: {}
    - name: docker-config
      secret:
        secretName: registry-push
        # Only project config.json; the same secret also holds .dockerconfigjson
        # (identical bytes, different key) for kubelet imagePullSecret consumers
        # and `username`/`password` for the Jenkins credentials-provider.
        items:
          - key: config.json
            path: config.json
'''

pipeline {
    agent {
        kubernetes {
            yaml POD_YAML
            defaultContainer 'maven'
        }
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['prod', 'staging', 'dev'],
            description: 'Target overlay in taptech-gitops (applications/jaiclaw-io/overlays/<env>)'
        )
        booleanParam(
            name: 'PUSH_IMAGE',
            defaultValue: true,
            description: 'Push the built image to the registry. Uncheck for a dry-run local build (skips k8s:push).'
        )
        choice(
            name: 'DEPLOY_VIA_GITOPS',
            choices: ['no', 'yes'],
            description: 'Bump the tag in taptech-gitops so ArgoCD syncs? Requires PUSH_IMAGE=true. (no = build [+push] only)'
        )
        string(
            name: 'DOCKER_TAG',
            defaultValue: '',
            description: 'Override docker tag. Empty => <pom-version>-<YYYYMMDD-HHMMSS>-<sha7>'
        )
    }

    environment {
        DOCKER_REGISTRY = 'tooling.taptech.net:5000'
        IMAGE_NAME      = 'jaiclaw-io'
        DOCKER_IMAGE    = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
        MAVEN_OPTS      = '-Dmaven.repo.local=.m2/repository'
        NODE_VERSION    = '18.20.4'

        // GitHub PAT with write access to taptech-gitops. Provisioned by ESO
        // from 1Password vault (item `gitops-repo`, fields username+password)
        // into the K8s Secret `gitops-repo` in the jenkins-agents namespace.
        // Jenkins reads it via the kubernetes-credentials-provider plugin's
        // Secret-to-Credential mirroring (matches Secret name = credential id).
        GITOPS_TOKEN = credentials('gitops-repo')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 30, unit: 'MINUTES')
        skipStagesAfterUnstable()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // No cleanWs() / checkout scm here:
                    //   * Declarative pipeline already ran "Declarative: Checkout SCM"
                    //     before the first stage. Repeating checkout would clone twice.
                    //   * The agent pod's workspace is an emptyDir volume that is
                    //     destroyed with the pod. Every build gets a fresh workspace,
                    //     so cleanWs is unnecessary. It also requires the
                    //     workspace-cleanup plugin which is not installed.
                    currentBuild.displayName = "#${BUILD_NUMBER}-${params.ENVIRONMENT}"
                    if (params.DEPLOY_VIA_GITOPS == 'yes') {
                        currentBuild.displayName += '-deploy'
                    }
                }
            }
        }

        stage('Compute Tag') {
            steps {
                script {
                    // Single source of truth for the project version = pom.xml.
                    // Never hard-code it here.
                    env.POM_VERSION = readPomVersion()
                    echo "Pom version: ${env.POM_VERSION}"

                    // Immutable tag. Never 'latest'. Never overwritable.
                    // Format: <pom-version>-<UTC timestamp>-<git sha7>. Encodes
                    // "what code" (pom) + "when built" (ts) + "which commit" (sha)
                    // so an image tag alone tells the full provenance story.
                    if (params.DOCKER_TAG?.trim()) {
                        env.FINAL_DOCKER_TAG = params.DOCKER_TAG.trim()
                    } else {
                        def ts = sh(script: "date -u +%Y%m%d-%H%M%S", returnStdout: true).trim()
                        env.FINAL_DOCKER_TAG = "${env.POM_VERSION}-${ts}-${env.GIT_COMMIT.take(7)}"
                    }
                    echo "Docker tag: ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}"
                    echo "Target overlay: applications/jaiclaw-io/overlays/${params.ENVIRONMENT}"
                }
            }
        }

        stage('Validate') {
            steps {
                script {
                    // A GitOps deploy without a push would point ArgoCD at an
                    // image tag that doesn't exist in the registry -- catch it
                    // here, not 5 minutes into a failing rollout.
                    if (params.DEPLOY_VIA_GITOPS == 'yes' && !params.PUSH_IMAGE) {
                        error 'DEPLOY_VIA_GITOPS=yes requires PUSH_IMAGE=true; the tag must exist in the registry before ArgoCD can pull it.'
                    }
                }
            }
        }

        stage('Build Image') {
            steps { script { buildDockerImage() } }
        }

        stage('Push Image') {
            when { expression { params.PUSH_IMAGE } }
            steps { script { pushDockerImage() } }
        }

        stage('Bump Kustomize (GitOps)') {
            when { expression { params.DEPLOY_VIA_GITOPS == 'yes' } }
            steps { script { bumpKustomizeImage() } }
        }

        stage('Result') {
            steps {
                script {
                    if (params.DEPLOY_VIA_GITOPS == 'yes') {
                        echo """
                          |------------------------------------------------------------------------
                          |  Built + pushed ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}
                          |  Committed image bump to taptech-gitops.
                          |  ArgoCD Application: jaiclaw-io-${params.ENVIRONMENT}
                          |  Watch: https://argocd.taptech.net/applications/argocd/jaiclaw-io-${params.ENVIRONMENT}
                          |------------------------------------------------------------------------
                        """.stripMargin()
                    } else if (params.PUSH_IMAGE) {
                        echo "Built + pushed ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG}. No GitOps deploy requested."
                    } else {
                        echo "Built ${DOCKER_IMAGE}:${env.FINAL_DOCKER_TAG} locally. Not pushed. (dry-run)"
                    }
                }
            }
        }
    }

    // No post {} block:
    //   * The dind container is torn down when the agent pod ends, so there
    //     is no long-lived docker cache that would need pruning.
    //   * Jenkins deletes the agent pod (and its emptyDir workspace) when
    //     the build finishes -- no cleanWs step required, and the workspace-
    //     cleanup plugin is not installed on this controller.
    //   * The old Jenkinsfile's `post { always { sh '...' } }` fired outside
    //     a node context and blew up with "Required context class hudson.FilePath
    //     is missing" -- explicitly not repeating that mistake here.
}
