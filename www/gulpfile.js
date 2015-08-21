var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');
var reload      = browserSync.reload;

var src = {
  scss: 'scss/*.scss',
  html: 'templates/*.html'
};

gulp.task('serve', ['sass'], function() {

  browserSync({
    server: "./dist"
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.html, ['templates']);
});

gulp.task('templates', function() {
  return gulp.src(src.html)
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