var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var concat 	= require('gulp-concat');
var rev = require('gulp-rev');
var del = require('del');
var runSequence = require('run-sequence');
var envify = require('loose-envify');
var https = require('https');
var querystring = require('querystring');
var yaml = require('js-yaml');
var fs = require('fs');
var async = require('async');

var smartlingCredentials = {
	userIdentifier:"bpmknlysfearpoukuoydwwhduxoidv",
	userSecret:"7vmbf0a699o0jlrpsbiaq3cbq8He-uv57mks52dpsl3lirnasso7usp"
};

var smartlingProjectId = 'b13fafcf3';

var IS_PROD = process.env.NODE_ENV === 'production';

gulp.task('javascript:prod', function() {
	return browserify("app/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/javascripts/"))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});


gulp.task('javascript:prod:event', function() {
	return browserify("app/standalone/SingleEvent/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('SingleEvent.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/javascripts/"))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:passwordChange', function() {
	return browserify("app/standalone/PasswordChange/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('PasswordChange.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/javascripts/"))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:dev', function() {
	return browserify("app/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest("./public/javascripts/"));
});

gulp.task('javascript:dev:event', function() {
	return browserify("app/standalone/SingleEvent/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.bundle()
		.pipe(source('SingleEvent.js'))
		.pipe(buffer())
		.pipe(gulp.dest("./public/javascripts/"));
});

gulp.task('javascript:dev:passwordChange', function() {
	return browserify("app/standalone/PasswordChange/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
		.bundle()
		.pipe(source('PasswordChange.js'))
		.pipe(buffer())
		.pipe(gulp.dest("./public/javascripts/"));
});

gulp.task('javascript:clean', function() {
	return del([ 'public/javascripts/*.js' ]);
});

gulp.task('css:clean', function() {
	return del([ 'public/stylesheets/*.css' ]);
});

gulp.task('images:clean', function() {
	return del([ 'public/images/**/*' ]);
});

gulp.task('javascript', function(callback) {
	if (IS_PROD) {
		runSequence('javascript:clean', 'javascript:prod', 'javascript:prod:event', 'javascript:prod:passwordChange', callback);
	} else {
		runSequence('javascript:clean', ['javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange'], callback);
	}
});

gulp.task('css:prod', function() {
	return gulp.src(['./app/less/style.less'])
		.pipe(concat('style.css'))
    .pipe(less())
		.pipe(cssnano())
		.pipe(rev())
  	.pipe(gulp.dest('./public/stylesheets'))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('css:dev', function() {
	return gulp.src(['./app/less/style.less'])
		.pipe(concat('style.css'))
    .pipe(less())
		.pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('css', function(callback) {
	if (IS_PROD) {
		runSequence('css:clean', 'css:prod', callback);
	} else {
		runSequence('css:clean', 'css:dev', callback);
	}
});

gulp.task('images', function(callback) {
	if (IS_PROD) {
		runSequence('images:clean', 'images:prod', callback);
	} else {
		runSequence('images:clean', 'images:dev', callback);
	}
});

gulp.task('images:prod', function() {
	return gulp.src(['./images/**/*'])
		.pipe(rev())
		.pipe(gulp.dest('./public/images'))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('images:dev', function() {
	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./public/images'));
});

gulp.task('build', ['images', 'css', 'javascript']);

gulp.task('build:production', function(callback) {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], 'images:prod', 'css:prod', 'javascript:prod', 'javascript:prod:event', 'javascript:prod:passwordChange', callback);
});

gulp.task('build:staging', function(callback) {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], ['images:dev', 'css:dev', 'javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange'], callback);
});

gulp.task('build:review', function(callback) {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], ['images:prod', 'css:dev', 'javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange'], callback);
});

gulp.task('watch', ['images', 'css', 'javascript'], function() {
	livereload.listen();
	gulp.watch( ["./images/**/*.js"], ['images'] );
	gulp.watch( ["./app/**/*.js"], ['javascript'] );
	gulp.watch( ["./app/**/*.less"], ['css'] );
});

gulp.task('smartling', function(callback) {
	return smartlingAuth().then(function(response) {
		var token = response.response.data.accessToken;
		return smartlingFetchAvailableLocales(token).then(function(response) {
			console.log("RP", response);
			var locales = response.response.data.items;

			var queue = async.queue(function(task, callback) {
					smartlingFetchLocaleFile(task.locale, token).then(function(data) {
						callback(task, data, null);
					}, function(error) {
						callback(null, null, error);
					})
			}, 10);

			var tasks = locales.map(function(item) {
				return { locale: item.localeId }
			});

			console.log('tasks', tasks);

			queue.push(tasks, function(task, data, err) {
				var locale2L = task.locale.split('-')[0];
				console.log('s2', task, locale2L);
				fs.writeFileSync('./locales/' + task.locale + '.json', JSON.stringify(data[locale2L].EventsAdmin, null, '\t'));
			});

			//queue.drain = callback;

		}, function(error) {
			console.log('e2');
			console.log(error);
		});
	}, function(error) {
		console.log('e1');
		console.log(error);
	});
});

function smartlingAuth() {
	return new Promise(function(resolve, reject) {
		var options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: '/auth-api/v2/authenticate',
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			}
		}

		var req = https.request(options)

		req.on("response", function(response) {
			var body = "";

			response.on('data', function(chunk) {
				body += chunk;
			});

			response.on("end", function() {
				try {
					resolve(JSON.parse(body));
				} catch(ex) {
					reject(ex);
				}
			});
		});

		req.on('error', function(e) {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}

function smartlingFetchAvailableLocales(token) {
	return new Promise(function(resolve, reject) {
		var query = querystring.stringify({
			fileUri: '/files/en.yml'
		})

		var options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: '/files-api/v2/projects/' + smartlingProjectId + '/file/status?' + query,
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				"Content-Type": "application/json"
			}
		}

		//console.log("OP", options);

		var req = https.request(options)

		req.on("response", function(response) {
			var body = "";

			response.on('data', function(chunk) {
				body += chunk;
			});

			response.on("end", function() {
				try {
					resolve(JSON.parse(body));
				} catch(ex) {
					reject(ex);
				}
			});
		});

		req.on('error', function(e) {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}

function smartlingFetchLocaleFile(locale, token) {
	console.log('sflf', locale);
	return new Promise(function(resolve, reject) {
		var query = querystring.stringify({
			fileUri: '/files/en.yml'
		})

		var options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: '/files-api/v2/projects/' + smartlingProjectId + '/locales/' + locale + '/file?' + query,
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				"Content-Type": "application/json"
			}
		}

		//console.log("OP", options);

		var req = https.request(options)

		req.on("response", function(response) {
			var body = "";

			response.on('data', function(chunk) {
				body += chunk;
			});

			response.on("end", function() {
				try {
					//console.log("BD", body);
					resolve(yaml.safeLoad(body, {json:true}));
				} catch(ex) {
					reject(ex);
				}
			});
		});

		req.on('error', function(e) {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}


