FROM adoptopenjdk/openjdk11

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs git vim
RUN npm install -g npm@latest

ADD https://api.github.com/repos/hossein-nas/webserial_test/commits /dev/null
RUN git clone https://github.com/hossein-nas/webserial_test.git
WORKDIR /webserial_test
RUN git checkout pwa
RUN npm install
RUN ./node_modules/.bin/quasar build
RUN ./node_modules/.bin/quasar build -m pwa
EXPOSE 8000
EXPOSE 8001
RUN apt-get install -y nginx
RUN cd /etc/nginx
ADD default.conf /etc/nginx/conf.d/
RUN mkdir /usr/share/nginx/html/spa -p 
RUN mkdir /usr/share/nginx/html/pwa -p 
RUN rm -rf /usr/share/nginx/html/* && cp -r /webserial_test/dist/spa/* /usr/share/nginx/html/spa/ && cp -r /webserial_test/dist/pwa/* /usr/share/nginx/html/pwa/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
CMD service nginx start 
