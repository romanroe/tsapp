'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.source = 'src';
        this.sourceHtml = this.source + "/**/*.html";
        this.sourceJavaScript = this.source + "/**/*.js";
        this.sourceTypeScript = this.source + "/**/*.ts";

        this.webpackEntry = "main.js";

        // ----------------------------------------------------------
        // TypeScript Settings
        // ----------------------------------------------------------

        this.tsSettings = {
            noImplicitAny: true
        };

        // ----------------------------------------------------------
        // Output
        // ----------------------------------------------------------

        this.target = 'target';
        this.targetJs = this.target + "/js";
        this.targetApp = this.target + "/app";

    }

    return GulpConfig;
})();
module.exports = GulpConfig;
