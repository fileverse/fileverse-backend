#!/usr/bin/env bash

source /docker-lib.sh
start_docker
# Strictly speaking, preloading of Docker images is not required.
# However, you might want to do this for a couple of reasons:
# - If the image comes from a private repository, it is much easier to let Concourse pull it,
#   and then pass it through to the task.
# - When the image is passed to the task, Concourse can often get the image from its cache.
docker load -i mongo/image
docker tag "$(cat mongo/image-id)" "$(cat mongo/repository):$(cat mongo/tag)"

# This is just to visually check in the log that images have been loaded successfully.
docker images

# Run the container with tests and its dependencies.
docker-compose -f express_gql/ci/services.yml up -d

curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile 

cd express_gql && npm install && npm test

# Cleanup.
# Not sure if this is required.
# It's quite possible that Concourse is smart enough to clean up the Docker mess itself.
docker volume rm $(docker volume ls -q)
