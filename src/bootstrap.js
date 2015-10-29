(function () {

    require("./app");
    require("./routes");

    require("./home/HomeService");
    require("./home/HomeController");

    angular.bootstrap(document, ["app"], {strictDi: true});

})();
