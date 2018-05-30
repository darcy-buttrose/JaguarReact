$HOSTIP = "localhost"

# update configs with Host Machine IP
(get-content ".\membership\appsettings.json.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\appsettings.Development.json"
(get-content ".\website\app\static\appConfig.orig.json") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\website\app\static\appConfig.json"

Set-Location website
write-output (npm install)

Set-Location ..\membership

(dotnet ef database update -C ApplicationDbContext)
(dotnet ef database update -C ConfigurationDbContext)
(dotnet ef database update -C PersistedGrantDbContext)
