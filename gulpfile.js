const gulp = require('gulp')
const concat = require('gulp-concat')

function bundle() {
    return gulp.src('src/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('.'));
}

exports.default = bundle