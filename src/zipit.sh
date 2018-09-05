#!/bin/bash

# Zip it
gzip -9 ../dist/rentcheck/runtime.*.js
gzip -9 ../dist/rentcheck/main.*.js
gzip -9 ../dist/rentcheck/polyfills.*.js
gzip -9 ../dist/rentcheck/styles.*.css

# Rename for AWS
for f in ../dist/rentcheck/*.gz; do mv "$f" "${f%.gz}"; done

# Send to AWS
aws s3 cp --include "*.js" --include "*.css" --include "*.html"