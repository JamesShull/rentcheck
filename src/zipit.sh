#!/bin/bash

cd dist/rentcheck
# Zip it
gzip -9 runtime-es5.*.js
gzip -9 runtime-es2015.*.js
gzip -9 main-es5.*.js
gzip -9 main-es2015.*.js
gzip -9 polyfills-es5.*.js
gzip -9 polyfills-es2015.*.js
gzip -9 styles.*.css

# Rename for AWS
for f in *.gz; do mv "$f" "${f%.gz}"; done
cd ../..
# Send to AWS
aws s3 cp dist/rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.js" --content-type "text/javascript" --content-encoding "gzip" --acl public-read
aws s3 cp dist/rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.css" --content-type "text/css" --content-encoding "gzip" --acl public-read
aws s3 cp dist/rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.html" --acl public-read