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

var IS_PROD = process.env.NODE_ENV === 'production';

gulp.task('javascript:prod', function() {
	return browserify("app/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind" ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/javascripts/"))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('javascript:dev', function() {
	return browserify("app/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind" ] })
		.bundle()
		.pipe(source('app.js'))
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
		runSequence('javascript:clean', 'javascript:prod', callback);
	} else {
		runSequence('javascript:clean', 'javascript:dev', callback);
	}
});

gulp.task('css:prod', function() {
	return gulp.src(['./app/less/**/*.less'])
		.pipe(concat('style.css'))
    .pipe(less())
		.pipe(cssnano())
		.pipe(rev())
  	.pipe(gulp.dest('./public/stylesheets'))
		.pipe(rev.manifest({merge:true, base: 'build/assets'}))
		.pipe(gulp.dest('build/assets'));
});

gulp.task('css:dev', function() {
	return gulp.src(['./app/less/**/*.less'])
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

gulp.task('watch', ['images', 'css', 'javascript'], function() {
	livereload.listen();
	gulp.watch( ["./images/**/*.js"], ['images'] );
	gulp.watch( ["./app/**/*.js"], ['javascript'] );
	gulp.watch( ["./app/**/*.less"], ['css'] );
});
