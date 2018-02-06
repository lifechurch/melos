const getClient = require('./client').getClient;
const expressRouter = require('./express');
const tokenAuth = require('./tokenAuth').default;

module.exports = {
	getClient,
	expressRouter,
	tokenAuth
};
