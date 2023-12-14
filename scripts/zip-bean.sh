#! /bin/sh

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

aws elasticbeanstalk create-application-version \
    --application-name propel \
    --version-label $timestamp \
    --source-bundle S3Bucket="$SERVICE_S3_BUCKET",S3Key="bean.zip"

aws elasticbeanstalk update-environment \
    --application-name propel \
    --environment-name Propel-env \
    --version-label $timestamp
