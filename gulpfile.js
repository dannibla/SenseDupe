var gulp = require('gulp');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');

gulp.task('default', function () {
    return gulp.src('./css/index.css')
        .pipe(concat('main.css'))
        .pipe(uncss({
            html: ['index.html', 'views/*.html']
        }))
        .pipe(gulp.dest('./dist/css'));
});