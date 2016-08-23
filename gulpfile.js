"use strict";
//===========================================
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect'),
	prefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	minifyCss  = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps');
//===========================================
gulp.task('connect', function () {
	connect.server({
		root: 'build',
		livereload: true
	})
});
//===========================================
gulp.task('html', function(){
	gulp.src('build/*.html')
		.pipe(connect.reload());
});
//===========================================
gulp.task('scss', function () {
	gulp.src('build/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer('last 20 version'))
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css/'))
		.pipe(connect.reload());
});
gulp.task('css', function () {
	gulp.src('build/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer('last 20 version'))
		.pipe(gulp.dest('build/css/'))
		.pipe(connect.reload());
});
//===========================================
gulp.task('watch', function(){
	gulp.watch('build/scss/**/*.scss', ['scss'])
	gulp.watch('build/css/**/*.css', ['css'])
	gulp.watch('build/*.html', ['html'])
});
//===========================================
gulp.task('default', ['connect', 'html', 'scss', 'css', 'watch']);