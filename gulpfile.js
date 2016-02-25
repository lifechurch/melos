var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var concat 	= require('gulp-concat');

var IS_PROD = process.env.NODE_ENV === 'production';

gulp.task('javascript', function() {
	var p = browserify("app/main.js", { debug: !IS_PROD })
		.transform("babelify", { presets: [ "es2015", "react" ], plugins: [ "transform-object-rest-spread", "transform-function-bind" ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer());

	if (IS_PROD) {
		p = p.pipe(uglify())
	}

	p.pipe(gulp.dest("./public/javascripts/"))
		.pipe(livereload({reloadPage:""}));
});

gulp.task('css', function() {
	var p = gulp.src(['./app/less/**/*.less'])
		.pipe(concat('style.min.css'))
    .pipe(less());

  if (IS_PROD) {
		p = p.pipe(cssnano());
  }

	p.pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', ['css', 'javascript'], function() {
	livereload.listen();
	gulp.watch( ["./app/**/*.js"], ['javascript'] );
	gulp.watch( ["./app/**/*.less"], ['css'] );
});
