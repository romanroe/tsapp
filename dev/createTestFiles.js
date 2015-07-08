'use strict';

var fs = require("fs");


var fileCount = 20;
var classesCount = 4;


for (var fileI = 1000; fileI < (1000 + fileCount); fileI++) {
    var content = "";
    if (fileI > 1000) {
        content = "import f" + (fileI - 1) + " = require(\"./f" + (fileI - 1) + "\");\n\n";

        for (var importClassI = 0; importClassI < classesCount; importClassI++) {
            content += "var c" + (fileI - 1) + "a" + importClassI + " = new f" + (fileI - 1) + ".C" + (fileI - 1) + "X" + importClassI + "();\n\n";
        }

    }

    for (var classI = 0; classI < classesCount; classI++) {
        content += "export class C" + fileI + "X" + classI + " {\n";
        content += "}\n\n";
    }

    fs.writeFileSync("src/gen/f" + fileI + ".ts", content);

}



