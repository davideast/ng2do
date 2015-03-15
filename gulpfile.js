var gulp = require('gulp');
var connect = require('gulp-connect');
var shell = require('gulp-shell');
var open = require('gulp-open');
var concat = require('gulp-concat');
var html2js = require('gulp-html2js');
var port = 3456;

// git clone Angular 2 quickstart
gulp.task('build:ng2', shell.task(['sh build.sh']));

gulp.task('default', ['build:ng2']);

gulp.task('connect', function() {
  connect.server({
    root: __dirname,
    port: port,
    livereload: true
  });
});

gulp.task('open', function(){
  var options = {
    url: 'http://localhost:' + port,
  };
  gulp.src('./index.html')
  .pipe(open('', options));
});

gulp.task('scripts', function() {
  gulp.src('fixtures/*.html')
    .pipe(html2js({
      outputModuleName: 'template-test',
      useStrict: true
    }))
    .pipe(concat('template.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('serve', ['connect', 'open']);
