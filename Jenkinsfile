pipeline {
  agent {
    docker {
      image 'node:8.11.1'
      args '-u root -p 3000:3000'
    }

  }
  stages {
    stage('Install Dependencies') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm install'
        }
        dir('Source/Projects/webapi') {
            sh 'npm install'
        }
      }
    }
    stage('Website - Test') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm run test:simple'
        }
      }
    }
    stage('Website - Package') {
      steps {
        dir('Source/Projects/website') {
            sh 'npm build'
        }
      }
    }
  }
}
