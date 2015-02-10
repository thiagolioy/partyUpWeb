var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');


//Default task
gulp.task('default',['lint','jsmin','htmlmin','clean']);

//Lint task
gulp.task('lint',function(){
  return gulp.src('public/js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('jsmin', function() {

  var bundler = browserify('./public/js/index.js');

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('combined.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
      // .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js/dist/'));
  };

  return bundle();
});

//Minify Html and clean
gulp.task('htmlminclean', function(callback) {
  runSequence('htmlmin',
              'clean',
              callback);
});


//Minify Html
gulp.task('htmlmin', function() {
  var dist = './cloud/views/dist';
  return gulp.src('./cloud/views/**/*.ejs')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist));
});

//Clean
gulp.task('clean', function (cb) {
  del(['./cloud/views/dist/dist'], cb);
});

//Watch task
gulp.task('watch',function(){
  gulp.watch('public/js/*.js',['lint','jsmin']);
  gulp.watch('./cloud/views/*.ejs',['htmlminclean']);
});
