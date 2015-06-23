'use strict';

var gulp = require('gulp');
//var debug = require('gulp-debug');
//var inject = require('gulp-inject');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
//var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var merge = require('merge2');
var Config = require('./gulpfile.config');
//var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

var config = new Config();

//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    var typeScriptGenFiles = [
        config.build
    ];
    del(typeScriptGenFiles, cb);
});

// ------------------------------------------------------------------
// Browserify
// ------------------------------------------------------------------

var browserifyOpts = assign({}, watchify.args, {
    entries: [],
    debug: true
});
var browserifyBundle = watchify(
    browserify(browserifyOpts)
        .add("src/main.ts")
        .plugin('tsify', config.tsSettings)
);

browserifyBundle.on('log', gutil.log);

function browserifyWatch() {
    return browserifyBundle.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.build));
}

// ------------------------------------------------------------------
// HTML
// ------------------------------------------------------------------

gulp.task('html', function () {
    console.log("build html");
    return gulp.src('src/*.html')
        .pipe(gulp.dest(config.build));
});

// ------------------------------------------------------------------
// Watch
// ------------------------------------------------------------------


browserifyBundle.on('update', browserifyWatch);

gulp.task('watchHTML', ['html'], function () {
    return watch('src/*.html', ['html']);
});

gulp.task('watchTS', function () {
    return browserifyWatch();
});

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------

gulp.task('default', ['watchHTML, watchTS']);

