
export class MyService {

    methodA(): number {
        console.log("1");
        return 1;
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









