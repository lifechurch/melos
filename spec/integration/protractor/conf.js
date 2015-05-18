// caps = {browserName: 'internet explorer'};
// caps['platform'] = 'Windows XP';
// caps['version'] = '8.0';

exports.config = {
	// sauceUser: 'michael_martin',
	// sauceKey: '46521038-bc8d-4948-8dd9-c2bbd536a7e8',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		'login.spec.js',
		'plans.spec.js',
		'reader.spec.js',
		'search.spec.js',
		'signup.spec.js'
	],
	params: {
		testUrl: ""
	},
    rootElement: 'div#widget-notes',
    onPrepare: function() {
     global.isAngular = function(flag) {
         browser.ignoreSynchronization = !flag;
     };
    }
}