FROM nginx:1.20.2

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/. /usr/share/nginx/html
# COPY cert/domain.crt /usr/nginx/
# COPY cert/domain.key /usr/nginx/
# COPY cert/domain.pass /usr/nginx/

EXPOSE 80:80
