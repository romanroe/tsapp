'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Vendor
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

        this.scssFiles = [
            "**/*.scss",
            "**/!_*.scss"
        ];

        // ----------------------------------------------------------
        // SystemJS
        // ----------------------------------------------------------

        this.systemImportMain = "app";

        this.systemJSConfig = {
            baseURL: '',
            defaultJSExtensions: true
        };


        // ----------------------------------------------------------
        // Output
        // ----------------------------------------------------------

        this.target = "target";

        this.targetApp = this.target + "/app";

    }

    return GulpConfig;
})();
module.exports = GulpConfig;
