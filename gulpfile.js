var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');



//Default task
gulp.task('default',['lint','scripts','watch']);

//Lint task
gulp.task('lint',function(){
  return gulp.src('public/js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});


//Concat and Minify JS
gulp.task('scripts',function(){
   var dist = "public/js/dist";
   return gulp.src('public/js/*.js')
      .pipe(concat('combined.js'))
      .pipe(gulp.dest(dist))
      .pipe(rename('combined.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(dist));
});

//Watch task
gulp.task('watch',function(){
  return gulp.watch('public/js/*.js',['lint','scripts']);
});
