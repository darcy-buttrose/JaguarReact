pipeline {
  agent {
    docker {
      image 'node:latest'
      args '-p 3000:3000'
    }

  }
  stages {
    stage('Build') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm config set cache /usr/local/npm-cache'
            sh 'npm config set prefix /usr/local/npm'
            sh 'npm install'
        }
      }
    }
  }
}