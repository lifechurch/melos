var api = require('./lib/client');
var Bible = api.getClient('bible');

Bible.call("version")
	.params({id: 1380})
	.get()
	.then(function(data) {
		console.log(data);
	}, function(err) {
		console.log(err);
	});

Bible.call("chapter")
	.params({id: 1, reference: 'MAT.1'}).get()
	.then(function(data) {
		console.log(data);
	}, function(err) {
		console.log(err);
	});

Bible.call("verse")
	.params({id: 1, reference: 'JHN.3.16'})
	.get()
	.then(function(data) {
		console.log(data);
	}, function(err) {
		console.log(err);
	});
