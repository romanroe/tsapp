/// <reference path="../typings/angularjs/angular"/>

import customer = require("./Customer");
import f99 = require("./f99");

console.log(f99);

angular.module("app", [])
    .service("myService", customer.MyService)
    .controller("MyController", customer.MyController);

console.log("3");
console.log("3");
console.log("3");
console.log("3");
console.log("3");
console.log("3");
console.log("3");
console.log("3");
console.log("3");
