#! /bin/bash

source .env

cd ..

if [ -f bean.zip ]; then
{
    echo "found an existing bean.zip file"
    echo "removing..."
    rm bean.zip
    echo "removed..."
    sleep 1
}
fi

zip -r bean.zip docker-compose.yml .ebextensions

timestamp=$(date +%s)

aws s3 cp bean.zip $SERVICE_ZIP_URL

echo "creating application version..."

aws elasticbeanstalk create-application-version \
    --application-name propel \
    --version-label $timestamp \
    --source-bundle S3Bucket="$SERVICE_S3_BUCKET",S3Key="bean.zip"

echo "updating environment..."

aws elasticbeanstalk update-environment \
    --application-name propel \
    --environment-name Propel-env-1 \
    --version-label $timestamp