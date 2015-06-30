
angular.module("app").controller("MyController2", function (customerService) {

    this.value = customerService.methodB();

});



