param (
    [Parameter(Mandatory=$true)][string]$GCPProjectName = $( Read-Host "Project name missing" ),
    [Parameter(Mandatory=$true)][string]$ClusterName = $( Read-Host "Cluster Name missing" ),
    [Parameter(Mandatory=$true)][string]$Zone = $( Read-Host "Zone missing" ),
    [Parameter(Mandatory=$true)][string]$Port = $( Read-Host "Port missing" )
)

Write-Host -ForegroundColor Yellow "Connect to GCP Project"
& gcloud.cmd container clusters get-credentials $ClusterName --project $GCPProjectName --zone $Zone

Write-Host -ForegroundColor Yellow "Finding Hub Pob Name"
$HubPodName = kubectl.exe get pods --selector="app=selenium-hub" --output=template --template="{{with index .items 0}}{{.metadata.name}}{{end}}"

Write-Host -ForegroundColor Blue "Starting Port Forwarding Process"
$Portmapping = $Port + ":4444" 
Start-Process -WindowStyle Minimized powershell -Argument "kubectl port-forward $HubPodName $Portmapping"