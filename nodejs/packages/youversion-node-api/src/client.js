var api = require('./api').api;

module.exports = {
	getClient: getClient
};

function ApiCall() {
	this.config = {
		auth: false,
		params: {},
		extension: "json",
		verb: "GET",
		secure: false,
		version: "3.1",
		environment: "production",
		contentType: null,
	};
}

ApiCall.prototype.params = function(params) {
	this.config.params = params;
	return this;
};

ApiCall.prototype.secure = function() {
	this.config.secure = true;
	return this;
};

ApiCall.prototype.setVersion = function(version) {
	this.config.version = version;
	return this;
};

ApiCall.prototype.setExtension = function(extension) {
	this.config.extension = extension;
	return this;
};

ApiCall.prototype.setEnvironment = function(environment) {
	this.config.environment = environment;
	return this;
};

ApiCall.prototype.setContentType = function(contentType) {
	this.config.contentType = contentType;
	return this;
};

ApiCall.prototype.auth = function(username, password) {
	if (typeof username === 'undefined') {
		this.config.auth = true
	} else if (typeof password === 'undefined') {
		this.config.auth = {
			tp_token: username
		};
	} else {
		this.config.auth = {
			username: username,
			password: password
		};
	}
	return this;
};

ApiCall.prototype.get = function() {
	this.config.verb = "GET";
	return api(
		this.client.section,
		this.noun,
		this.config.params,
		this.config.auth,
		this.config.extension,
		this.config.verb,
		this.config.version,
		this.config.environment
	);
};

ApiCall.prototype.post = function() {
	this.config.verb = "POST";
	return api(
		this.client.section,
		this.noun,
		this.config.params,
		this.config.auth,
		this.config.extension,
		this.config.verb,
		this.config.version,
		this.config.environment,
		this.config.contentType
	);
};

function Client() {}

Client.prototype.call = function(noun) {
	var call = new ApiCall;
	call.client = this;
	call.noun = noun;
	return call;
};

function getClient(section) {
	var client = new Client;
	client.section = section;
	return client;
}
