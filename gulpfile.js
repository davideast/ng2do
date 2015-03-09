var gulp = require('gulp');
var connect = require('gulp-connect');
var shell = require('gulp-shell');
var open = require('gulp-open');
var port = 3456;

// Angular 2 Traceur: ES6 to ES5
gulp.task('build:ng2', shell.task(['sh build.sh']));

gulp.task('default', ['build:ng2']);

gulp.task('connect', function() {
  connect.server({
    root: '.',
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


gulp.task('serve', ['connect', 'open']);
