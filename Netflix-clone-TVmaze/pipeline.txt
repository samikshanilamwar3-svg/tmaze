pipeline {
    agent any

    environment {
        IMAGE_NAME = "YOUR_DOCKERHUB_USERNAME/netflix-tvmaze"
        TVMAZE_API = "https://api.tvmaze.com"
    }

    stages {
        stage('Clean Workspace') {
            steps { cleanWs() }
        }

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install & Build') {
            steps {
                sh 'yarn install --frozen-lockfile'
                sh 'yarn build'
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh 'trivy fs . --exit-code 0 --format table > trivy-fs.txt'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build --build-arg VITE_TVMAZE_API_BASE_URL=${TVMAZE_API} -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --exit-code 0 ${IMAGE_NAME}:latest > trivy-image.txt'
            }
        }

        stage('Docker Push') {
            steps {
                withDockerRegistry(credentialsId: 'docker') {
                    sh 'docker push ${IMAGE_NAME}:${BUILD_NUMBER}'
                    sh 'docker push ${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Deploy to Docker') {
            steps {
                sh 'docker rm -f netflix-tvmaze || true'
                sh 'docker run -d --restart unless-stopped --name netflix-tvmaze -p 8081:80 ${IMAGE_NAME}:latest'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-fs.txt,trivy-image.txt', allowEmptyArchive: true
        }
    }
}
