Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Push-Location $root
try {
  python -m compileall backend

  Push-Location (Join-Path $root 'frontend')
  try {
    npm.cmd run build
  }
  finally {
    Pop-Location
  }
}
finally {
  Pop-Location
}

Write-Host 'Pipeline validation complete.'
