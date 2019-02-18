#!/usr/bin/env node
require('newrelic')
const server = require('./server.compiled')

server()
