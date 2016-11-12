// Libraries
var gulp = require('gulp'),
  fs = require('fs'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  responsive = require('gulp-responsive'),
  pngquant = require('imagemin-pngquant'),
  ghPages = require('gulp-gh-pages'),
  dateFormat = require('dateformat');

// Load data
var apps = JSON.parse(fs.readFileSync('./apps.json'));
var lastDay = 0;

// Set the last day
apps.forEach(function(a) {
  if (a.created_at > lastDay) { lastDay = a.created_at; }
});

// Sort
apps = apps.sort(function(a, b) { return b.created_at - a.created_at; });

// Cut a text and display hypens
function showLink(str) {
  var maxLength = 35;

  if (str.length > maxLength) {
    str = str.substring(0, maxLength - 3) + '...';
  }

  return str.replace(/.*?:\/\//g, "");
}

// Format date!
function formatDate(time) {
  var date = new Date(time);
  return dateFormat(date, "mmmm yyyy");
}

// Compile views
gulp.task('views', function() {
  return gulp.src('templates/index.pug')
    .pipe(pug({
      data: {
        apps: apps,
        lastDay: lastDay,
        showLink: showLink,
        formatDate: formatDate
      }
    }))
    .pipe(gulp.dest('./dist'));
});

// Compile CSS
gulp.task('sass', function () {
  return gulp.src('./styles/style.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

// Optimize svg
gulp.task('svg', function() {
  return gulp.src('./images/*.svg')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
});

// Optimize Images
gulp.task('png', function() {
  return gulp.src('./images/*.png')
    .pipe(responsive({
      '*.png': {
        height: 120,
        upscale: false
      },
    }))
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./dist/images'));
});

// Save static files
gulp.task('static', function() {
  return gulp.src([
    './favicon.png',
    './CNAME'
  ]).pipe(gulp.dest('./dist'));
})

// Deploy new version to gh-pages! :D
gulp.task('deploy', ['dist'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// Compile all assets
gulp.task('dist', ['views', 'sass', 'png', 'svg', 'static'], function() { });

// Default
gulp.task('default', ['dist'], function() {
  gulp.watch('styles/*.sass' , ['sass']);
  gulp.watch('templates/*.pug' , ['views']);
  gulp.watch('images/*.png' , ['png']);
  gulp.watch('images/*.svg' , ['svg']);
});
