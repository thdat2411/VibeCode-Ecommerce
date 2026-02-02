<#
Usage:
  - With GitHub CLI (recommended):
      .\push-to-github.ps1 -RepoName "my-repo" -Visibility public

  - Without gh: create a repo on GitHub first, then run:
      .\push-to-github.ps1 -RemoteUrl "https://github.com/you/my-repo.git"

The script will initialize git, create an initial commit, and push.
#>

param(
    [string]$RepoName,
    [ValidateSet('public','private')]
    [string]$Visibility = 'private',
    [string]$RemoteUrl
)

Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent) | Out-Null
Set-Location -Path "$PWD" | Out-Null

if (-not (Test-Path -Path .git)) {
    git init
}

git add .
if (-not (git rev-parse --verify HEAD 2>$null)) {
    git commit -m "Initial commit"
} else {
    git commit -am "Update" || Write-Host "No changes to commit"
}

if ($RepoName -and (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Creating GitHub repo with gh: $RepoName ($Visibility)"
    gh repo create $RepoName --$Visibility --source . --remote origin --push
    exit $LASTEXITCODE
}

if ($RemoteUrl) {
    if (-not (git remote)) {
        git remote add origin $RemoteUrl
    } else {
        git remote set-url origin $RemoteUrl
    }
    git branch -M main
    git push -u origin main
    exit $LASTEXITCODE
}

Write-Host "Neither 'gh' was available nor a RemoteUrl provided."
Write-Host "Options:"
Write-Host " - Install and authenticate GitHub CLI, then run: .\push-to-github.ps1 -RepoName my-repo -Visibility public"
Write-Host " - Or create a repo on github.com, then run: .\push-to-github.ps1 -RemoteUrl https://github.com/you/repo.git"
