var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	uglify 			 = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	notify           = require('gulp-notify'),
	livereload       = require('gulp-livereload'),
	plumber          = require('gulp-plumber'),
	path             = require('path'),
	apidoc 			 = require('gulp-apidoc'),
	ngHtml2Js 		 = require("gulp-ng-html2js"),
	minifyHtml 		 = require("gulp-minify-html");
	concatMap 		 = require('gulp-concat-sourcemap'),
	ngAnnotate		 = require('gulp-ng-annotate'),
	sourcemaps		 = require('gulp-sourcemaps'),
	jshint			 = require('gulp-jshint'),
	embedTemplates	 = require('gulp-angular-embed-templates'),
	markdown 		 = require('gulp-markdown');

var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

var plumberErrorHandler = { errorHandler: notify.onError({
	title: notifyInfo.title,
	icon: notifyInfo.icon,
	message: "Error: <%= error.message %>"
})
};



var scriptsToDo1 = [
	'src/*.js'
];

gulp.task('scripts1', function() {
	return gulp.src(scriptsToDo1)
	.pipe(plumber(plumberErrorHandler))
	.pipe(sourcemaps.init())
	.pipe(ngAnnotate({
		// true helps add where @ngInject is not used. It infers.
		// Doesn't work with resolve, so we must be explicit there
		add: true
	}))
	.pipe(embedTemplates())
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(concat('utility.min.js'))
	.pipe(gulp.dest('dist'))
	.pipe(uglify())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('dist'))
});

gulp.task('live', function() {
	livereload.listen();
	gulp.watch(scriptsToDo1, ['scripts1']);
});

gulp.task('md2html', function() {
	return gulp.src('README.md')
	.pipe(plumber(plumberErrorHandler))
    .pipe(markdown())
    .pipe(gulp.dest('docs'));
});

gulp.task('default', [
	'scripts1',
	'live'
], function(){});
