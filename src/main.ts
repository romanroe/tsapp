/// <reference path="../typings/angularjs/angular"/>

import customer = require("./customer/Customer");
import car = require("./customer/Car");

//import gen = require("./gen/f1019");
//console.log(gen.C1019X3);


angular.module("app", [])
    .service("myService", customer.MyService)
    .controller("MyController", customer.MyController)
    .controller("MyController2", car.MyController2);



