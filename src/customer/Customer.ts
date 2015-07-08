
export class MyService {

    methodA(): number {
        console.log("customer");
        return 1;
    }

    methodB(): number {
        return 2;
    }

}

export class MyController {

    value: number;

    // @ngInject
    constructor(myService: MyService) {
        this.value = myService.methodA();
    }

    onChange(firstname: string) {
        console.log(firstname);
    }

}







