import customer = require("./Customer");

export class MyController2 {

    value:number;

    //@ngInject
    constructor(myService:customer.MyService) {
        console.log("car.MyController2");
        this.value = myService.methodA() + 10;
    }

}
