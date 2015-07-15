'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.vendor = [
            "bower_components/jquery/jquery.min.js",

            "bower_components/angular/angular.min.js",
            "bower_components/angular/README.md",

            "bower_components/bootstrap/dist/css/bootstrap.min.css",
            "bower_components/bootstrap/dist/js/bootstrap.min.js"
        ];

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.source = 'src';

        //this.typeScriptEntry = "main.js";

        this.scssFiles = [
            "**/*.scss",
            "**/!_*.scss"
        ];

        // ----------------------------------------------------------
        // TypeScript Settings
        // ----------------------------------------------------------

        this.tsSettings = {
            noEmitOnError: true,
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
