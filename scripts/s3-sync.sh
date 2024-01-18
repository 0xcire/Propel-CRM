#! /bin/bash

if [ -f .env ]; then
{
    source .env
}
fi

cd ..

if [ -d ./apps/client/dist ]; then
{
    echo "removing previous build"
    rm -rf ./apps/client/dist
}
fi

# https://stackoverflow.com/questions/50475389/how-to-determine-if-npm-module-installed-in-bash
npm list -g | grep turbo || npm install -g turbo --no-shrinkwrap

turbo run build --filter=client...

aws s3 sync --delete ./apps/client/dist $CLIENT_S3_BUCKET

aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION \
    --paths "/*"
