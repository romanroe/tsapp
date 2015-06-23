'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        this.source = './src/';
        this.allJavaScript = this.source + '/**/*.js';
        this.allTypeScript = this.source + '/**/*.ts';

        this.tsSettings = {
            noImplicitAny: true
        };

        //this.typings = './typings/';
        //this.libraryTypeScriptDefinitions = './typings/**/*.ts';

        this.build = './build/';
        this.buildJs = this.build + '/js';
    }

    return GulpConfig;
})();
module.exports = GulpConfig;
