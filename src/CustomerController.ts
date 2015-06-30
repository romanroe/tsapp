
import CustomerService = require("./CustomerService");

class CustomerController {

    value:number;

    // @ngInject
    constructor(customerService:CustomerService) {
        this.value = customerService.methodA() + 1000;
    }

}

export = CustomerController;
