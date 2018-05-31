function Get-IpAddress {
    $ipInfo = ""
    # Script to return current IPv4 addresses for Linux, MacOS, or Windows
    if ($IsLinux) {
      $ipInfo = ip -4 a | Select-String 'inet' | Select-String -Pattern '0.0.0.0' -NotMatch
    }
    elseif ($IsMacOS){
      $ipInfo = ifconfig | Select-String 'inet' | Select-String -Pattern '0.0.0.0' -NotMatch
    }else{
      $ipInfo = Get-NetIPAddress -AddressState Preferred -AddressFamily IPv4 | ForEach-Object IPAddress
    }


    if($ipInfo) {
      $ipInfo = [regex]::matches($ipInfo,"\b(?:\d{1,3}\.){3}\d{1,3}\b") | ForEach-Object value
    }

    $DEVHOSTIP = ($ipInfo | Where-Object {($_ -ne '127.0.0.1') -and ($_ -notlike '172.*') -and ($_ -notlike '192.*') -and ($_ -notlike '*.255') } )
    return $DEVHOSTIP
}

$HOSTIP = Get-IpAddress

# update configs with Host Machine IP
(get-content ".\membership\appsettings.json.orig") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\membership\appsettings.Development.json"
(get-content ".\website\app\static\appConfig.orig.json") | foreach-object {$_ -replace "REPLACE_WITH_HOSTIP", $HOSTIP} | set-content ".\website\app\static\appConfig.json"

Set-Location website
write-output (npm install)

Set-Location ..
