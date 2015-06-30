class CustomerService {

    methodA():number {
        return 1;
    }

    methodB():number {
        return 3;
    }

}

export = CustomerService;


//declare var angular;
/// <reference path="../typings/angularjs/angular.d.ts" />

angular.module("app")
    .service("customerService", CustomerService);


