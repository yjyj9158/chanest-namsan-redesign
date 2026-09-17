# Node.js PATH 새로고침 후 dev 서버 실행
# 이 프로젝트 전용 포트: 3010 (3000 충돌 방지)

$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$nodeDir;" + [System.Environment]::GetEnvironmentVariable('Path','Machine') + ";" + [System.Environment]::GetEnvironmentVariable('Path','User')

Set-Location $PSScriptRoot

Write-Host "Node: $( & "$nodeDir\node.exe" --version )"
Write-Host "npm:  $( & "$nodeDir\npm.cmd" --version )"
Write-Host ""
Write-Host "Guest : http://localhost:3010/"
Write-Host "Admin : http://localhost:3010/admin"
Write-Host ""

& "$nodeDir\npm.cmd" run dev
