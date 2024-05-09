#!/usr/bin/env sh

if [ -f .env ]; then
    source .env
    echo "Reading .env file to get AWS_PROFILE variable"
else
    echo "No .env file found, setting default AWS_PROFILE to 'ephemeral-delivery-enablement'"
    export AWS_PROFILE="personal"
fi
# Check if session is valid by listing S3 buckets
if aws s3 ls --profile $AWS_PROFILE >/dev/null 2>&1; then
    echo "Session is valid."
else
    echo "Session is invalid. AWS SSO login required. Logging in..."
    aws sso login --profile $AWS_PROFILE
fi
