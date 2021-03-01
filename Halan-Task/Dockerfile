FROM node:alpine  

ENV PORT=7000

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json   .

RUN npm install 

COPY  . .

CMD npm start 
