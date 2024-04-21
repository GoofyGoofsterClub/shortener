FROM node:19

WORKDIR /usr/src/boobspics

COPY package*.json .

RUN npm install --save-dev

COPY . .

EXPOSE 3442

RUN npx tsc && npx tsc-alias

CMD [ "node", "./dist/index.js" ]
