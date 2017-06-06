FROM in.thewardro.be:4567/docker/passenger-full:2017.05.18

ARG NPM_TOKEN
ENV NPM_TOKEN: $NPM_TOKEN

ARG DOWNLOAD_TOKEN
ENV DOWNLOAD_TOKEN: $DOWNLOAD_TOKEN

RUN bash -lc 'rvm --default use ruby-2.2.5'

RUN mkdir -p /home/app/ruby
RUN mkdir -p /home/app/nodejs

COPY ruby/Gemfile ruby/Gemfile.lock /home/app/ruby/
RUN cd /home/app/ruby && bundle install --without development test

COPY nodejs/package.json nodejs/.npmrc /home/app/nodejs/
RUN cd /home/app/nodejs && npm install

COPY ruby/ /home/app/ruby/
RUN cd /home/app/ruby && bundle exec rake assets:precompile

ENV NODE_ENV production
COPY nodejs/ /home/app/nodejs/
RUN cd /home/app/nodejs && npm install -g gulp
RUN cd /home/app/nodejs && gulp build:production

# Passenger Enterprise
COPY nginx/passenger-enterprise-license /etc/passenger-enterprise-license
RUN echo deb https://download:$DOWNLOAD_TOKEN@www.phusionpassenger.com/enterprise_apt xenial main > /etc/apt/sources.list.d/passenger.list
RUN apt-get update && apt-get install -y -o Dpkg::Options::="--force-confold" passenger-enterprise nginx-extras

# NGINX Config
RUN rm -f /etc/service/nginx/down
COPY nginx/ruby.conf /etc/nginx/sites-enabled/ruby.conf
COPY nginx/nodejs.conf /etc/nginx/sites-enabled/nodejs.conf
COPY nginx/env.conf /etc/nginx/main.d/env.conf
COPY nginx/passenger.conf /etc/nginx/conf.d/passenger.conf

RUN chown -R app:app /home/app/
