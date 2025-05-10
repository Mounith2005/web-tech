import { x, myfunc, MyClass } from './module';

console.log(x); // Logs "welcome"
myfunc(); // Logs "This is my function..."

let instance = new MyClass(5, 10);
console.log(instance.add()); // Logs 15