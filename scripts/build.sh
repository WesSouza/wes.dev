#!/bin/sh
export NODE_ENV=production

mkdir -p ./public

cp ./src/LICENSE.txt ./public/LICENSE.txt
cp ./src/resume.html ./public/resume.html
cp -a ./archive ./public

parcel build ./src/index.html  --out-dir ./public --experimental-scope-hoisting
