
// ВИКЛИКИ (головна)

import type {
  Worker,
  PrizeLogger,
  Author,
  Librarian,
} from "./pr2.2";

import {
  UniversityLibrarian,
  Encyclopedia,
} from "./pr2.2";

import {
  getWorkerByID,
  PrintWorker,
  showPrize,
} from "./pr2.3";


console.log("Завдання 2.1 \n");
const worker = getWorkerByID(2);
if (worker) {
  PrintWorker(worker);
} 
else {
  console.log("Робітника не знайдено") 
}


console.log("\nЗавдання 2.2 \n");

const logPrize: PrizeLogger = showPrize;
logPrize("премія 2 грн");


console.log("\nЗавдання 2.3 \n");

const favoriteAuthor: Author = {
  name: "Я",
  email: "im@gmail.com",
  numBooksPublished: 0,
};
console.log("Улюблений автор:", favoriteAuthor);

/*
const favoriteLibrarian: Librarian = {
  name: "Ти",
  email: "you@library.ua",
  department: "Хепі хаус",
  assistCustomer: (custName: string) => {
    console.log(`Бібліотекар допомагає читачу: ${custName}`);
  },
};
*/

console.log("\nЗавдання 2.4 \n");

const favoriteLibrarian: Librarian = new UniversityLibrarian();
favoriteLibrarian.name = "YOU";
favoriteLibrarian.email = "you@library.ua";
favoriteLibrarian.department = "Хепі хаус";
favoriteLibrarian.assistCustomer("Maks");


console.log("\nЗавдання 2.5 - 2.7 \n");

/*
const ref = new ReferenceItem("книга 1", 2026);
ref.publisher = "zorya";
console.log(`Видавець: ${ref.publisher}`);
ref.printItem();
*/

const refBook = new Encyclopedia("book 2", 2026, 2);

refBook.publisher = "zorya";
console.log(`Видавець: ${refBook.publisher}`);
refBook.printItem();
refBook.printCitation();
