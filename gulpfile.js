let gulp = require('gulp');
let sass = require('gulp-sass');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');

let paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function () {
  gulp.watch('./www/**/*.scss', ['sass']);
});
