"use strict";
//===========================================
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	prefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	minifyCss  = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch');

var path = {
	dist: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		images: 'dist/images/',
		fonts: 'dist/fonts/'
	},
	build: {
		html: 'build/**/*.html',
		php: 'build/**/*.php',
		jsW: 'build/js/**/*.js',
		js: 'build/js/scripts.js',
		jsMin: 'build/js/',
		sass: 'build/sass/**/*.+(sass|scss)',
		css: 'build/css/',
		img: 'build/img/**/*.*',
		image: 'build/image/**/*.*',
		fonts: 'build/fonts/**/*.*'
	},
	clean: './prod'
};
// Server
//===========================================
var config = {
	server: {
		baseDir: "./build/"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
	browserSync(config);
});
//===========================================
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});
// HTML
// ===========================================
gulp.task('html:build', function(){
	gulp.src(path.build.html)
		.pipe(reload({stream: true}));
});
// PHP
// ===========================================
gulp.task('php:build', function(){
	gulp.src(path.build.php)
		.pipe(reload({stream: true}));
});
// JavaScript
// ===========================================
gulp.task('js:build', function () {
	gulp.src(path.build.js)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.jsMin))
		.pipe(reload({stream: true}));
});
// SASS/SCSS
// ===========================================
gulp.task('sass:build', function () {
	gulp.src(path.build.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer('last 20 version'))
		.pipe(rename(function (path) {
			path.extname = ".css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});
// Img min
// ===========================================
gulp.task('image:build', function () {
	gulp.src(path.build.image)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.image))
		.pipe(reload({stream: true}));
});
gulp.task('img:build', function () {
	gulp.src(path.build.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});
// Fonts
// ===========================================
gulp.task('fonts:build', function() {
	gulp.src(path.build.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});
// Watch
// ===========================================
gulp.task('watch', function(){
	watch([path.build.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.build.php], function(event, cb) {
		gulp.start('php:build');
	});
	watch([path.build.sass], function(event, cb) {
		gulp.start('sass:build');
	});
	watch([path.build.jsW], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.build.image], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.build.img], function(event, cb) {
		gulp.start('img:build');
	});
	watch([path.build.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});
gulp.task('build', [
	'html:build',
	'php:build',
	'js:build',
	'sass:build',
	'fonts:build',
	'image:build',
	'img:build'
]);
//===========================================
gulp.task('default', ['build', 'webserver', 'watch']);