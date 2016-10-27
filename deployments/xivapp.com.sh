#!/bin/sh
# ROOT_UID=0
#
# # Run as root
# if [ "$UID" -ne "$ROOT_UID" ]; then
#   echo "Must be root to run this script."
#   exit
# fi

LAUNCH_DIR=${PWD}

systemctl disable xivapp.com.service
stop xivapp.com.service

cd ..

rm -rf node_modules/
yarn
# ensure conf files
cd $LAUNCH_DIR
yes | cp -f xivapp.com.service /etc/systemd/system/xivapp.com.service
yes | cp -f xivapp.com.nginx.conf /etc/nginx/conf.d/xivapp.com.conf

systemctl start xivapp.com.service
systemctl enable xivapp.com.service

nginx -s reload
