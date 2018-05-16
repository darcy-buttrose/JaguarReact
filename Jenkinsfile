pipeline {
  agent any
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
          args '-u root -p 3000:3000 -v /tmp/jaguar-website:/tmp/jaguar-website'
        }
      }
      steps {
        input "Deploy To Test?"
        dir('Source/Projects/website/build') {
            sh 'rm appConfig.orig.json'
            sh 'mv appConfig.test.json appConfig.json'
            sh 'ls -latr'
            sh 'cat appConfig.json'
        }
        dir('Source/Projects/website') {
            sh 'cp -r -v build server internals app package*.json .dockerignore Dockerfile /tmp/jaguar-website'
            sh 'ls -latr /tmp/jaguar-website'
        }
      }
    }
    stage('Website - Dockerise') {
      steps {
        dir('/tmp/jaguar-website') {
            sh 'ls -latr'
            sh 'docker image rm jaguar/website'
            sh 'docker build -t jaguar/website .'
        }
      }
    }
  }
}