FROM nginx:1.10-alpine
COPY build /usr/share/nginx/html
ADD default.conf /etc/nginx/conf.d/
#VOLUME /etc/letsencrypt/live/games.alexecollins.com
