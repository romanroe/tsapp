/// <reference path="../typings/angularjs/angular"/>

import customer = require("./customer/Customer");
import car = require("./customer/Car");


angular.module("app", [])
    .service("myService", customer.MyService)
    .controller("MyController", customer.MyController)
    .controller("MyController2", car.MyController2);

