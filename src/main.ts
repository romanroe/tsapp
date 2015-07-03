/// <reference path="../typings/angularjs/angular"/>

import customer = require("./customer/Customer");
import oldjs1 = require("./customer/oldjs1");


angular.module("app", [])
    .service("myService", customer.MyService)
    .controller("MyController", customer.MyController)
    .controller("MyController2", oldjs1.MyController2)
;



