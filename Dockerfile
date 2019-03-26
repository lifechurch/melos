FROM in.thewardro.be:4567/docker/passenger-full:2018.04.20

ARG DOWNLOAD_TOKEN
ENV DOWNLOAD_TOKEN: $DOWNLOAD_TOKEN

# Prefer IPv4 over IPv6
RUN echo 'precedence ::ffff:0:0/96  100' >> /etc/gai.conf
RUN bash -lc 'rvm --default use ruby-2.2.5'

RUN mkdir -p /home/app/ruby
# RUN mkdir -p /home/app/nodejs

COPY ruby/Gemfile ruby/Gemfile.lock /home/app/ruby/
RUN cd /home/app/ruby && bundle install --without development test

COPY ruby/ /home/app/ruby/
RUN cd /home/app/ruby && bundle exec rake assets:precompile

# Node-Canvas (https://github.com/Automattic/node-canvas#installation) and pre-req
# Passenger Enterprise
COPY nginx/passenger-enterprise-license /etc/passenger-enterprise-license
RUN echo deb https://download:$DOWNLOAD_TOKEN@www.phusionpassenger.com/enterprise_apt xenial main > /etc/apt/sources.list.d/passenger.list
RUN apt-get update && apt-get install -y -o Dpkg::Options::="--force-confold" \
  passenger-enterprise nginx-extras

# NGINX Config
RUN rm -f /etc/service/nginx/down && rm -f /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/ruby.conf /etc/nginx/sites-enabled/ruby.conf
COPY nginx/env.conf /etc/nginx/main.d/env.conf
COPY nginx/passenger.conf /etc/nginx/conf.d/passenger.conf

RUN chown -R app:app /home/app/
