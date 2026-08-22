# Node.js PATH 새로고침 후 dev 서버 실행
# Cursor를 재시작하기 전까지 이 스크립트를 사용하세요.

$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$nodeDir;" + [System.Environment]::GetEnvironmentVariable('Path','Machine') + ";" + [System.Environment]::GetEnvironmentVariable('Path','User')

Set-Location $PSScriptRoot

Write-Host "Node: $( & "$nodeDir\node.exe" --version )"
Write-Host "npm:  $( & "$nodeDir\npm.cmd" --version )"
Write-Host ""
Write-Host "Starting dev server at http://localhost:3000 ..."
Write-Host ""

& "$nodeDir\npm.cmd" run dev
