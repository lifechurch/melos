const api = require('./api').api;

function ApiCall() {
	this.config = {
		auth: false,
		params: {},
		extension: 'json',
		verb: 'GET',
		secure: false,
		version: '3.1',
		environment: 'production',
		contentType: null,
	};
}

ApiCall.prototype.params = function clientParams(params) {
	this.config.params = params;
	return this;
};

ApiCall.prototype.secure = function clientSecure() {
	this.config.secure = true;
	return this;
};

ApiCall.prototype.setVersion = function clientSetVersion(version) {
	this.config.version = version;
	return this;
};

ApiCall.prototype.setExtension = function clientSetExtension(extension) {
	this.config.extension = extension;
	return this;
};

ApiCall.prototype.setEnvironment = function clientSetEnvironment(environment) {
	this.config.environment = environment;
	return this;
};

ApiCall.prototype.setContentType = function clientSetContentType(contentType) {
	this.config.contentType = contentType;
	return this;
};

ApiCall.prototype.auth = function clientAuth(username, password) {
	if (typeof username === 'undefined') {
		this.config.auth = true
	} else if (typeof password === 'undefined') {
		this.config.auth = {
			tp_token: username
		};
	} else {
		this.config.auth = {
			username,
			password
		};
	}
	return this;
};

ApiCall.prototype.get = function clientGet() {
	this.config.verb = 'GET';
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

ApiCall.prototype.post = function clientPost() {
	this.config.verb = 'POST';
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

Client.prototype.call = function clientCall(noun) {
	const call = new ApiCall();
	call.client = this;
	call.noun = noun;
	return call;
};

function getClient(section) {
	const client = new Client();
	client.section = section;
	return client;
}

module.exports = {
	getClient
};
