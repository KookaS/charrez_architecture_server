# charrez-architecture-server

## init

    npm init --yes
    
    npm i
    
    tsc --init
    
to change permission on bash file
    
    chmod u+r+x reset-port.sh
    
## kill port

If the port is already in use, kill it. Done with the bash file.
    
    kill $(lsof -t -i:8080)
    
 ## start
 
 nodemon script start
 
     npm run dev
     
 build and start
     
     npm run start
     
 build and start (pm2 restart)
 
    sudo mongod
 
    npm run pm2
    
## PM2

    pm2 start [main file path]
    
    pm2 ls
    
        pm2 describe 0
    
        pm2 monit
        
    pm2 logs
    
    pm2 stop all 
    
    pm2 restart all
    
    pm2 delete all
    
## .env

    EXPRESS_PUBLIC_API_URL="http://localhost"
    EXPRESS_PUBLIC_API_PORT="8080"
    API_URL_NEXT="https://architecture.charrez.ch"  or  http://localhost:3000   or  *
    API_MONGO_HOSTNAME="db"     or  localhost
    API_USER=***
    API_SALT=***
    API_HASH=***
    VOLUME_DB=***
    
## CORS

On top of the added lib for CORS you need to send:

    res.header({"Access-Control-Allow-Origin": corsOptions.origin})
    
## Docker

    sudo docker build -t express-image .
   
    sudo docker images
    
    sudo docker run -d --name charrez-server express-image

    sudo docker ps -a
    
    sudo docker logs [container id]
    
    sudo docker exec -it [container id] /bin/bash   or  bash
    
remove images:

    sudo docker rmi $(sudo docker images -aq)
    
stop container(s):

    sudo docker container stop [container_id]or[container_name]
    
    sudo docker container stop $(sudo docker container ls -aq)
    
remove stopped container(s):

    sudo docker container rm [container_id]or[container_name]
    
    sudo docker container rm $(sudo docker container ls -aq)
    
restart stopped container(s):

    sudo docker start [container_name]
    
## Docker compose

    sudo docker-compose down
    
    sudo docker-compose up -d
    
    sudo docker-compose logs
    
To access db bash directly

    sudo docker exec -it $(sudo docker ps -af "name=db" -q) bash
    
