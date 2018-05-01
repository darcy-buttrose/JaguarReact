docker-compose up -d

Start-Sleep 30

docker-compose stop

Start-Sleep 30

docker start projects_mariadb-server_1

Start-Sleep 60

Set-Location membership

write-output (dotnet ef database update -c ApplicationDbContext)
write-output (dotnet ef database update -c ConfigurationDbContext)
write-output (dotnet ef database update -c PersistedGrantDbContext)

Set-Location ..

Start-Sleep 60

docker stop projects_mariadb-server_1
