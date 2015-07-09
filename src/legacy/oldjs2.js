
angular.module("app").controller("MyController3", function (myService) {
    this.value = myService.methodB();

    this.onChange = function(firstname) {
        console.log(firstname);
    };

    this.onClick = function(firstname) {
        console.log("onClick");
    };

});


console.log("fjsdkfldsjfklds");
