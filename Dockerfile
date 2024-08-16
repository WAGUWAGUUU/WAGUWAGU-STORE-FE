FROM nginx
COPY dist /react
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80