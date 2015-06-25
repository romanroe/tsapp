'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.source = 'src';
        this.sourceHtml = this.source + "/**/*.html";
        this.sourceJavaScript = this.source + "/**/*.js";

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
    }

    return GulpConfig;
})();
module.exports = GulpConfig;
