# Course-Hub
---

A link to a deployed version of the web site
https://www.techiocean.tech/

how to run alocal version of the application on your own servers


lets start with backend


first you will download the repo or clone it with this command :
git clone https://github.com/AbdullahKhames/Course-Hub.git


second configure the database server: a mysql database
    we have a setup_mysql_dev and setup_mysql_test sql scripts and also a dump.sql to create the database
    application connects to the database based on an environment variable


third configure the backend server: a flask application
    first create a virtual environment call it any thing i like to call it .env with:
        #python3 -m venv .env


    then activate the virtual environment with:
        source .env/bin/activate


    then install the project dependencies with:
        #pip install -r requirements.txt


    then you will need to have a folder called instance in the same directory within it a config.py file
        with values like those please choose a good secret key
        ```
        from datetime import timedelta




        SECRET_KEY = 'super_secret_key'
        SESSION_COOKIE_SECURE = True
        SESSION_COOKIE_HTTPONLY = True
        SESSION_COOKIE_SAMESITE = 'Lax'
        REMEMBER_COOKIE_DURATION = timedelta(days=7)
        SESSION_PROTECTION = 'strong'
        LOGIN_VIEW = None
        LOGIN_MESSAGE_CATEGORY = 'info'
        LOGIN_MESSAGE = 'Please log in to access this resource.'
        JWT_SECRET_KEY = 'super_secret_key'
        JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
        JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
        ```
    then configure some environment variables
        run
        source bash_scripts/db_dev.sh if testing use db_test.sh
        this will do some environment variables for you on linux else go put it on other OS in environment variable
   
    last you will need to configure this environment variable
        APP_CONFIG_FILE to the file in the config folder if not set it goes to production.py file
        seting it in windows
            $env:APP_CONFIG_FILE = "$(Get-Location)\config\development.py"
        in linux:
            cwd=$(pwd)
            export APP_CONFIG_FILE="${cwd}/config/development.py"
   
    if you want to run on a production server use gunicorn with simmilar gunicorn config file
        ```
        import os




        workers = int(os.environ.get('GUNICORN_PROCESSES', '2'))
        threads = int(os.environ.get('GUNICORN_THREADS', '4'))        
        bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:5000')
        forwarded_allow_ips = '*'
        secure_scheme_headers = {'X-Forwarded-Proto': 'https'}
        # Log file settings
        loglevel = 'info'
        accesslog = 'access.log'
        errorlog = 'error.log'
        ```
    then use gunicorn --config gunicorn_config.py app:app


    extra if you want to secure this with an ssl certificate you can create certificate with certbot + nginx
    nginx server block be like this
    first configure the nginx to the domain name my domain name for backend service is api.techiocean.tech;


    ```
    cat /etc/nginx/sites-available/backend
    server {
        listen 80;
        server_name api.techiocean.tech;
        location / {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```






    then
    sudo certbot --nginx -d 'your_domain_name' my domain name for backend service is api.techiocean.tech;


    then it will be like this
    ```
    cat /etc/nginx/sites-available/backend
    server {
        server_name api.techiocean.tech;




        location / {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }


        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/api.techiocean.tech/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/api.techiocean.tech/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


    }


    server {
        if ($host = api.techiocean.tech) {
            return 301 https://$host$request_uri;
        } # managed by Certbot




        listen 80;
        server_name api.techiocean.tech;
        return 404; # managed by Certbot




    }
    ```
    fourth configure the frontend server: a react application
        first you will need to have npm installed on your machine
        then cd into frontend dir then use
        npm install
        then depending on wither you will be running locally or on a server you will have to change the default base url in two files
            frontend\src\components\config.js
            frontend\src\components\Api.jsx
            for local backend server
            baseURL: 'http://localhost:5000',
            else
                baseURL: 'https://api.techiocean.tech',
       
        then on local development machine
            npm run start
       
        then on a server
            npm run build
        take that build to a directory on the server like /home/vagrant/courses-app/build


        then configure nginx like this to accept http requests
        ```
        server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /home/ubuntu/courses-app/build;
        index index.html;
        server_name course.techiocean.tech www.techiocean.tech techiocean.tech web-02.techiocean.tech;
        location / {
            try_files $uri $uri/ /index.html;
        }
        location /static {
            alias /home/ubuntu/courses-app/build/static;
        }
        location /users {
            alias /home/ubuntu/courses-app/build/users;
        }
        error_page 404 /404.html;
        location = /404.html {
            internal;
        }
        location /api {
            include proxy_params;
            proxy_pass https://api.techiocean.tech;
        }
        location /auth {
        include proxy_params;
            proxy_pass https://api.techiocean.tech;
        }
    }
    ```


    if you want https requests
    then
        sudo certbot --nginx
        then accept the certificate for all the domain names
    then it will look like this
    ```
    server {


        root /home/ubuntu/courses-app/build;
        index index.html;


        server_name course.techiocean.tech web-02.techiocean.tech www.techiocean.tech techiocean.tech;
        location / {
            try_files $uri $uri/ /index.html;
        }


        location /static {
            alias /home/ubuntu/courses-app/build/static;
        }
        location /users {
            alias /home/ubuntu/courses-app/build/users;
        }


        error_page 404 /404.html;


        location = /404.html {
            internal;
        }


        location /api {
            include proxy_params;
            proxy_pass https://api.techiocean.tech;
        }


        location /auth {
            include proxy_params;
            proxy_pass https://api.techiocean.tech;
        }


        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/course.techiocean.tech/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/course.techiocean.tech/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot








    }


    server {
        if ($host = course.techiocean.tech) {
            return 301 https://$host$request_uri;
        } # managed by Certbot


        if ($host = web-02.techiocean.tech) {
            return 301 https://$host$request_uri;
        } # managed by Certbot


        listen 80 default_server;
        listen [::]:80 default_server;


        server_name course.techiocean.tech web-02.techiocean.tech;
        return 404; # managed by Certbot
    }
    ```


    then restart the server
    i have this file to ease the process of restarting the server
     cat restart_nginx.sh
    #!/usr/bin/env bash
    sudo unlink /etc/nginx/sites-enabled/default
    sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled


    sudo unlink /etc/nginx/sites-enabled/backend
    sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled
    sudo service nginx restart
   
    $./restart_nginx.sh


a file that explain the deployment process in details
https://docs.google.com/document/d/1oo-N-8MD9FDzWHOHQ0TZO7IIWqTmDp0-0YWhC9BJLAM/edit

## Authors :black_nib:

* __Yousef Bakier__ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br />
 &nbsp;&nbsp;[<img height="" src="https://img.shields.io/static/v1?label=&message=GitHub&color=181717&logo=GitHub&logoColor=f2f2f2&labelColor=2F333A" alt="Github">](https://github.com/Y-Baker)

* __Abdullah Khames__ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br />
 &nbsp;&nbsp;[<img height="" src="https://img.shields.io/static/v1?label=&message=GitHub&color=181717&logo=GitHub&logoColor=f2f2f2&labelColor=2F333A" alt="Github">](https://github.com/AbdullahKhames)
