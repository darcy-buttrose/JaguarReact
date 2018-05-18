pipeline {
  agent any
  stages {
    stage('Git Tag') {
      steps {
        sshagent('9665b560-0d86-43cb-805c-aa92f059e87a') {
            sh "git config user.email \"darcy.buttrose@gmail.com\""
            sh "git config user.name \"darcy-buttrose\""
            sh "git config push.default simple"
            sh "git config remote.origin.url https://darcy-buttrose@github.com/icetana/JaguarReact.git"
            sh "git checkout ${env.BRANCH_NAME}"
            sh "git pull"
            script {
              try {
                sh "git tag -a ${currentBuild.displayName} -m ${currentBuild.displayName}"
              } catch (err) {
                echo "git tag failed"
              }
              sh 'git push --tags'
            }
        }
      }
    }
    stage('Generate Version') {
      steps {
        script {
          BUILD_VERSION_GENERATED = VersionNumber(
                  versionNumberString: '${BUILD_DATE_FORMATTED, "yyyy.M.d"}_${BRANCH_NAME}_${BUILDS_TODAY,X}',
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
    stage('Preperation Image Contents') {
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
    stage('Build Image') {
      steps {
        dir('/tmp/jaguar-website') {
          sh 'ls -latr'
          sh "docker build -t jaguar/website:${currentBuild.displayName} ."
          sh 'docker image ls -a'
        }
      }
    }
    stage('Publish Image') {
      steps {
        sh "docker tag jaguar/website:${currentBuild.displayName} dregistry.icetana.com.au/jaguar/website:${currentBuild.displayName}"
        sh "docker push dregistry.icetana.com.au/jaguar/website:${currentBuild.displayName}"
      }
    }
  }
}