rm -rf lib
mkdir lib
cp -r src/ lib/
rm lib/**/*.js
babel src -d lib