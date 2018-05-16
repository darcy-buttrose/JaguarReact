pipeline {
  agent any
  stages {
    stage('Generate Version') {
      steps {
        script {
          BUILD_VERSION_GENERATED = VersionNumber(
                  versionNumberString: '${BUILD_DATE_FORMATTED, "yyyy.M.d"}_${env.BRANCH_NAME}_${BUILDS_TODAY,X}',
                  projectStartDate:    '2018-05-01',
                  skipFailedBuilds:    true)
          currentBuild.displayName = BUILD_VERSION_GENERATED
        }
      }
    }
    stage('Dependencies') {
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
      }
    }
    stage('Test') {
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
    stage('Package') {
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
    stage('Docker Preperation') {
      agent {
        docker {
          image 'node:8.11.1'
          args '-u root -p 3000:3000 -v /tmp/jaguar-website:/tmp/jaguar-website'
        }
      }
      steps {
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
    stage('Docker Build') {
      steps {
        input "Image ${currentBuild.displayName}?"
        dir('/tmp/jaguar-website') {
          sh 'ls -latr'
          sh "docker build -t jaguar/website:${currentBuild.displayName} ."
          sh 'docker image ls -a'
        }
      }
    }
  }
}