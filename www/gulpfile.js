var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');
var data        = require('gulp-data');
var path        = require('path');
var fs          = require('fs');
var reload      = browserSync.reload;

var src = {
  scss: 'scss/**/*.scss',
  html: 'templates/*.html',
  data: 'mock_data/*.json'
};

function getJsonData(file) {
  var filename = './mock_data/' + path.basename(file.path, '.html') + '.json';
  var fileContents;
  var data;

  try {
    fileContents = fs.readFileSync(filename, 'utf8');
    data = JSON.parse(fileContents);
  } catch(e) {
    data = {};
  }
  console.log(data);
  return data;
}

gulp.task('serve', ['sass', 'templates'], function() {

  browserSync({
    server: "./dist",
    extensions: "html"
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.html, ['templates']);
  gulp.watch(src.data, ['templates']);
});

gulp.task('templates', function() {
  return gulp.src(src.html)
    .pipe(data(getJsonData))
    .pipe(swig())
    .pipe(gulp.dest('./dist'))
    .on("end", reload);
});

gulp.task('sass', function() {
  return gulp.src(src.scss)
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
    .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
