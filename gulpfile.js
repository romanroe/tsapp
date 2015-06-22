'use strict';

var gulp = require('gulp');
//var debug = require('gulp-debug');
//var inject = require('gulp-inject');
var ts = require('gulp-typescript');
//var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var merge = require('merge2');
var Config = require('./gulpfile.config');
//var gutil = require('gulp-util');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

var config = new Config();

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
//gulp.task('gen-ts-refs', function () {
//    var target = gulp.src(config.appTypeScriptReferences);
//    var sources = gulp.src([config.allTypeScript], {read: false});
//    return target.pipe(inject(sources, {
//        starttag: '//{',
//        endtag: '//}',
//        transform: function (filepath) {
//            return '/// <reference path="../..' + filepath + '" />';
//        }
//    })).pipe(gulp.dest(config.typings));
//});

/**
 * Lint all custom TypeScript files.
 */
//gulp.task('ts-lint', function () {
//    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
//});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
//gulp.task('compile-ts', function () {
//    var sourceTsFiles = [
//        config.allTypeScript,                       // path to typescript files
//        config.libraryTypeScriptDefinitions,        // reference to library .d.ts files
//        config.appTypeScriptReferences              // reference to app.d.ts files
//    ];
//
//    var tsResult = gulp.src(sourceTsFiles)
//        .pipe(sourcemaps.init())
//        .pipe(tsc({
//            target: 'ES5',
//            declarationFiles: false,
//            noExternalResolve: true
//        }));
//
//    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
//    return tsResult.js
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest(config.tsOutputPath));
//});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
//gulp.task('clean-ts', function (cb) {
//    var typeScriptGenFiles = [config.tsOutputPath,            // path to generated JS files
//        config.sourceApp + '**/*.js',    // path to all JS files auto gen'd by editor
//        config.sourceApp + '**/*.js.map' // path to all sourcemap files auto gen'd by editor
//    ];
//
//     delete the files
//del(typeScriptGenFiles, cb);
//});

//gulp.task('watch', function () {
//    gulp.watch([config.allTypeScript], ['ts-lint', 'compile-ts', 'gen-ts-refs']);
//});
//
//gulp.task('default', ['ts-lint', 'compile-ts', 'gen-ts-refs', 'watch']);


// ------------------------------------------------------------------
// TypeScript project
// ------------------------------------------------------------------
var tsProject = ts.createProject({
    target: 'ES5',
    declarationFiles: true,
    noExternalResolve: true,
    sortOutput: false
});


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
// compile JavaScript
// ------------------------------------------------------------------
gulp.task('compile-js', function () {
    var sourceJsFiles = [
        config.allJavaScript
    ];

    var result = gulp
        .src(sourceJsFiles)
        .pipe(sourcemaps.init());
        //.pipe(ngAnnotate());

    return result;
});

// ------------------------------------------------------------------
// compile TypeScript
// ------------------------------------------------------------------
gulp.task('compile-ts', function () {
    var sourceTsFiles = [
        config.allTypeScript,
        config.libraryTypeScriptDefinitions
    ];

    var tsResult = gulp
        .src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject, undefined, ts.reporter.longReporter()));

    //return merge([
    tsResult.dts
        .pipe(gulp.dest(config.tsOutputPathDts));//,

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.outputPathJs));
    //]);
});


gulp.task('watch', function () {
    gulp.watch([config.allSourceFiles], ['compile-ts']);
});

gulp.task('default', ['compile-ts', 'watch']);
