#!/bin/sh
export NODE_ENV=production

mkdir -p ./public

cp ./src/LICENSE.txt ./public/LICENSE.txt
cp ./src/resume.html ./public/resume.html
cp ./src/resume-detailed.html ./public/resume-detailed.html
cp -a ./archive ./public

parcel build ./src/index.html  --dist-dir ./public
