FROM nginx:1.19-alpine

ARG PROXY_CONF_FILE=./proxy.conf

COPY $PROXY_CONF_FILE /etc/nginx/conf.d/default.conf