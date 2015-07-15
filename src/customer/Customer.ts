
export class MyService {

    methodA(): number {
        console.log("22");
        return 22;
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









