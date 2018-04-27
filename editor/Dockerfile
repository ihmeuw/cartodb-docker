FROM ubuntu:12.04

# Set locale.
RUN locale-gen en_US.UTF-8 && update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 \
  # Install python-software-properties package to make it easier to use PPAs.
  && apt-get update && apt-get -y --no-install-recommends install \
    python-software-properties \
  # Add PPAs.
  && add-apt-repository ppa:cartodb/gcc \
  && add-apt-repository ppa:cartodb/gis \
  && add-apt-repository ppa:cartodb/nodejs \
  && add-apt-repository ppa:cartodb/postgresql-9.5 \
  # Install apt packages.
  && apt-get update && apt-get -y --no-install-recommends install \
    # build essentials
    autoconf \
    binutils-doc \
    bison \
    build-essential \
    flex \
    gcc-4.9 \
    g++-4.9 \
    # Git
    git \
    # PostgreSQL
    libpq5 \
    libpq-dev \
    postgresql-client-9.5 \
    postgresql-client-common \
    # GIS:
    # - Proj
    proj \
    proj-bin \
    proj-data \
    libproj-dev \
    # - JSON
    libjson0 \
    libjson0-dev \
    python-simplejson \
    # - GEOS
    libgeos-c1v5 \
    libgeos-dev \
    # - GDAL
    gdal-bin \
    libgdal-dev \
    libgdal1-dev \
    gdal2.1-static-bin \
    # Postgis
    libxml2-dev \
    liblwgeom-2.2.2 \
    postgis \
    postgresql-9.5-postgis-2.2 \
    postgresql-9.5-postgis-scripts \
    # NodeJS and dependencies
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libpixman-1-0 \
    libpixman-1-dev \
    nodejs \
    # Ruby dependencies
    libreadline6-dev \
    openssl \
    # Python dependencies
    imagemagick \
    python-all-dev \
    unp \
    zip \
    # Other dependencies
    unzip \
    wget \
  # Install Ruby.
  && wget -O ruby-install-0.5.0.tar.gz https://github.com/postmodern/ruby-install/archive/v0.5.0.tar.gz \
  && tar -xzvf ruby-install-0.5.0.tar.gz \
  && cd ruby-install-0.5.0/ \
  && make install \
  && ruby-install ruby 2.2.3 \
  && cd / \
  # Install Pip.
  && wget -O /tmp/get-pip.py https://bootstrap.pypa.io/get-pip.py \
  && python /tmp/get-pip.py \
  # Clean up.
  && rm ruby-install-0.5.0.tar.gz \
  && rm -rf ruby-install-0.5.0 \
  && rm /tmp/get-pip.py \
  && rm -rf /var/lib/apt/lists/*

ENV CC=/usr/bin/gcc-4.9
ENV CXX=/usr/bin/g++-4.9
ENV PATH=/opt/rubies/ruby-2.2.3/bin:$PATH

# Install Ruby utilities.
RUN gem install bundler compass

# CartoDB/cartodb version
ENV CARTODB_VERSION=4.11.108

# Download the Editor program, using the specified release tag.
RUN git clone --recursive --branch v${CARTODB_VERSION} --depth 1 https://github.com/CartoDB/cartodb.git

WORKDIR /cartodb

# Environment type.
ENV RAILS_ENV=development

# Install Ruby dependencies.
RUN bundle install \
  # Install Node dependencies.
  && npm install \
  # Add dependencies of configuration merge script.
  && npm install \
    js-yaml \
    yargs \
  # Install Python dependencies.
  && CPLUS_INCLUDE_PATH=/usr/include/gdal \
    C_INCLUDE_PATH=/usr/include/gdal \
    PATH=$PATH:/usr/include/gdal \
    pip install -r python_requirements.txt \
  # Build the project.
  && bundle install \
  && PATH=$PATH:/cartodb/node_modules/grunt-cli/bin \
    bundle exec grunt --environment=${RAILS_ENV} \
  # Clean up.
  && rm -rf \
    /root/.cache \
    /root/.bundle \
    /root/.gem \
    /root/.npm \
  && mkdir -p /cartodb/docker-entrypoint-util

# Copy resources.
COPY util/* /cartodb/docker-entrypoint-util/
COPY config/* /cartodb/config/
COPY docker-entrypoint.sh /cartodb/

EXPOSE 3000

# We configure the application using just the base config files here. Additional configuration files
# can be merged with the base by supplying their filenames as --app_config or --database option
# arguments in the CMD.
ENTRYPOINT [ \
  "./docker-entrypoint.sh", \
  "--app_config", "base.app_config.yml", \
  "--database", "base.database.yml" \
]

# We merge the sample config files with the base configs by default.
# Custom configuration may be used by extending this image as follows:
# 1) COPY one or more config files into /cartodb/config/.
# 2) Pass the filename(s) as --app_config or --database option arguments in the CMD.
CMD [ \
  "--app_config", "app_config.yml.sample", \
  "--database", "database.yml.sample" \
]
