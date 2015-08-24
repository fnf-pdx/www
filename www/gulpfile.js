'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var swig = require('gulp-swig');
var data = require('gulp-data');
var path = require('path');
var fs = require('fs');
var reload = browserSync.reload;

var src = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*',
  data: 'src/data/*.json',
  html: 'src/html/*.html'
};

function getJsonData(file) {
  var filePath = './src/data/' + path.basename(file.path, '.html') + '.json';
  var fileContents;
  var data;

  try {
    fileContents = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch(e) {
    data = {};
  }

  return data;
}

gulp.task('serve', ['sass', 'html', 'js', 'img'], function() {

  browserSync({
    server: "./dev",
    extensions: "html"
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.data, ['html']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.js, ['js']);
});

gulp.task('sass', function() {
  return gulp.src(src.scss)
    .pipe(sass({defaults: {cache: false}}))
    .pipe(gulp.dest('./dev/css'))
    .pipe(reload({stream: true}));
});

gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(data(getJsonData))
    .pipe(swig({defaults: {cache: false}}))
    .pipe(gulp.dest('./dev'))
    .on("end", reload);
});

gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(gulp.dest('./dev/js'));
});

gulp.task('img', function() {
  return gulp.src(src.img)
    .pipe(gulp.dest('./dev/img'));
});

gulp.task('default', ['serve']);
