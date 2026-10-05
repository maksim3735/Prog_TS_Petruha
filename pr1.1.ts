
// ГОЛОВНА

import { Category, type Worker, type CustomerIDGenerator } from "./pr1.2"; 
import {
  getAllWorkers,
  logFirstAvailable,
  getWorkersSurnamesByCategory,
  logWorkersNames,
  getWorkerByID,
} from "./pr1.3";
import {
  createCustomerID,
  createCustomer,
  checkoutWorkers,
} from "./pr1.4";

// завдання 1.1
console.log("\n Завдання 1.1 ");
logFirstAvailable();

// завдання 1.2
console.log("\n Завдання 1.2 ");
const sur = getWorkersSurnamesByCategory(Category.Designer);
logWorkersNames(sur);

// завдання 1.3
console.log("\n Завдання 1.3 ");
console.log("Робітники з категорії Developer:");
getAllWorkers().forEach((worker: Worker) => {
  if (worker.category === Category.Developer) {
    console.log(`${worker.name} ${worker.surname}`);
  }
});

const worker2 = getWorkerByID(2);
console.log("Знайдений робітник за ID 2:", worker2);

// завдання 1.4
console.log("\n Завдання 1.4");
const myID: string = createCustomerID("Maksim ", 7);
console.log(`Згенерований ID: ${myID}`);

let idGenerator: CustomerIDGenerator = (name: string, id: number): string => `${name}${id}`;
console.log(`Згенерований ID (через стрілочну змінну): ${idGenerator("Maksim ", 7)}`);

idGenerator = createCustomerID;
console.log(`Згенерований ID (через присвоєну функцію): ${idGenerator("Maksim ", 7)}`);

// завдання 1.5
console.log("\n Завдання 1.5 ");
console.log("Виклик createCustomer з 1 параметром:");
createCustomer("Maksim");
console.log("Виклик createCustomer з 2 параметрами:");
createCustomer("Maksim", 19);
console.log("Виклик createCustomer з 3 параметрами:");
createCustomer("Maksim", 19, "Kyiv");

console.log("\ngetWorkersSurnamesByCategory за замовчуванням");
logWorkersNames(getWorkersSurnamesByCategory());

console.log("\ncheckoutWorkers (перевірка доступних робітників):");
const myWorkers: string[] = checkoutWorkers("Maksim", 1, 2, 3, 4);
console.log("Доступні призначені робітники:");
myWorkers.forEach((workerName: string) => {
  console.log(`- ${workerName}`);
});