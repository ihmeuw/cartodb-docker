#!/bin/bash

set -e

# create the output directory for the config file
mkdir -p /etc/cartodb

echo "Writing the configuration file /etc/cartodb/config.js..."
node config/environments/merge-modules -i $@ -o /etc/cartodb/config.js

echo "Starting the application..."
exec node app -c /etc/cartodb/config.js
