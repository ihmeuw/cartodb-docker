# cartodb-sqlapi
### Maps API for cartodb-docker

This image contains the [Carto Maps API](https://github.com/CartoDB/Windshaft-cartodb), a map tile server.

## Configuration

The server can be configured via a `.js` file in a specific format. Carto provides several such files as examples:
- [development.js.example](https://github.com/CartoDB/Windshaft-cartodb/blob/master/config/environments/development.js.example)
- [production.js.example](https://github.com/CartoDB/Windshaft-cartodb/blob/master/config/environments/production.js.example)
- [staging.js.example](https://github.com/CartoDB/Windshaft-cartodb/blob/master/config/environments/staging.js.example)
- [test.js.example](https://github.com/CartoDB/Windshaft-cartodb/blob/master/config/environments/test.js.example)

By default this image uses `development.js.example`, but you can choose a different file simply by specifying its name as the `command` to the container. Alternatively, you can supply your own configuration file (or files). To do so, extend this image by `COPY`ing a custom config file into `/Windshaft-cartodb/config/environments/`
and pass the name of your file(s) as the `command` to the container. If you supply multiple filenames, the configuration objects they contain will be merged. Note that with respect to merging, files earlier in the list take precedence over files later in the list.

Note also that we supply some additional configuration, in the file `base.config.js`, to make this image work together with the other `cartodb-docker` images. These configuration settings have the highest precedence, overriding the same fields in any other configuration files supplied. If you need to override these settings, therefore, you'll need to override the container's `entrypoint`.
