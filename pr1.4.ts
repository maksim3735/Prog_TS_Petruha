
// КЛІЄНТИ

import type { Worker } from "./pr1.2";
import { getAllWorkers, getWorkerByID } from "./pr1.3";

export function createCustomerID(name: string, id: number): string {
  return `${name}${id}`;
}

export function createCustomer(name: string, age?: number, city?: string): void {
  console.log(`Клієнт: ${name}`);
  if (age !== undefined) {
    console.log(`Вік: ${age}`);
  }
  if (city !== undefined) {
    console.log(`Місто: ${city}`);
  }
}

export function checkoutWorkers(customer: string, ...workerIDs: number[]): string[] {
  console.log(`Замовлення оформлює клієнт: ${customer}`);

  const availableWorkers: string[] = [];
  const allWorkers: Worker[] = getAllWorkers();

  for (const id of workerIDs) {
    const workerData = getWorkerByID(id);
    const fullWorker = allWorkers.find((w: Worker) => w.id === id);

    if (workerData && fullWorker && fullWorker.available) {
      availableWorkers.push(`${workerData.name} ${workerData.surname}`);
    }
  }

  return availableWorkers;
}