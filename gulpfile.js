"use strict";
//===========================================
var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	pug = require('gulp-pug'),
	rename = require("gulp-rename"),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	order = require("gulp-order"),
	uglify = require('gulp-uglify'),
	spritesmith = require('gulp.spritesmith'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	notify = require("gulp-notify"),
	rigger = require('gulp-rigger');
//===========================================
var buidPath = 'build/',
	path = {
		build: {
			home: buidPath,
			html: buidPath + '**/*.html',
			htmlHome: buidPath + '*.html',
			htmlRigger: buidPath + 'html/*.html',
			htmlRiggerFiles: buidPath + 'html/**/*.html',
			pug:  buidPath + 'pug/**/*.pug',
			pugFile:  buidPath + 'pug/*.pug',
			php:  buidPath + '**/*.php',
			js:   buidPath + 'js/**/*.js',
			jsPath: buidPath + 'js/',
			jsLib: buidPath + 'js/lib/**/*.js',
			jsLibPath: buidPath + 'js/lib/',
			sass: buidPath + 'sass/**/*.+(sass|scss)',
			sassPath: buidPath + 'sass/',
			css:  buidPath + 'css/**/*.css',
			cssPath:  buidPath + 'css/',
			icon: buidPath + 'img/icons/*.+(png|jpg)',
			img:  buidPath + 'img/**/*.*',
			imgPath:  buidPath + 'img/',
			image:  buidPath + 'image/**/*.*',
			imagePath:  buidPath + 'image/',
			fonts:  buidPath + 'fonts/**/*.*'
		},
		dist: {
			home: 'dist/',
			js: 'dist/js/',
			css: 'dist/css/',
			img: 'dist/img/',
			image: 'dist/image/',
			fonts: 'dist/fonts/'
		}
	};
// Server
//===========================================
gulp.task('openServer', function () {
	browserSync({
		proxy: 'js.loc/', // local server
		online: true,
		host: 'localhost',
    port: 9000,
		logPrefix: "openServer"
	});
});
//===========================================
gulp.task('webServer', function () {
	browserSync({
		server: {
			baseDir: "./build/"
		},
		online: true,
		host: 'localhost',
		port: 9000,
		logPrefix: "webServer"
	});
});
// HTML/PHP
// ===========================================
gulp.task('html:build', function () {
	gulp.src(path.build.htmlRigger)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.home))
		.pipe(reload({stream: true}));
});
// PUG
// ===========================================
gulp.task('pug:build', function () {
	return gulp.src(path.build.pugFile)
		.pipe(pug().on("error", notify.onError()))
		.pipe(gulp.dest(path.build.home))
		.pipe(reload({stream: true}));
});
// JavaScript
// ===========================================
gulp.task('js:build', function(){
	return gulp.src(path.build.jsLib)
		.pipe(order([
			'jquery.js',
			path.build.jsLib
		]))
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
    .pipe(gulp.dest(path.build.jsPath))
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.jsPath))
		.on('error', function(err) {
			console.error('Error in compress task', err.toString());
		});
});
gulp.task('jsMain:build', function(){
	return gulp.src(path.build.jsPath + 'main.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.jsPath))
		.on('error', function(err) {
			console.error('Error in compress task', err.toString());
		});
});
// SASS/SCSS
// ===========================================
gulp.task('sass:build', function () {
	return gulp.src(path.build.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", notify.onError()))
		.pipe(autoprefixer(['last 20 versions', '> 1%', 'ie > 8']))
		.pipe(rename(function (path) {
			path.extname = ".css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.cssPath))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(gulp.dest(path.build.cssPath))
		.pipe(reload({stream: true}));
});
// Img min / sprite
// ===========================================
gulp.task('sprite:build', function () {
	var spriteData = gulp.src(path.build.icon)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprite.scss',
			algorithm: 'diagonal',
			// padding: 100,
			imgPath: '../img/sprite.png'
		}))
	spriteData.img.pipe(gulp.dest(path.build.imgPath));
	spriteData.css.pipe(gulp.dest(path.build.sassPath));
});
// Clean
//===========================================
gulp.task('clean:dist', function () {
	return gulp.src(path.dist.home, {read: false})
		.pipe(clean());
});
// Dist
// //===========================================
gulp.task('dist', ['clean:dist'], function () {
	gulp.src(path.build.css)
		.pipe(gulp.dest(path.dist.css))
	gulp.src(path.build.fonts)
		.pipe(gulp.dest(path.dist.fonts))
	gulp.src(path.build.js)
		.pipe(gulp.dest(path.dist.js))
	gulp.src(path.build.html)
		.pipe(gulp.dest(path.dist.home))
	gulp.src(path.build.php)
		.pipe(gulp.dest(path.dist.home));
	gulp.src(path.build.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [imageminPngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist.img))
	gulp.src(path.build.image)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [imageminPngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist.image))
});
// Watch
// ===========================================
gulp.task('watch', function () {
	gulp.watch(path.build.htmlHome).on('change', browserSync.reload);
  gulp.watch(path.build.fonts).on('change', browserSync.reload);
  gulp.watch(path.build.icon, ['sprite:build']);
  gulp.watch(path.build.img).on('change', browserSync.reload);
  gulp.watch(path.build.image).on('change', browserSync.reload);
  gulp.watch(path.build.sass, ['sass:build']);
	gulp.watch(path.build.jsLib, ['js:build']);
  gulp.watch(path.build.jsPath + 'main.js', ['jsMain:build']);
  gulp.watch(path.build.js).on('change', browserSync.reload);
});
// ===========================================
gulp.task('watchHtml', function () {
  gulp.watch(path.build.htmlRiggerFiles, ['html:build']);
  gulp.watch(path.build.fonts).on('change', browserSync.reload);
  gulp.watch(path.build.icon, ['sprite:build']);
  gulp.watch(path.build.img).on('change', browserSync.reload);
  gulp.watch(path.build.image).on('change', browserSync.reload);
  gulp.watch(path.build.sass, ['sass:build']);
	gulp.watch(path.build.jsLib, ['js:build']);
  gulp.watch(path.build.jsPath + 'main.js', ['jsMain:build']);
  gulp.watch(path.build.js).on('change', browserSync.reload);
});
// ===========================================
gulp.task('watchPug', function () {
	gulp.watch(path.build.pug, ['pug:build']);
  gulp.watch(path.build.fonts).on('change', browserSync.reload);
  gulp.watch(path.build.icon, ['sprite:build']);
  gulp.watch(path.build.img).on('change', browserSync.reload);
  gulp.watch(path.build.image).on('change', browserSync.reload);
  gulp.watch(path.build.sass, ['sass:build']);
  gulp.watch(path.build.jsLib, ['js:build']);
  gulp.watch(path.build.jsPath + 'main.js', ['jsMain:build']);
  gulp.watch(path.build.js).on('change', browserSync.reload);
});
// ===========================================
gulp.task('watchPhp', function () {
  gulp.watch(path.build.php).on('change', browserSync.reload);
  gulp.watch(path.build.fonts).on('change', browserSync.reload);
  gulp.watch(path.build.icon, ['sprite:build']);
  gulp.watch(path.build.img).on('change', browserSync.reload);
  gulp.watch(path.build.image).on('change', browserSync.reload);
  gulp.watch(path.build.sass, ['sass:build']);
  gulp.watch(path.build.jsLib, ['js:build']);
  gulp.watch(path.build.jsPath + 'main.js', ['jsMain:build']);
  gulp.watch(path.build.js).on('change', browserSync.reload);
});

// Gulp task default
//===========================================
gulp.task('default', ['sprite:build','sass:build','js:build','jsMain:build','webServer','watch']);
//===========================================
gulp.task('html', ['html:build','sprite:build','sass:build','js:build','jsMain:build','webServer','watchHtml']);
//===========================================
gulp.task('pug', ['pug:build','sprite:build','sass:build','js:build','jsMain:build','webServer','watchPug']);
//===========================================
gulp.task('php', ['sprite:build','sass:build','js:build','jsMain:build','openServer','watchPhp']); // only with php server
//===========================================
