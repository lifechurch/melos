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
	]
	// , multiCapabilities: [
	// 	{}
	// 	{
	// 		'browserName': 'iphone',
	// 		'platform': 'OS X 10.10',
	// 		'version': '8.0',
	// 		'deviceName': 'iPhone Simulator',
	// 		'device-orientation': 'portrait'
	// 	}
		// {
		// 	'browserName': 'safari',
		// 	'platform': 'OS X 10.9',
		// 	'version': '7.0'
		// },
		// {
		//   'browserName': 'firefox'
		// }, {
		//   'browserName': 'chrome'
		// }
	// ]
}