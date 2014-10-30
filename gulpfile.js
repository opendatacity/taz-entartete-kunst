'use strict';
// generated on 2014-10-21 using generator-gulp-webapp 0.1.0

var gulp = require('gulp'),
exec = require('child_process').exec,
fs = require('fs');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10
		}))
		.pipe($.autoprefixer('last 2 versions'))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size());
});

gulp.task('scripts', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(require('jshint-stylish')))
		.pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
	var jsFilter = $.filter('**/*.js');
	var cssFilter = $.filter('**/*.css');

	return gulp.src('app/*.html')
		.pipe($.useref.assets({searchPath: '{.tmp,app}'}))
		.pipe(jsFilter)
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		// .pipe($.cache($.imagemin({
		// 	optimizationLevel: 3,
		// 	progressive: true,
		// 	interlaced: true
		// })))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});

gulp.task('data', function (cb) {
	// Yes, this is quick and dirty.
	exec('node make/data.js', function (err, stdout, stderr) {
		cb(err);
	});
});

gulp.task('thumbnails', function (cb) {
	console.log('Generating thumbnails.');
	console.log('This task can take several minutes and is not designed to be run frequently.');
	exec('make/thumbnails.sh', function (err, stdout, stderr) {
		cb(err);
	});
});

gulp.task('pdf', function (cb) {
	// We need to do this in smaller batches because file handling in pdfkit is
	// terribly inefficient; with many files it _will_ eventually crash with a
	// "too many open files" error.
	var json = JSON.parse(fs.readFileSync('app/data/raubkunst.json'));
	var length = json.reduce(function (p, c) {
		return p + c.length;
	}, 0);

	var command = 'node make/pdf.js', commands = '',
	batchSize = 500;

	for (var i=0, n=Math.ceil(length/batchSize); i<n; i++) {
		commands += command + ' ' + (i*batchSize) + '-' + ((i+1)*batchSize - 1) + '; ';
	}

	console.log('Generating ' + length + ' PDFs in ' + n + ' batch(es).');
	console.log('This task can take several minutes and is not designed to be run frequently.');

	exec(commands, function (err, stdout, stderr) {
		if (stderr.indexOf('EMFILE') !== -1) {
			console.log([
				"Crashed with 'too many files' error due to terribly inefficient file handling",
				"in pdfkit. Try increasing your system's limit or run the script manually",
				"in several smaller batches, like this:","",
				"    $ " + command + " 0-500",
				"    $ " + command + " 501-1000",
				"etc.", "",
				"The failed commands were ", commands 
			].join("\n"))
		}
		cb(err);
	});
});

gulp.task('copy-pdf', function () {
	return gulp.src('app/pdf/**/*')
		.pipe(gulp.dest('dist/pdf'))
		.pipe($.size());
});

gulp.task('copy-data', function () {
	return gulp.src('app/data/*')
		.pipe(gulp.dest('dist/data'))
		.pipe($.size());
});

gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size());
});

gulp.task('extras', function () {
	return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
	return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('setup', ['data', 'thumbnails', 'pdf'])

gulp.task('build', ['html', 'images', 'copy-pdf', 'copy-data', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});

gulp.task('connect', function () {
	var connect = require('connect');
	var app = connect()
		.use(require('connect-livereload')({ port: 35729 }))
		.use(connect.static('app'))
		.use(connect.static('.tmp'))
		.use(connect.directory('app'));

	require('http').createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:9000');
		});
});

gulp.task('serve', ['connect', 'styles'], function () {
	require('opn')('http://localhost:9000', 'Google Chrome');
});

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			directory: 'app/bower_components'
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			directory: 'app/bower_components'
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
	var server = $.livereload();

	// watch for changes

	gulp.watch([
		'app/*.html',
		'.tmp/styles/**/*.css',
		'app/scripts/**/*.js',
		'app/images/**/*'
	]).on('change', function (file) {
		server.changed(file.path);
	});

	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/images/**/*', ['images']);
	gulp.watch('bower.json', ['wiredep']);
});
