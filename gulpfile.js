// Libraries
var gulp = require('gulp'),
  fs = require('fs'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass');

// Load data
var apps = JSON.parse(fs.readFileSync('./apps.json'));

// Compile views
gulp.task('views', function() {
  return gulp.src('templates/index.pug')
    .pipe(pug({
      data: {
        apps: apps
      }
    }))
    .pipe(gulp.dest('./build'));
});

// Compile CSS
gulp.task('sass', function () {
  return gulp.src('./styles/*.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});



// Default
gulp.task('default', ['views', 'sass'], function() {
  gulp.watch('styles/*.sass' , ['sass']);
  gulp.watch('templates/*.pug' , ['views']);
});
