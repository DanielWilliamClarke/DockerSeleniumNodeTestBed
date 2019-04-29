param (
    [Parameter(Mandatory=$true)][string]$ConfigDir = $( Read-Host "Config Directory missing" ),
    [Parameter(Mandatory=$true)][string]$GCPProjectName = $( Read-Host "Project name missing" ),
    [Parameter(Mandatory=$true)][string]$ClusterName = $( Read-Host "Cluster Name missing" ),
    [Parameter(Mandatory=$true)][string]$Zone = $( Read-Host "Zone missing" ),
    [Parameter(Mandatory=$true)][string]$RequiredNodes = $( Read-Host "Scaling Value missing" ),
    [Parameter(Mandatory=$false)][switch]$ScaleOnly
)

Write-Host "ConfigDir=$ConfigDir"
Write-Host "ClusterName=$ClusterName"
Write-Host "GCPProjectName=$GCPProjectName"
Write-Host "Zone=$Zone"

if(!$ScaleOnly) {
  Write-Host -ForegroundColor Yellow "Connect to GCP Project"
  & gcloud container clusters get-credentials $ClusterName --project $GCPProjectName --zone $Zone
  
  Write-Host -ForegroundColor Yellow "Deploy Selenium Grid"
  & kubectl create --filename=$ConfigDir/selenium-hub-deployment.yaml
  & kubectl create --filename=$ConfigDir/selenium-hub-svc.yaml
  & kubectl create --filename=$ConfigDir/selenium-node-chrome-deployment.yaml
  & kubectl create --filename=$ConfigDir/selenium-node-firefox-deployment.yaml
}

Write-Host -ForegroundColor Yellow "Scale Browser Nodes"
if($RequiredNodes -gt 5) {
  Write-Host -ForegroundColor Red "Maximum nodes requested"
  $RequiredNodes = 5
}

Write-Host -ForegroundColor Red "Scaling Back Browser Nodes"
& kubectl scale deployment selenium-node-chrome --replicas=0
& kubectl scale deployment selenium-node-firefox --replicas=0 

Write-Host -ForegroundColor Green "Scaling Up Browser Nodes"
& kubectl scale deployment selenium-node-chrome --replicas=$RequiredNodes  
& kubectl scale deployment selenium-node-firefox --replicas=$RequiredNodes  