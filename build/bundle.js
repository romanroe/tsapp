!function r(e,n,o){function t(i,c){if(!n[i]){if(!e[i]){var f="function"==typeof require&&require;if(!c&&f)return f(i,!0);if(u)return u(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var a=n[i]={exports:{}};e[i][0].call(a.exports,function(r){var n=e[i][1][r];return t(n?n:r)},a,a.exports,r,e,n,o)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<o.length;i++)t(o[i]);return t}({1:[function(r,e,n){var o=function(){function r(){}return r.prototype.methodA=function(){return 111},r.prototype.methodB=function(){return 2},r}();n.MyService=o;var t=function(){function r(r){this.value=r.methodA()}return r.$inject=["myService"],r}();n.MyController=t},{}],2:[function(r,e,n){var o=r("./Customer");angular.module("app",[]).service("myService",o.MyService).controller("MyController",o.MyController),console.log("hello ww")},{"./Customer":1}]},{},[2]);
//# sourceMappingURL=bundle.js.map