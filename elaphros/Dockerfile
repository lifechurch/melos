FROM in.thewardro.be:4567/docker/nodejs:8.11.3

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --production

COPY . /app

EXPOSE 80

CMD ["/sbin/my_init", "--", "node", "./server.js"]