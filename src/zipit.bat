@echo off
echo "postbuild batch file would normally run now"

REM Zip javascript and css
REM 7z a -tgzip -mx=9 "dist\rentcheck\main.js.gz" "dist\rentcheck\main.*.js"
REM 7z a -tgzip -mx=9 "dist\rentcheck\polyfills.js.gz" "dist\rentcheck\polyfills.*.js"
REM 7z a -tgzip -mx=9 "dist\rentcheck\runtime.js.gz" "dist\rentcheck\runtime.*.js"
REM 7z a -tgzip -mx=9 "dist\rentcheck\styles.css.gz" "dist\rentcheck\styles.*.css"

REM Rename to original file name

REM Send to AWS
REM aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.js" --content-type "text/javascript" --content-encoding "gzip" --acl public-read
REM aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.css" --content-type "text/css" --content-encoding "gzip" --acl public-read
REM aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.html" --acl public-read