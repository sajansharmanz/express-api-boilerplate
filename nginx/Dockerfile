FROM nginx:1.25.3-alpine3.18

COPY ./config/default.conf /etc/nginx/conf.d/default.conf
COPY ./certs/cert-key.pem /etc/ssl/private
COPY ./certs/cert.pem /etc/ssl/certs