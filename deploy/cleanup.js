// Heroku Deploy Script for Bamboo

var Heroku = require('heroku-client'),
	fs = require('fs'),
	heroku = new Heroku({ token: process.env.HEROKU_API_KEY });

heroku.apps().list(function(err, apps) {
	//console.log(err, apps);
	apps.forEach(function(app, i) {
		//console.log(app.name, app.created_at, app.updated_at);

		var now = new Date();
		var lastDeploy = new Date(Date.parse(app.updated_at));
		console.log(app.name, daysOld(now, lastDeploy), "days old", "Is CI Build?", isCIBuild(app.name));

		if (daysOld(now, lastDeploy) > 10 && isCIBuild(app.name)) {
			console.log(app.name);
			deleteApp(app.name);
		}
	});
});

function daysOld(t1, t2) {
	return Math.floor( (t1.getTime() - t2.getTime()) / 1000 / 60 / 60 / 24)
}

function isCIBuild(n) {
	return n.indexOf('dev-') == 0;
}

function deleteApp(n) {
	//Hard code name check as safety measure
	if (n !== 'yv-prod' && n !== 'yv-staging' && n !== 'yv-dev' && n !== 'yv-node') { 
		heroku.apps(n).delete(function(err, app) {
			console.log(err, app);
		});
	}
}