var gulp = require('gulp');
var rename = require('gulp-rename');
var qunit = require('gulp-qunit');


gulp.task('qunit', function () {
  return gulp
    .src('src/content/test/index.html')
  ;
});

gulp.task('test', "qunit");

