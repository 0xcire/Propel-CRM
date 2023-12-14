#! /bin/sh

cd ..

cd client

if [ -d dist ]; then
{
    echo "removing previous build"
    rm -rf dist
}
fi

npm run build

aws s3 sync --delete dist $CLIENT_S3_BUCKET
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION \
    --paths "/*"
