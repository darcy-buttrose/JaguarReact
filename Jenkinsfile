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
            sh 'npm run build'
        }
      }
    }
    stage('Ready For Test') {
      steps {
        input "Deploy To Test?"
      }
    }
    stage('Website - Deploy To Test') {
      steps {
        dir('Source/Projects/website/build') {
            echo 'Go Go Gadget Deploy'
            echo '- setup appConfig'
            sh 'rm appConfig.orig.json'
            sh 'mv appConfig.test.json appConfig.json'
            echo '- build contents'
            sh 'ls -latr'
            echo '- config'
            sh 'cat appConfig.json'
        }
      }
    }
  }
}
