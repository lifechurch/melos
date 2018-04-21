#!/usr/bin/env node
const stackimpact = require('stackimpact')
const heapdump = require('heapdump')
const server = require('./server.compiled')

const agent = stackimpact.start({
	agentKey: process.env.STACK_IMPACT_AGENT_KEY,
	appName: process.env.NEW_RELIC_APP_NAME
});

server()
