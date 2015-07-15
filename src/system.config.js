System.config({
    baseURL: '/___systemjs/app',
    defaultJSExtensions: true
});

System.import("app").then(function (m) {
    angular.bootstrap(document, ["app"]);
});

