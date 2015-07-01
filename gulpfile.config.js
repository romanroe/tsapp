'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        this.source = 'src';

        this.browserifyMain = "main.js";

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
