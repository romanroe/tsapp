'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.libraries = [
            "bower_components/angular/angular.min.js",

            "bower_components/bootstrap/dist/css/bootstrap.min.css",
            "bower_components/bootstrap/dist/js/bootstrap.min.js"
        ];

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.source = 'src';

        this.typeScriptEntry = "main.js";

        // ----------------------------------------------------------
        // TypeScript Settings
        // ----------------------------------------------------------

        this.tsSettings = {
            declarationFiles: false,
            noExternalResolve: false,
            noImplicitAny: false,
            module: "commonjs"
        };

        // ----------------------------------------------------------
        // Output
        // ----------------------------------------------------------

        this.target = "target";

        this.targetTmp = this.target + "/tmp";

        this.targetApp = this.target + "/app";

    }

    return GulpConfig;
})();
module.exports = GulpConfig;
