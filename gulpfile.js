var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var header = require('gulp-header');


//Default task
gulp.task('default', function() {
  // place code for your default task here
});

//Lint task
gulp.task('lint',function(){
  return gulp.src('public/js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});
