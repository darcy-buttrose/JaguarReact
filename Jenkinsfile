pipeline {
  agent any
  stages {
    stage('Git Test') {
      steps {
        script {
          sshagent(['9665b560-0d86-43cb-805c-aa92f059e87a']) {
            sh "git status"
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
          currentBuild.displayName = BUILD_VERSION_GENERATED.replace("/","_")
        }
        script {
          try {
            sh "mkdir /tmp/jaguar-website"
          } catch (Exception err) {
            echo 'mkdir failed'
          }
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
            sh 'ls -latr app-build'
            sh 'ls -latr server-build'
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
        dir('Source/Projects/website/app-build') {
          script {
            if (env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'develop') {
              sh 'mv appConfig.dev.json appConfig.json'
            } else if (env.BRANCH_NAME == 'develop') {
              sh 'mv appConfig.test.json appConfig.json'
            } else if (env.BRANCH_NAME == 'master') {
              sh 'mv appConfig.demo.json appConfig.json'
            }
          }
          sh 'ls -latr'
          sh 'cat appConfig.json'
        }
        dir('Source/Projects/website') {
            sh 'cp -r -v app-build server-build internals app package*.json .dockerignore Dockerfile /tmp/jaguar-website'
            sh 'ls -latr /tmp/jaguar-website'
        }
      }
    }
    stage('Build Image') {
      steps {
        dir('/tmp/jaguar-website') {
          sh 'pwd'
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
        script {
          if (env.BRANCH_NAME == 'develop') {
            script {
              try {
                sh "docker rmi dregistry.icetana.com.au/jaguar/website:latest"
              } catch (Exception err) {
                echo 'docker rmi failed'
              }
            }
            sh "docker tag jaguar/website:${currentBuild.displayName} dregistry.icetana.com.au/jaguar/website:latest"
            sh "docker push dregistry.icetana.com.au/jaguar/website:latest"
          } else if (env.BRANCH_NAME == 'master') {
            script {
              try {
                sh "docker rmi dregistry.icetana.com.au/jaguar/website:demo"
              } catch (Exception err) {
                echo 'docker rmi failed'
              }
            }
            sh "docker tag jaguar/website:${currentBuild.displayName} dregistry.icetana.com.au/jaguar/website:demo"
            sh "docker push dregistry.icetana.com.au/jaguar/website:demo"
          }
        }
      }
    }
  }
}