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
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var htmlmin = require('gulp-htmlmin');
var browsersync = require('browser-sync');

var config = new Config();

//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del([config.build], cb);
});

// ------------------------------------------------------------------
// Browserify
// ------------------------------------------------------------------

var browserifyOpts = assign({}, watchify.args, {
    entries: ["src/main.ts"],
    debug: true
});

var browserifyBundle = browserify(browserifyOpts).plugin('tsify', config.tsSettings);

browserifyBundle.on('log', gutil.log);

function browserifyWatchTrigger() {
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
// Build
// ------------------------------------------------------------------

gulp.task('build:html', function () {
    return gulp.src(config.sourceHtml)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.build))
});

gulp.task('build:js', function () {
    return gulp.src(config.sourceJavaScript)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(config.build))
});

gulp.task('build:ts', function () {
    browserifyWatchTrigger();
});

gulp.task('build', ["build:ts", "build:html"], function () {
});

// ------------------------------------------------------------------
// Watch
// ------------------------------------------------------------------

browserifyBundle.on('update', browserifyWatchTrigger);

gulp.task('browsersync', ['build'], function () {
    browsersync({
        open: false,
        server: {
            baseDir: [config.build]
        },
        port: 9999,
        files: [
            config.build + '**/*.js',
            config.build + '**/*.html',
            config.build + '**/*.css',
            config.build + '**/*.svg',
            config.build + '**/*.png',
            config.build + '**/*.jpg',
            config.build + '**/*.gif'
        ]
    });
});

gulp.task('watch', ["browsersync"], function () {
    browserifyBundle = watchify(browserifyBundle);
    browserifyWatchTrigger();
    gulp.watch(config.sourceHtml, ['build:html']);
});


// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------

gulp.task('default', ["watch"]);

