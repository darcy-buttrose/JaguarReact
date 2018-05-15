pipeline {
  agent {
    docker {
      image 'node:8.11.1'
      args '-u root -p 3000:3000'
    }

  }
  stages {
    stage('Build') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm install'
            sh 'npm run test'
        }
      }
    }
  }
}
