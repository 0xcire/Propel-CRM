#! /bin/bash

TAGGED_NGINX_IMAGE='c1re/propel-nginx'
TAGGED_SERVICE_IMAGE='c1re/propel-service'
BUILT_NGINX_IMAGE='nginx-prod'
BUILT_SERVICE_IMAGE='server-prod'

tagged_images=($TAGGED_NGINX_IMAGE $TAGGED_SERVICE_IMAGE)
built_images=($BUILT_NGINX_IMAGE $BUILT_SERVICE_IMAGE)

remove_images () {
    for((i = 0 ; i < 2 ; ++i));
    do
        if docker image inspect "${built_images[$i]}" >/dev/null 2>&1; then
        {
            docker rm "${built_images[$i]}"
            docker rmi "${built_images[$i]}"
        }
        else echo "${built_images[$i]} doesn't exist"
        fi
        if docker image inspect "${tagged_images[$i]}" >/dev/null 2>&1; then
        {
            docker rmi "${tagged_images[$i]}"
        }
        else echo "${tagged_images[$i]} doesn't exist"
        fi
    done
}

remove_images 

build_push_images () {
    docker compose -f ../.docker/docker-compose.local.yml build
    for ((i = 0 ; i < 2 ; ++i));
    do
    {
        docker tag "${built_images[$i]}" "${tagged_images[$i]}" && docker push "${tagged_images[$i]}"
    }
    done
}

build_push_images