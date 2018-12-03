# cartodb-docker
### containerization resources for CartoDB (aka Carto)

This repository provides Docker images for each of the services that comprise [Carto](https://carto.com), so that the application can be deployed in a containerized environment. The setup of each service is based on [the development documentation](https://cartodb.readthedocs.io) from Carto. We recommend you consult that document for up-to-date details on how to use the application.

There are subdirectories corresponding to each of the Carto services:
- `editor`: the Carto web application (https://github.com/CartoDB/cartodb)
- `mapsapi`: map tile API server (https://github.com/CartoDB/Windshaft-cartodb)
- `sqlapi`: API server allowing arbitrary SQL queries against the database (https://github.com/CartoDB/CartoDB-SQL-API)
- `postgis`: PostGIS database server with Carto extensions (https://github.com/CartoDB/cartodb-postgresql)
- `redis`: data store used by other Carto components; an off-the-rack Redis image configured to persist data on disk

In addition, we supply a simple nginx reverse-proxy server image (in the `router` subdirectory), configured to allow access to all Carto endpoints via a single base URL, and a sample `docker-compose.yml` as an example of how these services may be linked together to run the whole application.

See the `README.md` file in each subdirectory for details on using the various Docker images.

## Usage

To run this application, you need to have a recent version of Docker installed. To spin up a bare-bones implementation locally, with default configuration, simply run this command from the project root:
```
docker-compose -d up
```

In a more real-world scenario, you'll want to:
1. provide some custom configuration
2. deploy the application in an environment where the containers can be distributed across muliple logical hosts

To configure Carto to your specific needs, at a minimum you'll need to supply your own `docker-compose.yml`, or whatever configuration file(s) are needed by your container orchestration engine. That would allow options like:
- configuring containers with custom environment variables
- configuring containers with a custom `command` and/or `entrypoint`
- changing the port on which the application is exposed to outside traffic
- attaching volumes to persist data beyond the life of the containers
- add your own containerized application(s) to consume the Carto services
- and more

## Why use this incarnation of Carto?

If you're reading this, perhaps you already have an idea why you want to use Carto. If not, have a look at the [Carto homepage](https://carto.com) for a description of the platform and what it's useful for.

The Carto team provides [detailed instructions](https://cartodb.readthedocs.io/en/latest/install.html) for installing the system. These instructions assume you're installing all the components on a single logical host, though, and no resources are provided for containerization. For those who want a containerized Carto, several open-source solutions do exist. Why then use this one?

As of this writing, most of the alternative solutions put the entire application in a single image. That certainly makes setup simpler, but it seems contrary to the container paradigm, where each process should ideally inhabit a separate container. Packing a PostGIS database server, a Redis instance, two Node.JS API servers, and a full Ruby on Rails web application into a single image has several disadvantages:
- the image is truly massive
- services can't be distributed or replicated across multiple hosts, limiting performance and scalability
- the system becomes a monolith in which all the parts are entangled

This is of course not the appropriate place to detail the tradeoffs between a monolithic architecture versus a microservices approach, but the container paradigm is certainly geared towards the latter. This repo attempts to package Carto as an idiomatic containerized application, in which each service inhabits a separate container.

We've also taken pains to make the images configurable and extensible. Most allow you to configure a container at runtime by modifying the `command` and/or `entrypoint`, and more advanced configuration changes can be accomplished simply by extending these images and adding one or more configuration files to your derived image.  Again, see the `README.md` in each subdirectory for details.

## Versioning and image tags

Each image in this repo is versioned separately. In each subdirectory you'll find a file called `VERSION` that records two fields:
- `SOFTWARE_VERSION`: the version of the underlying piece of software we're containerizing
- `IMAGE_VERSION`: the version of the image itself, reflecting the contents of the Dockerfile and other resources in this repo used to create the image

Each image tag uses the format: `<SOFTWARE_VERSION>-<IMAGE_VERSION>`.
