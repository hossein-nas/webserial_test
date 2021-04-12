## Steps to run ```docker-compose```
1. As docker-compose.yml indicates we have 2 endpoints ```localhost:8000``` and ```localhost:4043```. For first step you should proxy your desired domain into these endpoints. **Both should be HTTPS**

Sample Nginx config for proxying Subdomains or Domains to accornding endpoints:
```nginx
server {
        listen 443 ssl;
        server_name sub1.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/sub1.yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/sub1.yourdomain.com/privkey.pem;
        
        location / {
                proxy_set_header Host $host;
                proxy_pass http://localhost:8000;
                proxy_redirect off;
        }
}

server{
        listen 443 ssl;
        server_name bisar_core.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/bisar_core.yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/bisar_core.yourdomain.com/privkey.pem;
        ssl_dhparam /etc/ssl/certs/dhparam.pem;

        location / {
                proxy_set_header Host $host;
                proxy_pass https://localhost:4043;
                proxy_redirect off;
        }
}
```
2. After setting nginx config you can test the syntax errors by ```nginx -t``` command.
3. For the third step you should set accornding Subdomain or Domain on ```quasar.conf.js``` on line ```47```.

```javascript
        API : ctx.dev ? 'http://localhost:8081' : 'https://bisar_core.yourdomain.com'
```
4. After these steps you are ready to build docker containers by this command
```bash
cd docker/
sudo docker-compose build
```
5. After successful building process you can run docker containers by command below:
```bash
sudo docker-compose up -d
```

6. You can see results in previously set subdomain ```sub1.yourdomain.com```.

7. For setting up letsencrypt certificate you can use these commands:
```bash
sudo apt install -y certbot
certbot certonly -d sub1.yourdomain.com --expand
certbot certonly -d bisar_core.yourdomain.com --expand
```