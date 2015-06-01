exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: [
		//'login.spec.js',
		//'plans.spec.js',
		//'reader.spec.js',
		'search.spec.js'
		//'signup.spec.js'
	],

	params: {
		testUrl: ""
	},

    //capabilities: JSON.parse(process.env.bamboo_SAUCE_ONDEMAND_BROWSERS),

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

};