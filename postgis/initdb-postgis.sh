#!/bin/sh

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

echo "Creating user 'publicuser'..."
createuser publicuser --no-createrole --no-createdb --no-superuser -U $PGUSER
echo "Creating user 'tileuser'..."
createuser tileuser --no-createrole --no-createdb --no-superuser -U $PGUSER

# Initialize template_postgis database. We create a template database in postgresql that will
# contain the postgis extension. This way, every time CartoDB creates a new user database it just
# clones this template database
echo "Creating database 'template_postgis'..."
createdb -T template0 -O postgres -U $PGUSER -E UTF8 template_postgis
echo "Creating extensions 'postgis' and 'postgis_topology' on database 'template_postgis'..."
psql -U $PGUSER template_postgis -c 'CREATE EXTENSION postgis;CREATE EXTENSION postgis_topology;'
