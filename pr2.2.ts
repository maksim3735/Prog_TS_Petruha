
// ІНТЕРФЕЙСИ ТА КЛАСИ

export interface Worker {
  id: number;
  name: string;
  surname: string;
  available: boolean;
  salary: number;
  markPrize?: PrizeLogger;
}

export interface PrizeLogger {
  (prize: string): void;
}

export interface Person {
  name: string;
  email: string;
}

export interface Author extends Person {
  numBooksPublished: number;
}

export interface Librarian extends Person {
  department: string;
  assistCustomer: (custName: string) => void;
}

export class UniversityLibrarian implements Librarian {
  name: string = "";
  email: string = "";
  department: string = "";

  assistCustomer(custName: string): void {
    console.log(`${this.name} is assisting ${custName}`);
  }
}

export abstract class ReferenceItem {
  /*
  title: string;
  year: number;

  constructor(newTitle: string, newYear: number) {
    console.log("Creating a new ReferenceItem ...");
    this.title = newTitle;
    this.year = newYear;
  }
  */

  private _publisher: string = "";
  static department: string = "Науковий та технічний відділ";

  constructor(public title: string, protected year: number) {
    console.log("Creating a new ReferenceItem ...");
  }

  get publisher(): string {
    return this._publisher.toUpperCase();
  }
  set publisher(newPublisher: string) {
    this._publisher = newPublisher;
  }

  printItem(): void {
    console.log(`${this.title} was published in ${this.year}`);
    console.log(`Відділ: ${ReferenceItem.department}`);
  }

  abstract printCitation(): void;
}

export class Encyclopedia extends ReferenceItem {

  constructor(title: string, year: number, public edition: number) {
    super(title, year);
  }

  override printItem(): void {
    super.printItem();
    console.log(`Edition: ${this.edition} (${this.year})`);
  }

  printCitation(): void {
    console.log(`${this.title} - ${this.year}`);
  }
}