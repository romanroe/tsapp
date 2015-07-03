import customer = require("./Customer");

export class MyController2 {

    value:number;

    //@ngInject
    constructor(myService:customer.MyService) {
        var x = "wohoo";


        this.value = myService.methodA();
    }

}
