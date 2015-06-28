'use strict';

var fs = require("fs");


for (var fileI = 0; fileI < 200; fileI++) {
    var content = "";
    if (fileI > 0) {
        content = "import f" + (fileI - 1) + " = require('./f" + (fileI - 1) + "');\n\n";

        for (var importClassI = 0; importClassI < 10; importClassI++) {
            content += "var c" + (fileI - 1) + "_" + importClassI + " = new f" + (fileI - 1) + ".C" + (fileI - 1) + "_" + importClassI + "();\n\n";
        }

    }

    for (var classI = 0; classI < 10; classI++) {
        content += "export class C" + fileI + "_" + classI + "{\n";
        content += "}\n\n";
    }

    fs.writeFileSync("src/gen/ts/f" + fileI + ".ts", content);

}



