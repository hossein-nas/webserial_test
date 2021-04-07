FROM adoptopenjdk/openjdk11

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y git
RUN npm install -g npm@latest

RUN git clone https://github.com/hossein-nas/webserial_test.git
WORKDIR /webserial_test
RUN git checkout change-ui
RUN npm install
RUN ./node_modules/.bin/quasar build
EXPOSE 8000
RUN apt-get install -y nginx openssl 
RUN cd /etc/nginx
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/cert.key -out /etc/nginx/cert.crt -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com"
ADD default.conf /etc/nginx/conf.d/
ADD ssl.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/* && cp -r /webserial_test/dist/spa/* /usr/share/nginx/html/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf #2
CMD service nginx start #1
