/**
 * Heroku Deploy Script for Bamboo
 *
 *
 */

var Heroku = require('heroku-client'),
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY }),
	HerokuApp = null;

// heroku.addonServices("heroku-postgresql").info(function(err, addons) {
// 	console.log(err, addons);
// });

heroku.apps(herokuAppName()).info(function(err, app) {
	// App Doesn't Exist on Heroku
	if (err && err.statusCode == 404) {
		console.log("App Doesn't Exist. Creating...");
		createApp();
	} else if (err) {
		reportError(1, "Some sort of error occurred while deploying app.", err);

	} else {
		HerokuApp = app;
		console.log("App already exists.");
		displayApp();
	}
});

function herokuAppName() {
	if (process.env.BRANCH) { 
		return "dev-" + process.env.BRANCH.toLowerCase();
	} else {
		reportError(9, "BRANCH Environment Variable wasn't set.");
	}
}

function createApp() {
	var attr = {
		name: herokuAppName(),
		region: "us",
		stack: "cedar-14"
	};

	heroku.apps().create(attr, function(err, app) {
		if (err) {
			reportError(1, "There was an error creating your app.", err);
		} else {
			HerokuApp = app;			
			console.log("App created successfully.");
			addOns();
		}
	});
}

function addOns() {
	// Very inefficient code. Should use map() or for() and then wait for all callbacks
	heroku.apps(herokuAppName()).addons().create({ plan: 'heroku-postgresql' }, function(err, addon) {
		console.log(err, addon);
		heroku.apps(herokuAppName()).addons().create({ plan: 'memcachier' }, function(err, addon) {
			console.log(err, addon);
			displayApp();		
		});		
	});
}

function displayApp() {
	console.log("APP:", HerokuApp);
	process.exit();
}

function reportError(exitCode, msg, err) {
	console.log("FATAL ERROR:", msg, err);
	process.exit(exitCode);
}