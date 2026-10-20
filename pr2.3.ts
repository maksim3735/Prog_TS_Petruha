
// ФУНКЦІЇ

import type { Worker } from "./pr2.2";

export function getAllWorkers(): Worker[] {
  return [
    { id: 1, name: "Danylo", surname: "Romanovych", available: false, salary: 1000 },
    { id: 2, name: "Pavlo", surname: "Skoropadskyi", available: true, salary: 1500 },
    { id: 3, name: "Mykola", surname: "Mikhnovskyi", available: false, salary: 1600 },
    { id: 4, name: "Jarema", surname: "Vyshnevetskyi", available: true, salary: 1300 },
  ];
}

export function getWorkerByID(id: number): Worker | undefined {
  const workers: Worker[] = getAllWorkers();
  return workers.find((w: Worker) => w.id === id);
}

export function PrintWorker(worker: Worker): void {
  console.log(`${worker.name} ${worker.surname} got salary ${worker.salary}`);
}

export function showPrize(prize: string): void {
  console.log(`Нагорода: ${prize}`);
}