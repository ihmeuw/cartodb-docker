# cartodb-editor
### Carto web application

This image contains the [Carto web application](https://github.com/CartoDB/cartodb), used to administer the Carto system.

## Configuration

Upon starting the application, a new user will be created so that you can log into the system. For security, we recommend you change the default login credentials by passing the following environment variables to the container:
- DEFAULT_USER (default: username)
- PASSWORD (default: password)
- EMAIL (default: username@example.com)

To set the public URL on which the application will be visible to web traffic, you can pass hostname and port to the container via these environment variables:
- PUBLIC_HOST (default: localhost)
- PUBLIC_PORT (default: 80)

The application is configured using two YAML files, `app_config.yml` and `database.yml`. Carto supplies sample versions of these files, `app_config.yml.sample` and `database.yml.sample` in the (container) directory `/cartodb/config/`. You can configure the system to your liking by supplying your own YAML files. Simply extend this image by `COPY`ing custom config files into `/cartodb/config/`,
and pass the names of your files via the `command` to the container like this:

```dockerfile
CMD [ \
  "--app_config", "my_app_config.yml", \
  "--database", "my_database.yml" \
]
```

If desired, you can supply multiple filenames for both `--app_config` and `--database`. The configuration objects they contain will be merged. Note that with respect to merging, files earlier in the list take precedence over files later in the list.

Note also that we supply some additional configuration, in the files `base.app_config.yml` and `base.database.yml`, to make this image work together with the other `cartodb-docker` images. These configuration settings have the highest precedence, overriding the same fields in any other configuration files supplied. We don't recommend you override these files, because the container startup script, `docker-entrypoint.sh`, assumes they'll be present. If you do replace them, you'll likely need to modify the startup script too or else supply your own.

# Usage

The container generally takes a few minutes to initialize the system after starting up. Once it has finished initializing (watch the container log for the message "Starting the application..."), you should be able to access it from a web browser via the URL `PUBLIC_HOST:PUBLIC_PORT`, filling in the values you supplied for the corresponding environment variables (NB: if `PUBLIC_PORT` is 80, you can just use the URL `PUBLIC_HOST`). At the login prompt, enter the credentials you supplied to the container as `DEFAULT_USER` and `PASSWORD`. Now you can use Carto!
