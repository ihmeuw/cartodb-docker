# cartodb-router
### reverse proxy server for cartodb-docker

This image extends the [official nginx Docker image](https://hub.docker.com/_/nginx/), configuring it to route Carto web traffic to the appropriate services. This simplifies requests, as all requests to Carto can use the same base URL and port.

This server is not a part of Carto itself; it's just a router to make requests simpler. Feel free to modify it or replace it as your needs dictate. You could for instance add routing to your own custom web application that consumes Carto services. Or you could swap out this nginx server in favor of Varnish if you want an HTTP cache.

## Routing

| Service      | URL                  |
| ------------ | -------------------- |
| Maps API     | [baseURL]/api/v1/map |
| SQL API      | [baseURL]/api/v2/sql |
| Carto Editor | [baseURL]/           |
