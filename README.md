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