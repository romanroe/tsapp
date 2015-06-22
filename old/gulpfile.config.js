'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        this.source = './src/';
        //this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.source + '/**/*.ts';


        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/**/*.ts';
        this.appTypeScriptReferences = this.typings + 'typescriptApp.d.ts';


        this.build = './build/';
        this.tsOutputPath = this.build + '/js';

    }

    return GulpConfig;
})();
module.exports = GulpConfig;
