#! /bin/sh

cd ..

cd client

aws s3 sync --delete dist s3://propel-static