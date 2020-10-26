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
 
    npm run pm2
    
## .env

    EXPRESS_PUBLIC_API_URL = http://localhost
    EXPRESS_PUBLIC_API_PORT = 8080
    API_URL_NEXT = http://localhost:3000
    API_USER = ***
    API_SALT = ***
    API_HASH = ***
    
## CORS

On top of the added lib for cors you need to send:

    res.header({"Access-Control-Allow-Origin": corsOptions.origin})