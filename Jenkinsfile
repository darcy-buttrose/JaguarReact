pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      args '-u root -p 3000:3000'
    }

  }
  stages {
    stage('Build') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm install'
        }
      }
    }
  }
}