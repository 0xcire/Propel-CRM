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

turbo run build --filter=client...

#aws s3 sync --delete ./apps/client/dist $CLIENT_S3_BUCKET

#aws cloudfront create-invalidation \
#    --distribution-id $CLOUDFRONT_DISTRIBUTION \
#    --paths "/*"
