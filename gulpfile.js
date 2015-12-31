var gulp = require('gulp');
var coffee = require('gulp-coffee');
var runSequence = require('run-sequence');
var shell = require('gulp-shell')
var less = require('gulp-less');
var path = require('path');

gulp.task('build', function(cb) {
    runSequence('build-coffee', 'build-less', cb);
})

gulp.task('build-coffee', function() {
    return gulp.src('./coffee/**/*.coffee')
        .pipe(coffee({ bare: true}))
        .pipe(gulp.dest('./coffee/'))
});

gulp.task('build-less', function() {
    return gulp.src('./styles/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'styles') ]
        }))
        .pipe(gulp.dest('./styles/'));
});
