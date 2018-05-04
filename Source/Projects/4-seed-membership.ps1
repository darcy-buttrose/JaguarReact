docker start projects_mariadb-server_1

Start-Sleep 120

Set-Location membership
dotnet run /seed

Set-Location ..

Start-Sleep 180

docker stop projects_mariadb-server_1

"Success database seeded - Press Ctrl-C to end the membership process."
