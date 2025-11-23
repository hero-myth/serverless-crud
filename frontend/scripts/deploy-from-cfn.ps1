Param(
	[string]$Stage = "dev",
	[string]$Region = $env:AWS_REGION
)

if (-not $Region) {
	Write-Error "AWS_REGION is not set. Set AWS credentials/region before running."
	exit 1
}

$stackName = "sguru-crud-api-$Stage"

Write-Host "Reading CloudFormation outputs from stack '$stackName' in $Region ..."
$outputsJson = aws cloudformation describe-stacks --region $Region --stack-name $stackName --query "Stacks[0].Outputs" --output json
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$outputs = $outputsJson | ConvertFrom-Json

function Get-Output($key) {
	($outputs | Where-Object { $_.OutputKey -eq $key }).OutputValue
}

$bucket = Get-Output "FrontendBucketName"
$distId = Get-Output "CloudFrontDistributionId"
if (-not $bucket) {
	Write-Error "Could not find FrontendBucketName output on stack $stackName"
	exit 1
}

Write-Host "Building frontend..."
Push-Location $PSScriptRoot\..\..
Push-Location frontend
npm ci | Out-Null
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; Pop-Location; exit $LASTEXITCODE }

Write-Host "Syncing dist/ to s3://$bucket ..."
aws s3 sync ./dist "s3://$bucket" --delete
if ($LASTEXITCODE -ne 0) { Pop-Location; Pop-Location; exit $LASTEXITCODE }

if ($distId) {
	Write-Host "Creating CloudFront invalidation on $distId ..."
	aws cloudfront create-invalidation --distribution-id $distId --paths "/*" | Out-Null
}

Pop-Location
Pop-Location

Write-Host "Deploy complete."
Read-Host "Press Enter to exit"

