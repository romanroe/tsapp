!function o(e,r,n){function t(c,u){if(!r[c]){if(!e[c]){var i="function"==typeof require&&require;if(!u&&i)return i(c,!0);if(l)return l(c,!0);var f=new Error("Cannot find module '"+c+"'");throw f.code="MODULE_NOT_FOUND",f}var s=r[c]={exports:{}};e[c][0].call(s.exports,function(o){var r=e[c][1][o];return t(r?r:o)},s,s.exports,o,e,r,n)}return r[c].exports}for(var l="function"==typeof require&&require,c=0;c<n.length;c++)t(n[c]);return t}({1:[function(o,e,r){var n=function(){function o(){}return o.prototype.methodA=function(){return 111},o.prototype.methodB=function(){return 2},o}();r.MyService=n;var t=function(){function o(o){this.value=o.methodA()}return o.$inject=["myService"],o}();r.MyController=t},{}],2:[function(o,e,r){var n=o("./Customer");angular.module("app",[]).service("myService",n.MyService).controller("MyController",n.MyController),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123"),console.log("123")},{"./Customer":1}]},{},[2]);
//# sourceMappingURL=bundle.js.map