/**
 * Heroku Deploy Script for Bamboo
 *
 *
 */

var appName = "billy-bob";

var Heroku = require('heroku-client'),
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY }),
	HerokuApp = null;

heroku.apps(appName).info(function(err, app) {
	// App Doesn't Exist on Heroku
	if (err && err.statusCode == 404) {
		console.log("App Doesn't Exist. Creating...");
		createApp();
	} else if (err) {
		console.log("Some sort of error occurred while deploying app.");
	} else {
		HerokuApp = app;
		console.log("App already exists.")
		displayApp();
	}
});

function herokuAppName() {
	return process.env.BRANCH;
}

function createApp() {
	var attr = {
		name: appName
	};

	heroku.apps().create(attr, function(err, app) {
		console.log("CREATE:", err, app);
		if (err) {
			console.log("There was an error creating your app.");
		} else {
			HerokuApp = app;			
			console.log("App created successfully.");
			displayApp();
		}
	});
}

function displayApp() {
	console.log("APP:", HerokuApp);
}