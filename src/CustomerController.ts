import CustomerService = require("./CustomerService");

class CustomerController {

    value:number;

    // @ngInject
    constructor(myService:CustomerService) {
        this.value = myService.methodA() + 200;
    }

}

export = CustomerController;
