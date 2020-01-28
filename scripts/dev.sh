#!/bin/sh
export NODE_ENV=development

mkdir -p public

cp ./src/LICENSE.txt ./public
cp ./src/resume.html ./public
cp -a ./archive ./public

parcel ./src/index.html  --out-dir ./public
