#!/bin/sh
# ROOT_UID=0
#
# # Run as root
# if [ "$UID" -ne "$ROOT_UID" ]; then
#   echo "Must be root to run this script."
#   exit
# fi

LAUNCH_DIR=${PWD}

# ensure static sites
cd ../default/
mkdir -p /opt/www
yes | cp -f static_sites/* /opt/www/

# ensure conf files
cd $LAUNCH_DIR
yes | cp -f default.nginx.conf /etc/nginx/conf.d/default.conf

nginx -s reload
