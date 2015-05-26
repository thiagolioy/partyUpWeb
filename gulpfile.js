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
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var shell = require('gulp-shell');
var concatCss = require('gulp-concat-css');


//Default task
gulp.task('default',['bwinstall','watch']);


//Lint task
gulp.task('lint',function(){
  return gulp.src('public/js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

//js Tasks
gulp.task('alljs', function() {
  var DIR = "public/bower_components/";
  var jquery = DIR+"jquery/dist/jquery.js";//has min
  var foundation = DIR+"foundation/js/foundation.js"; //has min
  var fdtDatepicker = DIR+"foundation-datepicker/js/*.js";
  var respTables = DIR+"responsive-tables/*.js";
  var parseSdk = DIR+"parse/parse.js"; //has min
  var moment = DIR+"moment/*.js";
  var gMaps = DIR+"gmaps.js/gmaps.js";

  var customJs = "public/js/dist/combined*.js";

  return streamqueue({ objectMode: true },
             gulp.src(jquery),
             gulp.src(foundation),
             gulp.src(fdtDatepicker),
             gulp.src(respTables),
             gulp.src(parseSdk),
             gulp.src(moment),
             gulp.src(customJs),
             gulp.src(gMaps))
             .pipe(concat("all.min.js"))
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

//css tasks
gulp.task('allcss', function() {
  var DIR = "public/bower_components/";
  var normalize = DIR+"foundation/css/normalize.css";
  var foundation = DIR+"foundation/css/foundation.css";
  var fdtDatepicker = "public/stylesheets/foundation.datepicker.css";
  var fontawesome = "public/stylesheets/font-awesome.css";
  var animatecss = DIR+"animate.css/animate.css";
  var respTables = DIR+"responsive-tables/responsive-tables.css";
  var custom = "public/stylesheets/custom.css";

  return streamqueue({ objectMode: true },
             gulp.src(normalize),
             gulp.src(foundation),
             gulp.src(fdtDatepicker),
             gulp.src(fontawesome),
             gulp.src(animatecss),
             gulp.src(respTables),
             gulp.src(custom))
             .pipe(concatCss("all.min.css"))
             .pipe(cssmin())
             .pipe(gulp.dest("./public/stylesheets/dist/"));
});

//Html tasks
gulp.task('htmlmin', function() {
  var dist = './cloud/views/dist';
  return gulp.src('./cloud/views/**/*.ejs')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist));
});


//Image tasks
gulp.task('imgmin', function () {
    return gulp.src('public/imgs/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/imgs/dist'));
});

//Clean tasks
gulp.task('clean', function (cb) {
  del(['./cloud/views/dist/dist',
      './public/js/dist/combined*.js'
      ], cb);
});

gulp.task('cleanbower', function (cb) {
  del(['./public/bower_components'], cb);
});

//Watch tasks
gulp.task('watch',function(){
  gulp.watch('public/js/*.js',["watchjs"]);
  gulp.watch('./cloud/views/*.ejs',['watchhtml']);
  gulp.watch('public/stylesheets/*.css',['allcss']);
});

gulp.task('watchjs', function(callback) {
  runSequence('lint',
              'jsmin',
              'alljs',
              callback);
});

gulp.task('watchhtml', function(callback) {
  runSequence('htmlmin',
              callback);
});

//Shell Tasks
gulp.task('bwinstall', shell.task(['bower install']));

gulp.task('upToParse', shell.task(['parse deploy']));

gulp.task('deploy', function (callback) {
  runSequence('imgmin',
              'clean',
              'cleanbower',
              'upToParse',
              callback);
})
