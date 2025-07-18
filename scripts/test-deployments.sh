#!/usr/bin/env bash
#
## Purpose: Create 600 GitHub deployments to test deployment limits

set -e          # exit if command failed.
set -u          # exit if variable not set.
set -o pipefail # exit if pipe failed.

readonly GITHUB_TOKEN="${GITHUB_TOKEN}"
readonly GITHUB_REPOSITORY="${GITHUB_REPOSITORY}"
readonly GITHUB_REF="${GITHUB_REF:-$GITHUB_SHA}"

echo "Starting deployment limit test - creating 600 deployments..."

for i in {1..600}; do
  echo "Creating deployment $i/600"
  
  # Create deployment
  DEPLOYMENT_RESPONSE=$(curl -s -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${GITHUB_REPOSITORY}/deployments" \
    -d "{
      \"ref\": \"${GITHUB_REF}\",
      \"environment\": \"test-env-${i}\",
      \"description\": \"Test deployment ${i}/600 - limit testing\",
      \"auto_merge\": false,
      \"required_contexts\": []
    }")

  DEPLOYMENT_ID=$(echo "${DEPLOYMENT_RESPONSE}" | jq -r '.id')

  if [[ "${DEPLOYMENT_ID}" == "null" || -z "${DEPLOYMENT_ID}" ]]; then
    echo "Error: Failed to create deployment $i"
    echo "Response: ${DEPLOYMENT_RESPONSE}"
    exit 1
  fi

  echo "Created deployment $i with ID: ${DEPLOYMENT_ID}"

  # Create deployment status
  curl -s -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${GITHUB_REPOSITORY}/deployments/${DEPLOYMENT_ID}/statuses" \
    -d "{
      \"state\": \"success\",
      \"environment_url\": \"https://test-env-${i}.example.com\",
      \"description\": \"Test deployment ${i} successful\"
    }" > /dev/null

  echo "Deployment $i status set to success"
  
  # Small delay to avoid rate limiting
  sleep 0.1
done

echo "Successfully created 600 deployments!"
exit 0