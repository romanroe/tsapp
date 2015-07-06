'use strict';

var fs = require('fs');
var del = require('del');
var merge = require('merge2');
var assign = require('lodash.assign');
var series = require('stream-series');
var sequence = require('run-sequence');

var gulp = require('gulp');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var browsersync = require('browser-sync');
var cache = require('gulp-cached');

var sass = require('gulp-sass');

var inject = require('gulp-inject');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var plumber = require('gulp-plumber');

var Config = require('./gulpfile.config');
var config = new Config();

var firstRun = true;
var developmentMode = false;
var abortBuild = false;

function checkAbortBuild() {
    if (abortBuild) {
        abortBuild = false;
        if (!firstRun) {
            return true;
        }
    }
    return false;
}

// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del([config.target], cb);
});

// ------------------------------------------------------------------
// Build Libraries
// ------------------------------------------------------------------

gulp.task('build:vendor', [], function () {
    var js = [];
    var css = [];
    var rest = [];
    config.vendor.forEach(function (elem) {
        if (elem.substr(-3) === ".js") {
            js.push(elem);
        } else if (elem.substr(-4) === ".css") {
            css.push(elem);
        } else {
            rest.push(elem);
        }
    });
    var streamJs = gulp.src(js)
        .pipe(debug({title: "Including vendor JS:"}))
        .pipe(concat("___v.js"))
        .pipe(gulp.dest(config.targetApp));

    var streamCss = gulp.src(css)
        .pipe(debug({title: "Including vendor CSS:"}))
        .pipe(concat("___v.css"))
        .pipe(gulp.dest(config.targetApp));

    var streamRest = gulp.src(rest)
        .pipe(debug({title: "Including vendor Asset:"}))
        .pipe(gulp.dest(config.targetApp + "/vendor"));

    return merge(streamJs, streamCss, streamRest);
});

// ------------------------------------------------------------------
// Build HTML
// ------------------------------------------------------------------

gulp.task('build:html', [], function () {
    var vendorStream = gulp.src(
        ["___v.js", "___v.css"],
        {read: false, cwd: config.targetApp});

    var jsCssStream = gulp.src([
        '**/*.js',
        '**/*.css',
        "!___v.js",
        "!___v.css",
        "!___t.js"
    ], {read: false, cwd: config.targetApp});

    var tsStream = gulp.src([
        "___t.js"
    ], {read: false, cwd: config.targetApp});

    var s = gulp.src(config.source + "/**/*.html");
    s = s.pipe(cache("html"));
    s = s.pipe(debug({title: "HTML:"}));
    s = s.pipe(inject(series(
        vendorStream,
        tsStream,
        jsCssStream
    ), {relative: false}));
    s = s.pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }));
    s = s.pipe(gulp.dest(config.targetApp));

    return s;
});


// ------------------------------------------------------------------
// Build CSS
// ------------------------------------------------------------------

gulp.task('build:css', function () {
    var scss = gulp.src(config.scssFiles, {cwd: config.source});
    scss = scss.pipe(cache("scss"));
    scss = developmentMode ? scss.pipe(sourcemaps.init()) : scss;
    scss = scss.pipe(sass().on('error', sass.logError));
    scss = developmentMode ? scss.pipe(sourcemaps.write()) : scss;
    scss = developmentMode ? scss.pipe(gulp.dest(config.targetApp)) : scss;

    var css = gulp.src(config.source + "/**/*.css");
    css = css.pipe(cache("css"));

    var both = merge(scss, css);
    both = both.pipe(debug({title: "CSS:"}));
    both = !developmentMode ? both.pipe(concat("___.css")) : both;
    both = both.pipe(gulp.dest(config.targetApp));
    return both;
});

// ------------------------------------------------------------------
// Build JavaScript
// ------------------------------------------------------------------

function buildJs() {
    var s = gulp.src(config.source + "/**/*.js");
    s = s.pipe(cache("js"));
    s = developmentMode ? s.pipe(sourcemaps.init()) : s;
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = developmentMode ? s.pipe(sourcemaps.write()) : s;
    s = s.pipe(debug({title: "JavaScript:"}));
    s = !developmentMode ? s.pipe(concat("___j.js")) : s;
    s = s.pipe(gulp.dest(config.targetApp));
    return s;
}

gulp.task('build:js', function () {
    return buildJs();
});


// ------------------------------------------------------------------
// Build TypeScript
// ------------------------------------------------------------------

var tsProject = ts.createProject('tsconfig.json');

var browserifyBundle;

gulp.task('build:ts', function () {
    if (developmentMode) {
        gulp.src(config.source + '/**/*.ts')
            .pipe(cache("lint:ts"))
            .pipe(tslint()).pipe(tslint.report('prose', {emitError: false}));
    }

    var tsResult = gulp.src('**/*.ts', {cwd: config.source});
    tsResult = tsResult.pipe(plumber(function () {
        abortBuild = true;
    }));

    tsResult = developmentMode ? tsResult.pipe(cache("ts")) : tsResult;
    tsResult = developmentMode ? tsResult.pipe(sourcemaps.init()) : tsResult;
    tsResult = tsResult.pipe(debug({title: "TypeScript:"}));
    tsResult = tsResult.pipe(ts(tsProject, undefined, ts.reporter.longReporter()));

    tsResult.js.pipe(ngAnnotate());

    if (developmentMode) {
        tsResult.pipe(sourcemaps.write());
    }

    return merge([
        tsResult.dts.pipe(gulp.dest(config.targetTmp + "/dts")),
        tsResult.js.pipe(gulp.dest(config.targetTmp + "/ts"))
    ]);
});


function buildTsBundle() {
    if (checkAbortBuild()) {
        return;
    }
    firstRun = false;

    if (!browserifyBundle) {
        var browserifyOpts = assign({}, watchify.args, {
            entries: [config.targetTmp + "/ts/" + config.typeScriptEntry],
            debug: developmentMode
        });
        browserifyBundle = browserify(browserifyOpts);
        browserifyBundle.on('log', gutil.log);

        if (developmentMode) {
            browserifyBundle = watchify(browserifyBundle);
        }
    }

    var bundle = browserifyBundle.bundle();
    bundle = bundle.on('error', function () {
        gutil.log("Error in Browserify. Clearing TypeScript caches.");
        fs.writeFileSync(config.targetApp + "/___t.js", "throw 'Browserify bundle was not created!';");
        delete cache.caches['ts'];
        delete cache.caches['lint:ts'];
        this.emit("end");
    });

    bundle = bundle.on('error', gutil.log.bind(gutil, 'Browserify Error'));
    bundle = bundle.pipe(source("___t.js"));
    bundle = bundle.pipe(buffer());
    bundle = developmentMode ? bundle.pipe(sourcemaps.init({loadMaps: true})) : bundle;
    bundle = bundle.pipe(uglify());
    bundle = developmentMode ? bundle.pipe(sourcemaps.write()) : bundle;
    bundle = bundle.pipe(gulp.dest(config.targetApp));
    return bundle;
}

gulp.task('build:tsBundle', ["build:ts"], function () {
    return buildTsBundle();
});

gulp.task('lint:ts', function () {
    return gulp.src(config.source + "/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

//browserifyBundle.on('update', buildTs);


// ------------------------------------------------------------------
// BrowserSync
// ------------------------------------------------------------------

gulp.task('browsersync', ["dev"], function () {
    return browsersync({
        open: false,
        server: {
            baseDir: [config.targetApp]
        },
        port: 9999,
        files: [
            config.target + '/**/*.js',
            config.target + '/**/*.html',
            config.target + '/**/*.css',
            config.target + '/**/*.svg',
            config.target + '/**/*.png',
            config.target + '/**/*.jpg',
            config.target + '/**/*.gif',
            "!" + config.target + '/tmp/**/*'
        ]
    });
});

// ------------------------------------------------------------------
// Start Tasks
// ------------------------------------------------------------------

gulp.task('watch', ["browsersync"], function () {
    developmentMode = true;
    gulp.watch("src/**/*.ts", ["build:tsBundle"]);


    gulp.watch("src/**/*.js", ["build:js"]);
    gulp.watch("src/**/*.html", ["build:html"]);
    gulp.watch("src/**/*.scss", ["build:css"]);
});

gulp.task('dev', function (callback) {
    developmentMode = true;
    sequence(
        "clean",
        ["build:vendor", "build:js", "build:tsBundle", "build:css"],
        "build:html",
        callback);
});

gulp.task('dist', function (callback) {
    sequence(
        "clean",
        ["build:vendor", "build:js", "build:tsBundle", "build:css"],
        "build:html",
        callback);
});

gulp.task('default', ["dist"]);



