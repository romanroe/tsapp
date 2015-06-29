
require("script!./angular.js");

var CustomerService = require("./CustomerService");
var CustomerController = require("./CustomerController");


angular.module("app", [])
    .service("myService", CustomerService)
    .controller("MyController", CustomerController);

require("script!./oldjs1.js");
require("script!./oldjs2.js");

