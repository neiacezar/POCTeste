var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jsImport = require('gulp-js-import');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var browserSync = require('browser-sync');

// gulp.task('browser-sync', function() {
//   browserSync({
//     server: {
//        baseDir: "./"
//     }
//   });
// });

gulp.task('browser-sync', function() {
  var files = [
			'**/*.php',
			'**/*.{png,jpg,gif,svg}'
      ];
	browserSync.init(files, {
		proxy: "schin.localhost:8888",
    notify: false,
		injectChanges: true
	});
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('styles', function(){
  gulp.src(['resources/assets/site/less/**/styles.less'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/assets/site/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/site/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('resources/assets/site/js/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jsImport())
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/site/js/'))
    .pipe(concat('all.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/assets/site/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts-vendor', function(){
  return gulp.src('resources/assets/site/vendor/vendor.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jsImport())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/assets/site/js/'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/assets/site/js/'))
    .pipe(browserSync.reload({stream:true}))
});

// Watch
gulp.task('site', ['browser-sync'], function(){
  gulp.watch("resources/assets/site/less/**/*.less", ['styles']);
  gulp.watch("resources/assets/site/js/**/*.js", ['scripts']);
  gulp.watch("resources/assets/site/vendor/**/*.js", ['scripts-vendor']);
  gulp.watch("*.html", ['bs-reload']);
});