
angular.module("app").controller("MyController2", function (myService) {

    this.value = myService.methodB();

    console.log(1);


});



