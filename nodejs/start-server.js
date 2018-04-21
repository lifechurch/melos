#!/usr/bin/env node
const stackimpact = require('stackimpact')
const heapdump = require('heapdump')
const server = require('./server.compiled')

const agent = stackimpact.start({
	agentKey: '1f784b84d9c81db6dd320f8fcc144ca01f271bf5',
	appName: 'bible-nodejs',
});

server()
