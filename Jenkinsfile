pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'athletics-frontend'
        ATHLETICS_DIR = '/opt/athletics'
    }

    options {
        timeout(time: 25, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    echo '🎨 Building Frontend Docker image...'
                    sh 'DOCKER_BUILDKIT=0 docker build -t ${FRONTEND_IMAGE}:latest .'
                    sh 'docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        set -e
                        cd ${ATHLETICS_DIR}
                        docker-compose -f docker-compose.yml up -d --no-deps --force-recreate athletics-frontend
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    curl -f http://localhost:3000/ || true
                '''
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            echo '✅ Frontend deployed successfully'
        }
        failure {
            echo '❌ Frontend deployment failed'
        }
    }
}
