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
	clean = require('gulp-clean'),
	watch = require('gulp-watch');

var path = {
	dist: {
		home: './dist',
		html: 'dist/',
		php: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		image: 'dist/image/',
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
		cssPaths: 'build/css/',
		css: 'build/css/*.css',
		icon: 'build/img/icons/*.*',
		imgPaths: 'build/img/',
		img: 'build/img/**/*.*',
		image: 'build/image/**/*.*',
		fonts: 'build/fonts/**/*.*'
	}
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
		.pipe(gulp.dest(path.build.cssPaths))
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(gulp.dest(path.build.cssPaths))
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
	// .pipe(reload({stream: true}));
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
// Clear
//===========================================
gulp.task('clear', function () {
	return gulp.src(path.dist.home, {read: false})
		.pipe(clean());
});
// Dist
//===========================================
gulp.task('dist', ['clean'], function() {
	var buildCss = gulp.src(path.build.css)
		.pipe(gulp.dest(path.dist.css))
	var buildFonts = gulp.src(path.build.fonts)
		.pipe(gulp.dest(path.dist.fonts))
	var buildJs = gulp.src(path.build.jsW)
		.pipe(gulp.dest(path.dist.js))
	var buildHtml = gulp.src(path.build.html)
		.pipe(gulp.dest(path.dist.html))
	var buildPhp = gulp.src(path.build.php)
		.pipe(gulp.dest(path.dist.php))
	var buildImg = gulp.src(path.build.img)
		.pipe(gulp.dest(path.dist.img))
	var buildImages = gulp.src(path.build.image)
		.pipe(gulp.dest(path.dist.image));
});
// Watch
// ===========================================
gulp.task('watch', function () {
	watch([path.build.html], function () {
		gulp.start('html:build');
	});
	watch([path.build.pug], function () {
		gulp.start('pug:build');
	});
	watch([path.build.php], function () {
		gulp.start('php:build');
	});
	watch([path.build.sass], function () {
		gulp.start('sass:build');
	});
	watch([path.build.jsW], function () {
		gulp.start('js:build');
	});
	watch([path.build.icon], function () {
		gulp.start('sprite:build');
	});
	watch([path.build.image], function () {
		gulp.start('image:build');
	});
	watch([path.build.img], function () {
		gulp.start('img:build');
	});
	watch([path.build.fonts], function () {
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