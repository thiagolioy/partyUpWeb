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
var streamqueue  = require('streamqueue');
var concat = require("gulp-concat");



//Default task
gulp.task('default',['lint','jsmin','htmlmin','clean']);

//Lint task
gulp.task('lint',function(){
  return gulp.src('public/js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('alljs', function() {
  return streamqueue({ objectMode: true },
             gulp.src("public/js/dist/vendors.js"),
             gulp.src("public/js/dist/combined*.js"))
             .pipe(concat("all.js"))
            // .pipe(uglify())
             .pipe(gulp.dest("./public/js/dist/"));
});

gulp.task('vjsmin', function() {
  var DIR = "public/bower_components/";
  var jquery = DIR+"jquery/dist/jquery.js";//has min
  var foundation = DIR+"foundation/js/foundation.js"; //has min
  var fdtDatepicker = DIR+"foundation-datepicker/js/*.js";
  var respTables = DIR+"responsive-tables/*.js";
  var parseSdk = DIR+"parse/parse.js"; //has min
  var moment = DIR+"moment/*.js";
  var gMaps = DIR+"gmaps.js/gmaps.js";

  return streamqueue({ objectMode: true },
             gulp.src(jquery),
             gulp.src(foundation),
             gulp.src(fdtDatepicker),
             gulp.src(respTables),
             gulp.src(parseSdk),
             gulp.src(moment))
            //  gulp.src(gMaps))
             .pipe(concat("vendors.js"))
            // .pipe(uglify())
             .pipe(gulp.dest("./public/js/dist/"));
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
        // .pipe(uglify())
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
  del(['./cloud/views/dist/dist',
      './public/bower_components',
      './public/js/dist/vendors*.js',
      './public/js/dist/combined*.js'
      ], cb);
});

//Watch task
gulp.task('watch',function(){
  gulp.watch('public/js/*.js',['lint','jsmin']);
  gulp.watch('./cloud/views/*.ejs',['htmlminclean']);
});
