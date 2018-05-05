function Get-IpAddress {
    # Script to return current IPv4 addresses for Linux, MacOS, or Windows
    if ($IsLinux) {
      $ipInfo = ip -4 a | Select-String 'inet' | Select-String -Pattern '0.0.0.0' -NotMatch
      if($ipInfo) {
        $ipInfo = [regex]::matches($ipInfo,"\b(?:\d{1,3}\.){3}\d{1,3}\b") | ForEach-Object value
      }
    }
    elseif ($IsMacOS){
      $ipInfo = ifconfig | Select-String 'inet' | Select-String -Pattern '0.0.0.0' -NotMatch
      if($ipInfo) {
        $ipInfo = [regex]::matches($ipInfo,"\b(?:\d{1,3}\.){3}\d{1,3}\b") | ForEach-Object value
      }
    }else{
      $ipInfo = Get-NetIPAddress -AddressState Preferred -AddressFamily IPv4 | ForEach-Object IPAddress
    }

    $DEVHOSTIP = ($ipInfo | Where-Object {($_ -ne '127.0.0.1') -and ($_ -notlike '172.*') -and ($_ -notlike '*.255') } )
    return $DEVHOSTIP
}

$HOSTIP = Get-IpAddress

# update configs with Host Machine IP
(get-content ".\docker-compose-orig.yml") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content "docker-compose.yml"
(get-content ".\membership\appsettings.json.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\appsettings.json"
(get-content ".\membership\hosting.json.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\hosting.json"
(get-content ".\membership\Config.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\Config.cs"
(get-content ".\membership\Startup.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\Startup.cs"
(get-content ".\website\app\config\config.jsone") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\website\app\config\config.json"

#Set-Location website
#write-output (npm install)

#Set-Location ..
