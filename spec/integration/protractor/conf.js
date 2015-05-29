exports.config = {
//	sauceUser: 'michael_martin',
//	sauceKey: '46521038-bc8d-4948-8dd9-c2bbd536a7e8',

  	// seleniumAddress: 'http://localhost:4444/wd/hub',

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

//    capabilities: {
//        'browserName': 'chrome',
//        'platform': 'Windows 7',
//        'screen-resolution': '1024x768'
//    },

    rootElement: 'div#widget-notes',

    onPrepare: function() {

     browser.driver.manage().window().setSize(1280, 1024);

     // Default to ignoring Angular sync,
     //  assuming most tests will not
     //  need Angular
     browser.ignoreSynchronization = true;
        
     global.isAngular = function(flag) {
         browser.ignoreSynchronization = !flag;
     };
    }

}