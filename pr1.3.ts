
// ПРАЦІВНИКИ

import { type Worker, Category } from "./pr1.2";

export function getAllWorkers(): Worker[] {
  return [
    { id: 1, name: "Danylo", surname: "Romanovych", available: false, salary: 1000, category: Category.Developer },
    { id: 2, name: "Pavlo", surname: "Skoropadskyi", available: true, salary: 1500, category: Category.BusinessAnalyst },
    { id: 3, name: "Mykola", surname: "Mikhnovskyi", available: false, salary: 1600, category: Category.Designer },
    { id: 4, name: "Jarema", surname: "Vyshnevetskyi", available: true, salary: 1300, category: Category.QA },
  ];
}

export function logFirstAvailable(workers: Worker[] = getAllWorkers()): void {
  console.log(`Загальна кількість робітників: ${workers.length}`);

  let fav = "";

  for (const worker of workers) {
    if (worker.available) {
      fav = `${worker.name} ${worker.surname}`;
      break;
    }
  }

  if (fav) {
    console.log(`Перший доступний робітник: ${fav}`);
  } else {
    console.log("Доступних робітників не знайдено");
  }
}

export function getWorkersSurnamesByCategory(category: Category = Category.Designer): Array<string> {
  const workers: Worker[] = getAllWorkers();
  const surnames: Array<string> = [];

  for (const worker of workers) {
    if (worker.category === category) {
      surnames.push(worker.surname);
    }
  }

  return surnames;
}

export function logWorkersNames(names: string[]): void {
  console.log("Список імен/прізвищ:");
  for (const name of names) {
    console.log(`- ${name}`);
  }
}

export function getWorkerByID(id: number): { name: string; surname: string; salary: number } | undefined {
  const workers: Worker[] = getAllWorkers();
  const foundWorker = workers.find((w: Worker) => w.id === id);

  if (foundWorker) {
    return {
      name: foundWorker.name,
      surname: foundWorker.surname,
      salary: foundWorker.salary,
    };
  }

  return undefined;
}