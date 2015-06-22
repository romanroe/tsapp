window.test = "global var";

angular.module("MyMod").controller("MyCtrl", ["$scope", "$timeout", function ($scope, $timeout) {
}]);
