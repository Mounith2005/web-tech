export var x: string = "welcome";

export function myfunc(): void {
    console.log("This is my function...");
}

export class MyClass {
    a: number;
    b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    add = () => {
        return this.a + this.b;
    }
}