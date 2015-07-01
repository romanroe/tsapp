'use strict';

var gulp = require('gulp');
//var debug = require('gulp-debug');
var inject = require('gulp-inject');
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
var es = require('event-stream');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var typescript = require('gulp-typescript');

var config = new Config();

//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

var developmentMode = false;

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del([config.target], cb);
});

// ------------------------------------------------------------------
// Build HTML
// ------------------------------------------------------------------

gulp.task('build:html', [], function () {
    var s = gulp.src(config.source + "/**/*.html");
    s = s.pipe(cache("html"));
    s = s.pipe(gulp.dest(config.targetApp));
    return s;
});

gulp.task('build:htmlBundle', ["build:html", "build:tsBundle", "build:js"], function () {
    var sources = gulp.src([
        config.targetApp + '/**/*.js',
        config.targetApp + '/**/*.css'
    ], {read: false});

    var s = gulp.src(config.targetApp + "/**/*.html");
    s = s.pipe(cache("htmlBundle"));
    s = s.pipe(inject(sources, {relative: true}));
    s = s.pipe(htmlmin({collapseWhitespace: true}));
    s = s.pipe(gulp.dest(config.targetApp));
    return s;
});


// ------------------------------------------------------------------
// Build JavaScript
// ------------------------------------------------------------------

function buildJs() {
    var s = gulp.src(config.source + "/**/*.js");
    s = s.pipe(cache("js"));
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = s.pipe(gulp.dest(config.targetApp));
    return s;
}

gulp.task('build:js', function () {
    return buildJs();
});


// ------------------------------------------------------------------
// Build TypeScript
// ------------------------------------------------------------------

var tsProject = ts.createProject(config.tsSettings);

gulp.task('build:ts', function () {
    var tsResult = gulp.src(config.source + '/**/*.ts')
        .pipe(cache("ts"))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.js.pipe(ngAnnotate());

    tsResult.pipe(sourcemaps.write());

    return merge([
        tsResult.dts.pipe(gulp.dest(config.targetTmp + "/djs")),
        tsResult.js.pipe(gulp.dest(config.targetTmp + "/js"))
    ]);
});

var browserifyOpts = assign({}, watchify.args, {
    entries: [config.targetTmp + "/js/" + config.browserifyMain],
    debug: true
});

var browserifyBundle = browserify(browserifyOpts);

browserifyBundle.on('log', gutil.log);

function buildTsBundle() {
    return browserifyBundle.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(config.browserifyBundle))
        .pipe(buffer())
        //.pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(ngAnnotate())
        .pipe(uglify())
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.targetApp));
}

gulp.task('build:tsBundle', ["build:ts"], function () {
    return buildTsBundle();
});

//browserifyBundle.on('update', buildTs);

// ------------------------------------------------------------------
// BrowserSync
// ------------------------------------------------------------------

gulp.task('browsersync', ["build"], function () {
    browsersync({
        open: false,
        server: {
            baseDir: [config.target]
        },
        port: 9999,
        files: [
            config.target + '/**/*.js',
            config.target + '/**/*.html',
            config.target + '/**/*.css',
            config.target + '/**/*.svg',
            config.target + '/**/*.png',
            config.target + '/**/*.jpg',
            config.target + '/**/*.gif'
        ]
    });
});

// ------------------------------------------------------------------
// Start Tasks
// ------------------------------------------------------------------

gulp.task('watch', ["browsersync"], function () {
    developmentMode = true;
    browserifyBundle = watchify(browserifyBundle);

    gulp.watch("src/**/*.ts", ["build:tsBundle"]);
    gulp.watch("src/**/*.js", ["build:js"]);
    gulp.watch("src/**/*.html", ["build:htmlBundle"]);
});

gulp.task('build', ["build:js", "build:tsBundle", "build:htmlBundle"], function () {
});

gulp.task('dist', ['clean'], function () {
});

gulp.task('default', ["watch"]);



