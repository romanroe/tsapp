
require("./angular.js");
angular.module("app", []);

//require("./style.scss");

require("./CustomerService");
var CustomerController = require("./CustomerController");

angular.module("app")
    //.service("customerService", CustomerService)
    .controller("MyController", CustomerController);

require("./oldjs2.js");
require("./oldjs1.js");

//require("./gen/ts/f199");

