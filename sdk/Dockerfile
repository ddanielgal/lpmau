FROM node:16-slim
WORKDIR /usr/src/lpmau-client

ADD package.json package-lock.json ./
RUN npm install

ADD src src
ADD tsconfig.json ./
RUN npm run build

RUN npx -y yalc publish --private
