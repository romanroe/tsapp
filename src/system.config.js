System.config({
    baseURL: '/___systemjs/app',
    defaultJSExtensions: true
});

System.import('app.js').then(function(m) {
    System.import('legacy/oldjs2.js').then(function() {
        angular.bootstrap(document, ["app"]);
    });
});
