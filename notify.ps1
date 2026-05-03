param([string]$Title, [string]$Body)

Add-Type -AssemblyName System.Windows.Forms

$balloon = New-Object System.Windows.Forms.NotifyIcon
$balloon.Icon = [System.Drawing.SystemIcons]::Information
$balloon.BalloonTipTitle = $Title
$balloon.BalloonTipText = $Body
$balloon.Visible = $true
$balloon.ShowBalloonTip(0)

# Keep message pump running so balloon actually displays
$start = Get-Date
while (([DateTime]::Now - $start).TotalSeconds -lt 10) {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 200
}
$balloon.Dispose()
