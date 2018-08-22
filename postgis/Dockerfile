FROM postgres:9.5

RUN apt-get update \
  && apt-get -y --no-install-recommends install \
    build-essential \
    git \
    # PostgreSQL
    libpq-dev \
    libpq5 \
    postgresql-contrib-9.5 \
    postgresql-plpython-9.5 \
    postgresql-server-dev-9.5 \
    # GIS:
    # - Proj
    libproj-dev \
    proj-bin \
    proj-data \
    # - JSON
    libjson-c3 \
    libjson-c-dev \
    python-simplejson \
    # - GEOS
    libgeos-c1v5 \
    libgeos-dev \
    # - GDAL
    libgdal20 \
    gdal-bin \
    libgdal-dev \
    # PostGIS
    liblwgeom-2.3\* \
    libxml2-dev \
    postgis-2.3 \
    postgresql-9.5-postgis-2.3 \
    postgresql-9.5-postgis-2.3-scripts \
  && rm -rf /var/lib/apt/lists/*

# CartoDB/cartodb-postgresql version
ENV CARTODB_POSTGRESQL_VERSION=0.22.0

RUN git clone \
    --branch ${CARTODB_POSTGRESQL_VERSION} \
    --depth 1 git://github.com/CartoDB/cartodb-postgresql.git \
  && cd cartodb-postgresql \
  && make all install \
  && mkdir -p /docker-entrypoint-initdb.d

COPY initdb-postgis.sh /docker-entrypoint-initdb.d/01-postgis.sh

# Let Postgres listen on all addresses (it's just localhost by default).
ENTRYPOINT [ "docker-entrypoint.sh", "postgres", "-c", "listen_addresses=*" ]

# Empty CMD directive to override CMD in the base image.
# Additional configuration options can be passed via a custom command.
CMD []
