var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	uglify           = require('gulp-uglifyjs'),
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

gulp.task('buildDate', function(){
	return require('fs').writeFile('dist/builddate.js', 'console.log('+new Date()+')');
});
function string_src(filename, string) {
	var src = require('stream').Readable({ objectMode: true });
	src._read = function () {
		this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
		this.push(null);
	}
	return src;
}

var scriptsToDo1 = [
	'src/*.js'
];

gulp.task('scripts1', function() {
	require('fs').writeFile('dist/builddate.js', 'console.log("'+new Date()+'")');
	return gulp.src(scriptsToDo1)
	.pipe(plumber(plumberErrorHandler))
	.pipe(uglify('utility.min.js', {outSourceMap: true}))
	.pipe(gulp.dest('dist'))
});

gulp.task('live', function() {
	livereload.listen();
	require('fs').writeFile('dist/builddate.js', 'console.log("'+new Date()+'")');
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
