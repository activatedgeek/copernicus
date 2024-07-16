---
title: Building Docker Images on Travis CI
description: A reference Travis YAML for automated Docker builds
date: Apr 7 2016, 3:40 +0530
area: tech
redirectsFrom:
  - /blog/docker-on-travis
---

?> :warning: This post is archived.

Docker has been the star of the recent times and I have recently been
building a lot of Docker images, deploying them to both development and
production (luckily yes!).

[`Travis CI`](https://travis-ci.org) is one of the most popular CI services and
I have lately been using it extensively. It is awesome!

## Travis CI YAML

Here is a simple `.travis.yml` to get started with Docker builds on `Travis`.

```yml
sudo: required

services:
  - docker

env:
  # IMPORTANT! Add your docker slug here (commit once)
  - DOCKER_REPO_SLUG=activatedgeek/mariadb

script:
  # build latest image always
  - docker build -t $DOCKER_REPO_SLUG:latest .
  # build the tagged image
  - if [[ $TRAVIS_TAG = $TRAVIS_BRANCH ]]; then docker build -t $DOCKER_REPO_SLUG:$TRAVIS_BRANCH .; else true ; fi

after_success:
  # IMPORTANT! Add the environment variables in Travis Build Environment (one time!)
  - docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
  # push to latest if master branch
  - if [[ $TRAVIS_BRANCH = master ]]; then docker push $DOCKER_REPO_SLUG:latest; else true; fi
  # push tag as well
  - if [[ $TRAVIS_TAG = $TRAVIS_BRANCH ]]; then docker push $DOCKER_REPO_SLUG:$TRAVIS_TAG; else true ; fi
```

Here is how the build behaves under different scenarios:

- Push to a branch other than master -> Builds image and exits

- Push to branch master -> Builds the image tag `latest`

- Push a tag -> Builds the image with corresponding git tag

## Notes

As a reference project, have a look at
[https://github.com/activatedgeek/docker-mariadb](https://github.com/activatedgeek/docker-mariadb).

The corresponding Travis builds are available publicly at
[https://travis-ci.org/activatedgeek/docker-mariadb](https://travis-ci.org/activatedgeek/docker-mariadb).

## Assumptions

- The Docker build always uses the default `Dockerfile` present in the root of the project
- The Docker image is always pushed to Docker Hub.

The implications of above two assumptions are easy to overcome if need be.
