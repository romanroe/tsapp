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
var webpack = require("webpack");

var config = new Config();

//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del([config.target], cb);
});

// ------------------------------------------------------------------
// Build HTML
// ------------------------------------------------------------------

function buildHtml() {
    //var sources = gulp.src([
    //    config.target + '/**/*.js',
    //    config.target + '/**/*.css'
    //], {read: false});

    var s = gulp.src(config.sourceHtml);
    s = s.pipe(cache("html"));
    //s = s.pipe(inject(sources));
    s = s.pipe(htmlmin({collapseWhitespace: true}));
    s = s.pipe(gulp.dest(config.targetApp));
    return s;
}

gulp.task('build:html', ["build:ts", "build:js"], function () {
    return buildHtml();
});


// ------------------------------------------------------------------
// Build JavaScript
// ------------------------------------------------------------------

function buildJs() {
    var s = gulp.src(config.sourceJavaScript);
    s = s.pipe(cache("js"));
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = s.pipe(gulp.dest(config.targetJs));
    return s;
}

gulp.task('build:js', function () {
    return buildJs();
});


// ------------------------------------------------------------------
// Build TypeScript
// ------------------------------------------------------------------

var tsProject = ts.createProject({
    declarationFiles: false,
    noExternalResolve: false,
    module: "commonjs"
});

gulp.task('build:ts', function () {
    var tsResult = gulp.src(config.sourceTypeScript)
        .pipe(cache("ts"))
        .pipe(ts(tsProject));

    tsResult.js
        .pipe(ngAnnotate())
        //.pipe(uglify())
    ;

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest(config.targetJs)),
        tsResult.js.pipe(gulp.dest(config.targetJs))
    ]);
});


// ------------------------------------------------------------------
// Webpack
// ------------------------------------------------------------------

function buildBundle(watch) {
    return webpack({
        watch: watch == true,
        entry: config.targetJs + "/" + config.webpackEntry,
        output: {
            path: __dirname + "/" + config.targetApp,
            filename: config.webpackEntry
        }
    }, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        //gutil.log("[webpack]", stats.toString({}));
    });
}

gulp.task('build:bundle', [], function () {
    return buildBundle();
});

// ------------------------------------------------------------------
// BrowserSync
// ------------------------------------------------------------------

gulp.task('browsersync', ["build"], function () {
    browsersync({
        open: false,
        server: {
            baseDir: [config.targetApp]
        },
        port: 9999,
        files: [
            config.targetApp + '/**/*'
        ]
    });
});

// ------------------------------------------------------------------
// Start Tasks
// ------------------------------------------------------------------

gulp.task('watch', ["browsersync"], function () {

    gulp.watch("src/**/*.ts", ["build:ts"]);
    gulp.watch("src/**/*.js", ["build:js"]);
    gulp.watch("src/**/*.html", ["build:html"]);

    buildBundle(true);
});

gulp.task('build', ["build:js", "build:ts", "build:html"], function () {
});

gulp.task('dist', ['clean'], function () {
});

gulp.task('default', ["watch"]);



