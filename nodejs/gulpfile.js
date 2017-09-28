const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const concat 	= require('gulp-concat');
const rev = require('gulp-rev');
const del = require('del');
const runSequence = require('run-sequence');
// const envify = require('loose-envify');
const https = require('https');
const querystring = require('querystring');
const yaml = require('js-yaml');
const fs = require('fs');
const async = require('async');
const langmap = require('langmap');
const langs = require('langs');

require('babel-register')({ presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties', 'syntax-dynamic-import' ] });

const getApiStrings = require('./localization').items
const poToJson = require('./localization').poToJson
// var sourcemaps = require("gulp-sourcemaps");
// var gutil = require("gulp-util");

// Just set this to something because @youversion/js-api expects a value and will crash without it
process.env.YOUVERSION_TOKEN_PHRASE = 'just-a-test';

const GetClient = require('@youversion/js-api').getClient;

const smartlingCredentials = {
	userIdentifier: 'bpmknlysfearpoukuoydwwhduxoidv',
	userSecret: '7vmbf0a699o0jlrpsbiaq3cbq8He-uv57mks52dpsl3lirnasso7usp'
};

const smartlingProjectId = 'b13fafcf3';

const IS_PROD = process.env.NODE_ENV === 'production';

gulp.task('javascript:prod', () => {
	return browserify('app/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});


gulp.task('javascript:prod:event', () => {
	return browserify('app/standalone/SingleEvent/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('SingleEvent.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:passwordChange', () => {
	return browserify('app/standalone/PasswordChange/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('PasswordChange.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:planDiscovery', () => {
	return browserify('app/standalone/PlanDiscovery/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('PlanDiscovery.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:unsubscribe', () => {
	return browserify('app/standalone/Unsubscribe/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ [ 'env', { debug: false } ], 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('Unsubscribe.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

// Leaving here for a how-to on doing sourceMaps to inspect package size
// gulp.task('javascript:prod:Bible', function() {
// 	return browserify({ entries: "app/standalone/Bible/main.js", debug: false })
// 		.transform("babelify", { presets: [ "es2015", "stage-0", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind", "transform-object-assign" ] })
// 		.transform('loose-envify', { NODE_ENV: 'staging' })
// 		.bundle()
// 		.pipe(source('Bible.js'))
// 		.pipe(buffer())
// 		.pipe(sourcemaps.init({ loadMaps:true }))
// 		.pipe(uglify())
// 		.on('error', gutil.log)
// 		//.pipe(rev())
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest("./public/javascripts/"))
// 		//.pipe(rev.manifest({merge:true, base: 'build/assets'}))
// 		//.pipe(gulp.dest('build/assets'));
// });

gulp.task('javascript:prod:Bible', () => {
	return browserify('app/standalone/Bible/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('Bible.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:subscribeUser', () => {
	return browserify('app/standalone/SubscribeUser/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('SubscribeUser.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:prod:passage', () => {
	return browserify('app/standalone/Passage/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'es2015', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.transform('loose-envify', { NODE_ENV: 'production' })
		.bundle()
		.pipe(source('Passage.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./public/javascripts/'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:dev', () => {
	return browserify('app/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:event', () => {
	return browserify('app/standalone/SingleEvent/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('SingleEvent.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:passwordChange', () => {
	return browserify('app/standalone/PasswordChange/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('PasswordChange.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:planDiscovery', () => {
	return browserify('app/standalone/PlanDiscovery/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('PlanDiscovery.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:unsubscribe', () => {
	return browserify('app/standalone/Unsubscribe/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ [ 'env', { debug: false } ], 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('Unsubscribe.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:Bible', () => {
	return browserify('app/standalone/Bible/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('Bible.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:subscribeUser', () => {
	return browserify('app/standalone/SubscribeUser/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('SubscribeUser.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:dev:passage', () => {
	return browserify('app/standalone/Passage/main.js', { debug: !IS_PROD })
		.transform('babelify', { presets: [ 'es2015', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties' ] })
		.bundle()
		.pipe(source('Passage.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('javascript:clean', () => {
	return del([ 'public/javascripts/*.js' ]);
});

gulp.task('css:clean', () => {
	return del([ 'public/stylesheets/*.css' ]);
});

gulp.task('images:clean', () => {
	return del([ 'public/images/**/*' ]);
});

gulp.task('javascript', (callback) => {
	if (IS_PROD) {
		runSequence('javascript:clean', 'javascript:prod', 'javascript:prod:event', 'javascript:prod:passwordChange', 'javascript:prod:planDiscovery', 'javascript:prod:unsubscribe', 'javascript:prod:Bible', 'javascript:prod:subscribeUser', 'javascript:prod:passage', callback);
	} else {
		runSequence('javascript:clean', [ /* 'javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange', 'javascript:dev:planDiscovery', */ 'javascript:dev:unsubscribe' /* , 'javascript:dev:Bible', 'javascript:dev:subscribeUser', 'javascript:dev:passage' */], callback);
	}
});

gulp.task('css:prod', () => {
	return gulp.src(['./app/less/style.less'])
		.pipe(concat('style.css'))
    .pipe(less())
		.pipe(cssnano())
		.pipe(rev())
		.pipe(gulp.dest('./public/stylesheets'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('css:dev', () => {
	return gulp.src(['./app/less/style.less'])
		.pipe(concat('style.css'))
    .pipe(less())
		.pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('css', (callback) => {
	if (IS_PROD) {
		runSequence('css:clean', 'css:prod', callback);
	} else {
		runSequence('css:clean', 'css:dev', callback);
	}
});

gulp.task('images', (callback) => {
	if (IS_PROD) {
		runSequence('images:clean', 'images:prod', callback);
	} else {
		runSequence('images:clean', 'images:dev', callback);
	}
});

gulp.task('images:prod', () => {
	return gulp.src(['./images/**/*'])
		.pipe(rev())
		.pipe(gulp.dest('./public/images'))
		.pipe(rev.manifest({ merge: true, base: 'build/assets' }))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('images:dev', () => {
	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./public/images'));
});

gulp.task('build', ['images', 'css', 'javascript']);

gulp.task('build:production', (callback) => {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], 'images:prod', 'css:prod', 'javascript:prod', 'javascript:prod:event', 'javascript:prod:passwordChange', 'javascript:prod:planDiscovery', 'javascript:prod:unsubscribe', 'javascript:prod:Bible', 'javascript:prod:subscribeUser', 'javascript:prod:passage', callback);
});

gulp.task('build:staging', (callback) => {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], ['images:dev', 'css:dev', 'javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange', 'javascript:dev:planDiscovery', 'javascript:dev:unsubscribe', 'javascript:dev:Bible', 'javascript:dev:subscribeUser', 'javascript:dev:passage'], callback);
});

gulp.task('build:review', (callback) => {
	runSequence(['images:clean', 'javascript:clean', 'css:clean'], ['images:prod', 'css:dev', 'javascript:dev', 'javascript:dev:event', 'javascript:dev:passwordChange', 'javascript:dev:planDiscovery', 'javascript:dev:unsubscribe', 'javascript:dev:Bible', 'javascript:dev:subscribeUser', 'javascript:dev:passage'], callback);
});

gulp.task('watch', ['images', 'css', 'javascript'], () => {
	livereload.listen();
	gulp.watch(['./images/**/*.js'], ['images']);
	gulp.watch(['./app/**/*.js'], ['javascript']);
	gulp.watch(['./app/**/*.less'], ['css']);
});

const prefixedLocales = [
	'en-GB',
	'zh-CN',
	'zh-TW',
	'es-ES',
	'pt-PT',
]

gulp.task('smartling', (callback) => {
	return smartlingAuth().then((response) => {
		const token = response.response.data.accessToken;
		return smartlingFetchAvailableLocales(token).then((response) => {
			const locales = response.response.data.items;
			const queue = async.queue((task, callback) => {
				smartlingFetchLocaleFile(task.locale, token).then((data) => {
					callback(task, data, null);
				}, (error) => {
					callback(null, null, error);
				})
			}, 10);

			const localeList = locales.map((item) => {
				const lang_country = item.localeId.split('-');
				const country = lang_country[1] || '';
				const lang = langs.where('1', lang_country[0]);
				const locale3 = lang ? lang['3'] : null;
				const locale2 = lang ? lang['1'] : null;
				const final = Object.assign(
					{},
					langmap[item.localeId],
					{
						locale: item.localeId,
						locale2,
						locale3
					}
				);

				final.displayName = final.nativeName || final.englishName || final.locale.toUpperCase();
				return final;
			});

			localeList.push({
				nativeName: 'English (US)',
				englishName: 'English (US)',
				locale: 'en-US',
				locale2: 'en',
				locale3: 'eng',
				displayName: 'English (US)'
			});

			localeList.sort((a, b) => {
				return a.displayName.localeCompare(b.displayName);
			});

			fs.writeFileSync('./locales/config/_localeList.json', JSON.stringify(localeList, null, '\t'));

			const tasks = locales.map((item) => {
				return { locale: item.localeId, prefix: item.localeId.split('-')[0] }
			});

			tasks.push({ locale: 'en-US', prefix: 'en' });

			const availableLocales = {};
			tasks.forEach((t) => {
				availableLocales[t.locale] = t.locale;
				availableLocales[t.prefix] = t.locale;
				availableLocales[t.locale.replace('-', '_')] = t.locale
			});

			fs.writeFileSync('./locales/config/_availableLocales.json', JSON.stringify(availableLocales, null, '\t'));

			queue.push(tasks, (task, data, err) => {
				// let's get the api strings
				getApiStrings({
					language_tag: prefixedLocales.includes(task.locale)
						? task.locale.replace('-', '_')
						: task.prefix
				}).then((resp) => {
					// the response is a bit odd, in that if we see we have a 'response'
					// key, it means we have an error. if we actually get the strings, they
					// are at the top level
					let apiStrings = {}
					try {
						JSON.parse(resp)
					} catch (e) {
						apiStrings = poToJson(resp)
					}

					const strings = Object.assign(
						{},
						data[task.prefix].EventsAdmin,
						apiStrings
					)

					fs.writeFileSync(
						`./locales/${task.locale}.json`,
						JSON.stringify(flattenObject(strings), null, '\t')
						.replace(/\%\{/g, '{')
					);
				})
			});

			const client = GetClient('reading-plans')
				.call('configuration')
				.setVersion('3.1')
				.get()
				.then((data) => {
					const planLocales = {}

					const isFullMatch = (locale, planLocale) => {
						return locale.replace('-', '_') === planLocale.replace('-', '_')
					}

					const isOverride = (locale, planLocale) => {
						return (isFullMatch('pt-PT', locale) && isFullMatch('pt', planLocale)) ||
							(isFullMatch('es-ES', locale) && isFullMatch('es', planLocale))
					}


					const isPrefixMatch = (locale, planLocale) => {
						return planLocale.length === 2 &&
							!isOverride(locale, planLocale) &&
							(locale.split('-')[0].split('_')[0] === planLocale.split('-')[0].split('_')[0])
					}

					const mergeLocale = (final, locale, planLocale) => {
						if (isFullMatch(locale, planLocale) || isPrefixMatch(locale, planLocale)) {
							final[locale] = planLocale
						}
					}

					data.available_language_tags.forEach((l) => {
						Object.keys(availableLocales).forEach((a) => {
							mergeLocale(planLocales, a, l)
						});
					});
					fs.writeFileSync('./locales/config/planLocales.json', JSON.stringify(planLocales, null, '\t'));
				}, (error) => {
					console.log(error);
				});

			// queue.drain = callback;

		}, (error) => {
			console.log(error);
		});
	}, (error) => {
		console.log(error);
	});
});

function smartlingAuth() {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: '/auth-api/v2/authenticate',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const req = https.request(options)

		req.on('response', (response) => {
			/* eslint-disable no-var */
			var body = '';

			response.on('data', (chunk) => {
				body += chunk;
			});

			response.on('end', () => {
				try {
					resolve(JSON.parse(body));
				} catch (ex) {
					reject(ex);
				}
			});
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}

function smartlingFetchAvailableLocales(token) {
	return new Promise((resolve, reject) => {
		const query = querystring.stringify({
			fileUri: '/files/en.yml'
		})

		const options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: `/files-api/v2/projects/${smartlingProjectId}/file/status?${query}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}

		const req = https.request(options)

		req.on('response', (response) => {
			/* eslint-disable no-var */
			var body = '';

			response.on('data', (chunk) => {
				body += chunk;
			});

			response.on('end', () => {
				try {
					resolve(JSON.parse(body));
				} catch (ex) {
					reject(ex);
				}
			});
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}

function smartlingFetchLocaleFile(locale, token) {
	return new Promise((resolve, reject) => {
		const query = querystring.stringify({
			fileUri: '/files/en.yml'
		})

		const options = {
			hostname: 'api.smartling.com',
			port: 443,
			path: `/files-api/v2/projects/${smartlingProjectId}/locales/${locale}/file?${query}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}

		const req = https.request(options)

		req.on('response', (response) => {
			/* eslint-disable no-var */
			var body = '';

			response.on('data', (chunk) => {
				body += chunk;
			});

			response.on('end', () => {
				try {
					resolve(yaml.safeLoad(body, { json: true }));
				} catch (ex) {
					reject(ex);
				}
			});
		});

		req.on('error', (e) => {
			reject(e);
		});

		req.write(JSON.stringify(smartlingCredentials));

		req.end();
	})
}

/*eslint-disable */
function flattenObject(ob) {
	var toReturn = {};
	for (var i of Object.keys(ob)) {
		if ((typeof ob[i]) === 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				toReturn[`${i}.${x}`] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}
/*eslint-enable*/
