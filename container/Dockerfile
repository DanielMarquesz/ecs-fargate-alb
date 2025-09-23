FROM --platform=linux/amd64 node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY ./build ./build

EXPOSE 80

CMD ["node", "build/index.js"]