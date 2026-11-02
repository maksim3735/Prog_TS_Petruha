
// збереження

import { Storage } from "@ionic/storage";
import type { CityWeather } from "../models/weather.model";

export class StorageService {
  private storage: Storage | null = null;
  private readonly storageKey: string = "favorite_capitals";

  async init(): Promise<void> {
    if (!this.storage) {
      const newStorage = new Storage({
        name: "WeatherAppDB",
        storeName: "favorites_store"
      });
      this.storage = await newStorage.create();
    }
  }

  async getFavorites(): Promise<CityWeather[]> {
    await this.init();
    const data = await this.storage?.get(this.storageKey);
    return data ? (data as CityWeather[]) : [];
  }

  async saveFavorites(favorites: CityWeather[]): Promise<void> {
    await this.init();
    await this.storage?.set(this.storageKey, favorites);
  }

  async clearFavorites(): Promise<void> {
    await this.init();
    await this.storage?.remove(this.storageKey);
  }
}

export const storageService = new StorageService();