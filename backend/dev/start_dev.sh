#!/bin/sh

./node_modules/.bin/directus bootstrap
exec ./node_modules/.bin/nodemon --exec ./node_modules/.bin/directus start