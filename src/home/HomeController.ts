import {appModule} from "../app";
import {HomeService} from "./HomeService";

class HomeController {

    clicks = 0;

    /*@ngInject*/
    constructor(private homeService: HomeService) {
    }

    click() {
        this.clicks = this.homeService.getAndIncrement();
    }

}

appModule.controller("HomeController", HomeController);

