
angular.module("app", []);


require("app");

require("./legacy/oldjs2");


var customer = require("./customer/Customer");
var car = require("./customer/Car");



angular.module("app")
    .service("myService", customer.MyService)
    .controller("MyController", customer.MyController)
    .controller("MyController2", car.MyController2)
;

