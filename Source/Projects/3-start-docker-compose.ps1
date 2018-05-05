#run docker-compose.yml
write-output (docker-compose up -d)
Set-Location website
npm start
