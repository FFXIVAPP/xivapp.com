#!/bin/sh
# ROOT_UID=0
#
# # Run as root
# if [ "$UID" -ne "$ROOT_UID" ]; then
#   echo "Must be root to run this script."
#   exit
# fi

LAUNCH_DIR=${PWD}

stop xivapp.com

cd ..

rm -rf node_modules/
yarn
# ensure conf files
cd $LAUNCH_DIR
yes | cp -f xivapp.com.init.conf /etc/init/xivapp.com.conf
yes | cp -f xivapp.com.nginx.conf /etc/nginx/conf.d/xivapp.com.conf

start xivapp.com

nginx -s reload
