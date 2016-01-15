var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var concat 	= require('gulp-concat');

gulp.task('javascript', function() {
	browserify("app/main.js")
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind" ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		//.pipe(uglify())
		.pipe(gulp.dest("./public/javascripts/"))
		.pipe(livereload({reloadPage:""}));
});

gulp.task('css', function() {
	gulp.src(['./app/less/**/*.less'])
		.pipe(concat('style.min.css'))
    .pipe(less())
		.pipe(cssnano())    
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch( ["./app/**/*.js"], ['javascript'] );
	gulp.watch( ["./app/**/*.less"], ['css'] );
});