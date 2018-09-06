@echo off
echo "postbuild batch file would normally run now"
REM Zip javascript and css
CD dist\rentcheck
FOR %%i IN (*.js) DO (
  7z.exe a -tgzip -mx=9 "%%~ni.js.gz" "%%i"
  DEL "%%i"
  MOVE "%%i.gz" "%%~ni.js"
)
FOR %%i IN (*.css) DO (
  7z.exe a -tgzip -mx=9 "%%~ni.css.gz" "%%i"
  DEL "%%i"
  MOVE "%%i.gz" "%%~ni.css"
)
CD ..\..

REM Rename to original file name (in above loop)

REM Send to AWS
aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.js" --content-type "text/javascript" --content-encoding "gzip" --acl public-read
aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.css" --content-type "text/css" --content-encoding "gzip" --acl public-read
aws s3 cp dist\rentcheck s3://rentcheck.ninja --recursive --exclude "*" --include "*.html" --acl public-read
