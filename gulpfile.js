"use strict";
//===========================================
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass'),
	prefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	spritesmith = require('gulp.spritesmith'),
	connect = require('gulp-connect-php'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
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
		build: 'build/',
		html: 'build/**/*.html',
		pug: 'build/pug/*.pug',
		php: 'build/**/*.php',
		jsW: 'build/js/**/*.js',
		js: 'build/js/scripts.js',
		jsMin: 'build/js/',
		sassPaths: 'build/sass/',
		sass: 'build/sass/**/*.+(sass|scss)',
		css: 'build/css/',
		icon: 'build/img/icons/*.*',
		imgPaths: 'build/img/',
		img: 'build/img/**/*.*',
		image: 'build/image/**/*.*',
		fonts: 'build/fonts/**/*.*'
	},
	clean: './prod'
};
// Server
//===========================================
// var config = {
// 	server: {
// 		baseDir: "./build/"
// 	},
// 	proxy: "localhost:8888",
// 	tunnel: "magl88net",
// 	online: true,
// 	host: 'localhost',
// 	port: 9000,
// 	logPrefix: "Frontend_Devil"
// };
// });
// gulp.task('webserver', function() {
//  browserSync(config);
// });

gulp.task('connect-sync', function () {
	connect.server({
		base: './build/'
	}, function () {
		browserSync({
			proxy: '127.0.0.1:8000',
			tunnel: "magl88net",
			online: true,
			host: 'localhost',
			port: 9000,
			logPrefix: "Frontend_Devil"
		});
	});
});

//===========================================
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});
// HTML
// ===========================================
gulp.task('html:build', function () {
	gulp.src(path.build.html)
	.pipe(reload({stream: true}));
});
// PUG
// ===========================================
gulp.task('pug:build', function () {
	gulp.src(path.build.pug)
		.pipe(pug())
		.pipe(gulp.dest('./build'))
		// .pipe(gulp.dest(path.build.build));
		// .pipe(reload({stream: true}));
});
// PHP
// ===========================================
gulp.task('php:build', function () {
	gulp.src(path.build.php)
	.pipe(reload({stream: true}));
});
// JavaScript
// ===========================================
gulp.task('js:build', function () {
	gulp.src(path.build.js)
		.pipe(reload({stream: true}));
	// gulp.src(path.build.js)
	// 	.pipe(sourcemaps.init())
	// 	.pipe(uglify())
	// 	.pipe(rename(function (path) {
	// 		path.extname = ".min.js"
	// 	}))
	// 	.pipe(sourcemaps.write())
	// 	.pipe(gulp.dest(path.build.jsMin))
	// 	.pipe(reload({stream: true}));
});
// SASS/SCSS
// ===========================================
gulp.task('sass:build', function () {
	gulp.src(path.build.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer('last 20 versions'))
		.pipe(rename(function (path) {
			path.extname = ".css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(gulp.dest(path.build.css))
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
			// padding: 5,
			imgPath: '../img/sprite.png'
		}))
	.pipe(reload({stream: true}));
	spriteData.img.pipe(gulp.dest(path.build.imgPaths)); // путь, куда сохраняем картинку
	spriteData.css.pipe(gulp.dest(path.build.sassPaths)); // путь, куда сохраняем стили
	// return spriteData.pipe(gulp.dest(path.build.imgPaths));
});
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
gulp.task('fonts:build', function () {
	gulp.src(path.build.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});
// Watch
// ===========================================
gulp.task('watch', function () {
	watch([path.build.html], function (event, cb) {
		gulp.start('html:build');
	});
	watch([path.build.pug], function (event, cb) {
		gulp.start('pug:build');
	});
	watch([path.build.php], function (event, cb) {
		gulp.start('php:build');
	});
	watch([path.build.sass], function (event, cb) {
		gulp.start('sass:build');
	});
	watch([path.build.jsW], function (event, cb) {
		gulp.start('js:build');
	});
	watch([path.build.sprite], function (event, cb) {
		gulp.start('sprite:build');
	});
	watch([path.build.image], function (event, cb) {
		gulp.start('image:build');
	});
	watch([path.build.img], function (event, cb) {
		gulp.start('img:build');
	});
	watch([path.build.fonts], function (event, cb) {
		gulp.start('fonts:build');
	});
});
//===========================================
gulp.task('default', [
	'html:build',
	'pug:build',
	'php:build',
	'js:build',
	'sass:build',
	'fonts:build',
	'sprite:build',
	'image:build',
	'img:build',
	'connect-sync',
	// 'webserver',
	'watch'
]);