
export class MyService {

    methodA():number {
        return 1;
    }

    methodB():number {
        return 2;
    }

}

export class MyController {

    value:number;

    // @ngInject
    constructor(myService:MyService) {
        this.value = myService.methodA();
    }

}







