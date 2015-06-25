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

var config = new Config();

//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del(["target"], cb);
});

// ------------------------------------------------------------------
// Build HTML
// ------------------------------------------------------------------

function buildHtml(watch) {
    var s = gulp.src(config.sourceHtml);
    s = watch ? watch(config.sourceHtml) : s;
    s = s.pipe(htmlmin({collapseWhitespace: true}));
    s = s.pipe(gulp.dest("target/html"));
    return s;
}

gulp.task('target:html', [], function () {
    return buildHtml(false);
});

function injectHtml(watch) {
    var sources = gulp.src([
        'target/javascript/**/*.js',
        'target/typescript/**/*.js',
        config.target + '/**/*.css'
    ], {read: false});

    var s = gulp.src("target/html/index.html");
    s = watch ? watch("target/html") : s;
    s = s.pipe(inject(sources));
    s = s.pipe(gulp.dest("target/htmlInjected"));
    return s;

}

gulp.task('target:injectHtml', [], function () {
    return injectHtml(false);
});


// ------------------------------------------------------------------
// Build JavaScript
// ------------------------------------------------------------------

function buildJavaScript(watch) {
    var s = gulp.src(config.sourceJavaScript);
    s = watch ? s.pipe(watch(config.sourceJavaScript)) : s;
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = s.pipe(gulp.dest("target/javascript"));
    return s;
}

gulp.task('target:javascript', function () {
    return buildJavaScript(false);
});

// ------------------------------------------------------------------
// Build TypeScript
// ------------------------------------------------------------------

var browserifyInitialized = false;

var browserifyOpts = assign({}, watchify.args, {
    entries: ["src/main.ts"],
    debug: true
});

var browserifyBundle = browserify(browserifyOpts).plugin('tsify', config.tsSettings);

browserifyBundle.on('log', gutil.log);


function buildTypeScript(watch) {
    if (!browserifyInitialized) {
        browserifyInitialized = true;
        if (watch) {
            browserifyBundle = watchify(browserifyBundle);
        }
    }

    return browserifyBundle.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("target/typescript"));
}
gulp.task('target:typescript', function () {
    return buildTypeScript(false);
});

// ------------------------------------------------------------------
// Build Script
// ------------------------------------------------------------------

function buildScript(watch) {
    var s = gulp.src([
        "target/javascript/**/*.js",
        "target/typescript/**/*.js"
    ]);
    s = watch ? s.pipe(watch([
        "target/javascript/**/*.js",
        "target/typescript/**/*.js"
    ])) : s;
    s = s.pipe(gulp.dest("target/script"));
    return s;
}

gulp.task('target:script', function () {
    return buildScript(false);
});


// ------------------------------------------------------------------
// BrowserSync
// ------------------------------------------------------------------

browserifyBundle.on('update', buildTypeScript);

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


    buildTypeScript(true);

    buildJavaScript(true);

    gulp.watch(config.sourceHtml, ["target:inject"]);
});

gulp.task('target', ["build:ts", "build:js", "build:html", "build:inject"], function () {
});

gulp.task('default', ["build"]);



