// Heroku Deploy Script for Bamboo

var Heroku = require('heroku-client'),
	fs = require('fs'),
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY }),
	HerokuApp = null;

if (herokuAppName() !== 'master') { 
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
} else {
	reportError(0, "Don't mess with Master branch. Ignoring.");
}

function herokuAppName() {
	if (process.env.BRANCH) {
		if (process.env.BRANCH.toLowerCase() == "integration") {
			return "yv-staging";
		} else { 
        return "dev-" + process.env.BRANCH.toLowerCase().replace(/\//g, "-");
		}

	} else {
		reportError(9, "BRANCH Environment Variable wasn't set.");
	}
}

function hipchatToken() {
	return process.env.HIPCHAT_TOKEN || null;	
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
			heroku.apps(herokuAppName()).addons().create({ plan: 'deployhooks:hipchat', config: { auth_token: hipchatToken(), room: "YouVersion Web", message: "{{app}} deployed by {{user}}. <a href='{{url}}'>Go There!</a> (<a href='https://github.com/lifechurch/youversion-web/commits/{{head}}'>View on GitHub: {{head}}</a>)"  }}, function(err, addon) {
				console.log(err, addon);
				displayApp();
			});
		});		
	});
}

function displayApp() {
	fs.writeFile("heroku_urls.txt", "git_url=" + HerokuApp.git_url.replace('git@heroku.com:', 'https://:' + process.env.HEROKU_API_KEY + '@git.heroku.com/') + "\nweb_url=" + HerokuApp.web_url.replace('://', '://youversion:yv123@'), function(err) {
		if (err) {
			reportError(1, "Failed to write Git/Web URLs to File", err);
		}
		console.log("APP:", HerokuApp);
		process.exit();			
	});
}

function reportError(exitCode, msg, err) {
	console.log("FATAL ERROR:", msg, err);
	process.exit(exitCode);
}
