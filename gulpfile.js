"use strict";
//===========================================
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect'),
	prefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	minifyCss  = require('gulp-minify-css'),
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
		js: 'build/js/**/*.js',
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
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend_Devil"
};
gulp.task('webserver', function () {
	browserSync(config);
});
gulp.task('connect', function () {
	connect.server({
		root: './build',
		livereload: true
	})
});
//===========================================
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});
//===========================================
gulp.task('html:build', function(){
	gulp.src(path.build.html)
		.pipe(connect.reload());
});
//===========================================
gulp.task('sass:build', function () {
	gulp.src(path.build.html)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer('last 10 version'))
		.pipe(rename(function (path) {
			path.extname = "style.css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(connect.reload());
});
// Img
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
});
// Watch
// ===========================================
// gulp.task('watch', function(){
// 	gulp.watch(path.build.sass, ['sass'])
// 	gulp.watch(path.build.html, ['html'])
// });

gulp.task('watch', function(){
	watch([path.build.html], function(event, cb) {
		gulp.start('html:build');
	});
	// watch([path.build.style], function(event, cb) {
	// 	gulp.start('sass:build');
	// });
	// watch([path.watch.js], function(event, cb) {
	// 	gulp.start('js:build');
	// });
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
	// 'js:build',
	// 'sass:build',
	'fonts:build'
	// 'image:build',
	// 'img:build'
]);
//===========================================
gulp.task('default', ['build','connect','watch']);