FROM node:16 as builder
WORKDIR /usr/src/lpmau-api

ADD package.json package-lock.json ./
ADD prisma prisma
RUN npm install --legacy-peer-deps

ADD src src
ADD tsconfig.json tsconfig.build.json ./
RUN npm run build

FROM node:16
WORKDIR /usr/src/lpmau-api
ENV NODE_ENV=production
COPY --from=builder /usr/src/lpmau-api/dist ./dist
COPY --from=builder /usr/src/lpmau-api/package*.json ./
COPY --from=builder /usr/src/lpmau-api/node_modules ./node_modules
CMD ["npm", "run", "start:prod"]
