var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  browsersync = require('browser-sync'),
  minifyHTML = require('gulp-minify-html'),
  styleguide = require('sc5-styleguide'),
  plumber = require('gulp-plumber'),
  gutil = require('gulp-util'),
  outputPath = 'assets/development/styleguide',
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  inject = require('gulp-inject'),
  sourcemaps = require('gulp-sourcemaps'),
  nodemon = require('gulp-nodemon'),
  del = require('del');

// error function for plumber
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// BrowserSync proxy
// gulp.task('browser-sync', function() {
//   browsersync({
//         server: {
//             baseDir: "views"
//         }
//   });
// });
gulp.task('browser-sync', ['nodemon'], function() {
  browsersync.init(null, {
    proxy: "http://localhost:3000",
    files: ["assets/**/*.*"],
    browser: "google chrome",
    port: 7000,
  });
});

// BrowserSync reload all Browsers
gulp.task('browsersync-reload', function () {
  browsersync.reload();
});

gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('fileinclude', function() {
  // content
});

// Compile Sass
gulp.task('styles', function() {
  return gulp.src('assets-raw/scss/main.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/development/assets/css'))
    .pipe(browsersync.reload({ stream:true }))

});

// Compile Sass to Production
gulp.task('buildStyles', function() {
  return gulp.src('assets-raw/scss/main.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('assets/production/assets/css'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('assets/production/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
});

// Minify HTML
gulp.task('miniHtml', function() {
  var svgs = gulp.src('assets-raw/svg/*.svg')
    .pipe(rename({prefix: 'icn-'}))
    .pipe(svgstore({ inlineSvg: true }));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  gulp.src('assets-raw/**/*.html')
    .pipe(inject(svgs, { transform: fileContents }))
    .pipe(minifyHTML())
    .pipe(gulp.dest('assets/production/'))
    .pipe(notify({ message: 'HTML Minified' }))
});

// Move HTML
gulp.task('copyHtml', function() {

  var svgs = gulp.src('assets-raw/svg/*.svg')
    .pipe(rename({prefix: 'icn-'}))
    .pipe(svgstore({ inlineSvg: true }));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  gulp.src('views-raw/**/*.html')
    .pipe(inject(svgs, { transform: fileContents }))
    .pipe(gulp.dest('views'))
    .pipe(browsersync.reload({ stream:true }))
});


// Compile Build JavaScript
gulp.task('buildJs', function() {

  gulp.src('bower_components/modernizr/modernizr.js')
    .pipe(gulp.dest('assets/production/assets/js/vendor'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/production/assets/js/vendor'));

  gulp.src('bower_components/jquery/dist/jquery.js')
    .pipe(gulp.dest('assets/production/assets/js/vendor'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/production/assets/js/vendor'));

  gulp.src(['bower_components/greensock/src/uncompressed/TweenMax.js',
    'bower_components/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js',
    'bower_components/ScrollMagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
    'bower_components/greensock/src/uncompressed/plugins/ScrollToPlugin.js',
    'assets-raw/js/main.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/production/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/production/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));

});

// Compile Development JavaScript
gulp.task('devJs', function() {

  gulp.src('bower_components/modernizr/modernizr.js')
    .pipe(gulp.dest('assets/development/assets/js/vendor'));

  gulp.src('bower_components/jquery/dist/jquery.js')
    .pipe(gulp.dest('assets/development/assets/js/vendor'));

  gulp.src(['bower_components/greensock/src/uncompressed/TweenMax.js',
    'bower_components/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js',
    'bower_components/ScrollMagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
    'bower_components/greensock/src/uncompressed/plugins/ScrollToPlugin.js',
    'assets-raw/js/main.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/development/assets/js'));
});



// Compress Images to Build folder
gulp.task('buildImg', function() {
  return gulp.src('assets-raw/img/**/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/production/assets/img'))
    .pipe(notify({ message: 'Images task complete' }))
});

// Compress Images to Dev folder
gulp.task('devImg', function() {
  return gulp.src('assets-raw/img/**/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/development/assets/img'))
    .pipe(notify({ message: 'Images task complete' }))
});

// All unprocessed styles containing the KSS markup and style variables.
// This will process the KSS markup and collects variable information.
gulp.task('styleguide:generate', function() {
  return gulp.src('assets-raw/scss/**/*.scss')
    .pipe(styleguide.generate({
      title: 'My Styleguide',
      rootPath: outputPath,
      server: true,
      port: '5000',
      overviewPath: 'README.md'
    }))
    .pipe(gulp.dest(outputPath));
});

//Preprocessed/compiled stylesheets.
// This will create necessary pseudo styles and create the actual stylesheet to be used in the styleguide.
gulp.task('styleguide:applystyles', function() {
  return gulp.src('assets-raw/scss/main.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
});

// Clean up development!
gulp.task('cleanDev', function(cb) {
  del(['assets/development/assets', 'assets/development/styleguide', 'assets/development/*.html'], cb)
});

// Clean up production!
gulp.task('cleanBuild', function(cb) {
  del(['assets/production/assets', 'assets/production/*.html'], cb)
});

// Watch task
gulp.task('watch', ['browser-sync', 'styleguide'], function () {
  gulp.watch('assets-raw/scss/**/*', ['styles', 'styleguide']);
  gulp.watch('assets-raw/js/**/*', ['browsersync-reload', 'devJs', 'copyHtml']);
  gulp.watch('views-raw/**/*.html', ['browsersync-reload', 'copyHtml']);
  gulp.watch('assets-raw/svg/*.svg', ['browsersync-reload', 'copyHtml']);
  gulp.watch('assets-raw/img/**/*', ['browsersync-reload','devImg', 'copyHtml']);
  // gulp.watch('assets/development/**/*', ['browsersync-reload', 'styleguide']);
});


gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);
gulp.task('serve', [ 'styleguide', 'devImg', 'devJs', 'copyHtml', 'styles', 'watch']);
gulp.task('build',['buildStyles', 'buildImg', 'buildJs', 'miniHtml'], function() {});

