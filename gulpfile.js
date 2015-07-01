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
    var sources = gulp.src([
        config.target + '/**/*.js',
        config.target + '/**/*.css'
    ], {read: false}, {relative: true});

    var s = gulp.src(config.sourceHtml);
    s = s.pipe(cache("js"));
    s = s.pipe(inject(sources));
    s = s.pipe(htmlmin({collapseWhitespace: true}));
    s = s.pipe(gulp.dest(config.target));
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
    s = s.pipe(gulp.dest(config.target));
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
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(cache("ts"))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('tmpTsD')),
        tsResult.js
            .pipe(gulp.dest('tmpTs'))
    ]);
});

var browserifyOpts = assign({}, watchify.args, {
    entries: ["tmpTs/main.js"],
    debug: true
});

var browserifyBundle = browserify(browserifyOpts);//.plugin('tsify', config.tsSettings);

browserifyBundle.on('log', gutil.log);

function buildTsBundle() {
    return browserifyBundle.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.target));
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

    browserifyBundle = watchify(browserifyBundle);

    gulp.watch("src/**/*.ts", ["build:tsBundle"]);
    gulp.watch("src/**/*.js", ["build:js"]);
    gulp.watch("src/**/*.html", ["build:html"]);
    //gulp.watch("src/**/*", ["build"]);
});

gulp.task('build', ["build:js", "build:ts", "build:html"], function () {
});

gulp.task('dist', ['clean'], function () {
});

gulp.task('default', ["watch"]);



