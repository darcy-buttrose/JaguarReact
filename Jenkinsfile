pipeline {
  agent none
  stages {
    stage('Install Dependencies') {
      agent {
        docker {
          image 'node:8.11.1'
          args '-u root -p 3000:3000'
        }
      }
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
      agent {
        docker {
          image 'node:8.11.1'
          args '-u root -p 3000:3000'
        }
      }
      steps {
        dir('Source/Projects/website') {
            sh 'npm run test:simple'
        }
      }
    }
    stage('Website - Package') {
      agent {
        docker {
          image 'node:8.11.1'
          args '-u root -p 3000:3000'
        }
      }
      steps {
        dir('Source/Projects/website') {
            sh 'npm run build'
        }
      }
    }
    stage('Website - Prep For Test') {
      agent {
        docker {
          image 'node:8.11.1'
          args '-u root -p 3000:3000'
        }
      }
      steps {
        dir('Source/Projects/website/build') {
            input "Deploy To Test?"
            sh 'rm appConfig.orig.json'
            sh 'mv appConfig.test.json appConfig.json'
            sh 'ls -latr'
            sh 'cat appConfig.json'
            sh 'scp . jenkins@portal-dev:/home/icetana/JaguarReact'
        }
      }
    }
  }
}
