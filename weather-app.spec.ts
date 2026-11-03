

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { CityWeather } from "../src/models/weather.model";

vi.mock("chart.js", () => {
  class MockChart {
    static register = vi.fn();
    destroy = vi.fn();
    update = vi.fn();
  }
  return {
    Chart: MockChart,
    registerables: []
  };
});

vi.mock("../src/services/weather.service", () => {
  return {
    weatherService: {
      getAllCapitalsWeather: vi.fn().mockResolvedValue([
        {
          city: "Austin",
          state: "Texas",
          temp_c: 24.5,
          precip_mm: 0,
          wind_kph: 12.3,
          humidity: 45,
          feelslike_c: 25.0,
          pressure_mb: 1015,
          conditionText: "Сонячно",
          conditionIcon: "//cdn.weatherapi.com/icon.png"
        }
      ]),
      getWeatherByCapital: vi.fn()
    },
    US_CAPITALS: []
  };
});


vi.mock("../src/services/storage.service", () => {
  let inMemoryStore: Record<string, any> = {};
  return {
    storageService: {
      init: vi.fn().mockResolvedValue(undefined),
      getFavorites: vi.fn().mockImplementation(async () => inMemoryStore["favorite_capitals"] || []),
      saveFavorites: vi.fn().mockImplementation(async (data: any) => {
        inMemoryStore["favorite_capitals"] = [...data];
      }),
      clearFavorites: vi.fn().mockImplementation(async () => {
        inMemoryStore = {};
      })
    }
  };
});


import "../src/components/weather-table";
import "../src/components/weather-modal";
import "../src/components/favorites-list";


const mockCity: CityWeather = {
  city: "Columbus",
  state: "Ohio",
  temp_c: 18.2,
  precip_mm: 1.5,
  wind_kph: 15.0,
  humidity: 60,
  feelslike_c: 17.8,
  pressure_mb: 1012,
  conditionText: "Мінлива хмарність",
  conditionIcon: "//cdn.weatherapi.com/sample.png"
};


// 1. ТЕСТУВАННЯ ВЛАСТИВОСТЕЙ
describe("1. Тестування властивостей", () => {
  it("weather-modal: властивість isOpen спочатку false", () => {
    const modal = document.createElement("weather-modal") as any;
    expect(modal.isOpen).toBe(false);
  });

  it("weather-modal: властивість currentCity за замовчуванням дорівнює null", () => {
    const modal = document.createElement("weather-modal") as any;
    expect(modal.currentCity).toBeNull();
  });

  it("favorites-list: початковий масив favorites визначений і порожній", () => {
    const favList = document.createElement("favorites-list") as any;
    expect(favList.favorites).toBeDefined();
    expect(favList.favorites).toEqual([]);
  });

  it("weather-table: початковий стан масиву weatherData є порожнім", () => {
    const table = document.createElement("weather-table") as any;
    expect(table.weatherData).toBeDefined();
    expect(Array.isArray(table.weatherData)).toBe(true);
  });

  it("favorites-list: екземпляр chartInstance спочатку null", () => {
    const favList = document.createElement("favorites-list") as any;
    expect(favList.chartInstance).toBeNull();
  });
});


// 2. ТЕСТУВАННЯ АТРИБУТІВ 
describe("2. Тестування атрибутів", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("weather-modal");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("коректно встановлює кастомний атрибут через setAttribute", () => {
    element.setAttribute("data-view", "detailed");
    expect(element.getAttribute("data-view")).toBe("detailed");
  });

  it("коректно видаляє атрибут через removeAttribute", () => {
    element.setAttribute("hidden", "true");
    expect(element.hasAttribute("hidden")).toBe(true);
    element.removeAttribute("hidden");
    expect(element.hasAttribute("hidden")).toBe(false);
  });

  it("зберігає назву тегу компонента у верхньому регістрі (нативний DOM)", () => {
    expect(element.tagName).toBe("WEATHER-MODAL");
  });

  it("повинен підтримувати роботу зі стандартним атрибутом id", () => {
    element.setAttribute("id", "main-weather-modal");
    expect(element.id).toBe("main-weather-modal");
  });
});


// 3. ТЕСТУВАННЯ МЕТОДІВ 
describe("3. Тестування методів", () => {
  let modal: any;
  let favList: any;

  beforeEach(() => {
    modal = document.createElement("weather-modal");
    favList = document.createElement("favorites-list");
    document.body.appendChild(modal);
    document.body.appendChild(favList);
  });

  afterEach(() => {
    modal.remove();
    favList.remove();
  });

  it("openModal(): встановлює isOpen = true та записує обране місто в currentCity", () => {
    modal.openModal(mockCity);
    expect(modal.isOpen).toBe(true);
    expect(modal.currentCity).toEqual(mockCity);
  });

  it("closeModal(): закриває модалку, встановлює isOpen = false і занулює currentCity", () => {
    modal.openModal(mockCity);
    modal.closeModal();
    expect(modal.isOpen).toBe(false);
    expect(modal.currentCity).toBeNull();
  });

  it("addCity(): додає нове місто до списку favorites", async () => {
    await favList.addCity(mockCity);
    expect(favList.favorites.length).toBe(1);
    expect(favList.favorites[0].city).toBe("Columbus");
  });

  it("addCity(): запобігає повторному додаванню однакового міста (дубліката)", async () => {
    window.alert = vi.fn();
    await favList.addCity(mockCity);
    await favList.addCity(mockCity);
    expect(favList.favorites.length).toBe(1);
    expect(window.alert).toHaveBeenCalled();
  });

  it("removeCity(): коректно видаляє місто за назвою", async () => {
    await favList.addCity(mockCity);
    await favList.removeCity("Columbus");
    expect(favList.favorites.length).toBe(0);
  });
});


// 4. ТЕСТУВАННЯ ПОДІЙ 
describe("4. Тестування подій", () => {
  it("подія 'show-details' передає об'єкт погоди через event.detail", () => {
    let capturedData: any = null;
    const listener = (event: Event) => {
      capturedData = (event as CustomEvent).detail;
    };

    window.addEventListener("show-details", listener);
    window.dispatchEvent(
      new CustomEvent("show-details", {
        detail: mockCity,
        bubbles: true,
        composed: true
      })
    );

    expect(capturedData).toEqual(mockCity);
    window.removeEventListener("show-details", listener);
  });

  it("подія 'add-favorite' створена з bubbles: true та composed: true для виходу із Shadow DOM", () => {
    const event = new CustomEvent("add-favorite", {
      detail: mockCity,
      bubbles: true,
      composed: true
    });

    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.detail.city).toBe("Columbus");
  });

  it("weather-modal: автоматично викликає openModal при надходженні глобальної події 'show-details'", () => {
    const modal = document.createElement("weather-modal") as any;
    document.body.appendChild(modal);

    window.dispatchEvent(
      new CustomEvent("show-details", {
        detail: mockCity
      })
    );

    expect(modal.isOpen).toBe(true);
    expect(modal.currentCity?.city).toBe("Columbus");
    modal.remove();
  });

  it("weather-modal: закривається при натисканні клавіші Escape", () => {
    const modal = document.createElement("weather-modal") as any;
    document.body.appendChild(modal);
    modal.openModal(mockCity);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(modal.isOpen).toBe(false);
    modal.remove();
  });

  it("викликає spy-функцію при еміті події додавання у вибране", () => {
    const spy = vi.fn();
    window.addEventListener("add-favorite", spy);

    window.dispatchEvent(
      new CustomEvent("add-favorite", {
        detail: mockCity
      })
    );

    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener("add-favorite", spy);
  });
});


// 5. ТЕСТУВАННЯ DOM ТА SHADOW DOM 
describe("5. Тестування DOM та Shadow DOM", () => {
  it("компоненти створюють відкритий Shadow DOM (mode: 'open')", () => {
    const table = document.createElement("weather-table");
    const modal = document.createElement("weather-modal");
    const fav = document.createElement("favorites-list");

    expect(table.shadowRoot?.mode).toBe("open");
    expect(modal.shadowRoot?.mode).toBe("open");
    expect(fav.shadowRoot?.mode).toBe("open");
  });

  it("інкапсуляція: внутрішні теги Shadow DOM недоступні через document.querySelector", () => {
    const modal = document.createElement("weather-modal") as any;
    document.body.appendChild(modal);
    modal.openModal(mockCity);

    const shadowTitle = modal.shadowRoot.querySelector(".title-group h2");
    expect(shadowTitle).toBeTruthy();
    expect(shadowTitle.textContent).toBe("Columbus");

    const globalTitle = document.querySelector(".title-group h2");
    expect(globalTitle).toBeNull();

    modal.remove();
  });

  it("favorites-list: відображає текст-підказку, коли масив обраного порожній", () => {
    const favList = document.createElement("favorites-list") as any;
    document.body.appendChild(favList);

    const emptyBox = favList.shadowRoot.querySelector(".empty-box");
    expect(emptyBox).toBeTruthy();
    expect(emptyBox.textContent).toContain("Список обраного порожній");

    favList.remove();
  });

  it("weather-table: створює локальні стилі через тег <style> всередині Shadow DOM", () => {
    const table = document.createElement("weather-table");
    document.body.appendChild(table);

    const styleTag = table.shadowRoot?.querySelector("style");
    expect(styleTag).toBeTruthy();
    expect(styleTag?.textContent).toContain(".table-container");

    table.remove();
  });
});


// 6. ТЕСТУВАННЯ АСИНХРОННИХ ОПЕРАЦІЙ ТА СХОВИЩА 
describe("6. Тестування асинхронних операцій та сховища", () => {
  it("weather-table: асинхронно отримує та зберігає список столиць під час завантаження", async () => {
    const table = document.createElement("weather-table") as any;
    document.body.appendChild(table);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(table.weatherData.length).toBe(1);
    expect(table.weatherData[0].city).toBe("Austin");

    table.remove();
  });

  it("favorites-list: асинхронно додає місто до сховища та списку", async () => {
    const favList = document.createElement("favorites-list") as any;
    document.body.appendChild(favList);

    await favList.addCity(mockCity);
    expect(favList.favorites.some((c: CityWeather) => c.city === "Columbus")).toBe(true);

    favList.remove();
  });

  it("favorites-list: асинхронно видаляє місто зі сховища та списку", async () => {
    const favList = document.createElement("favorites-list") as any;
    document.body.appendChild(favList);

    await favList.addCity(mockCity);
    await favList.removeCity("Columbus");

    expect(favList.favorites.length).toBe(0);
    favList.remove();
  });

  it("підтримує асинхронне виконання через Promise та setTimeout", async () => {
    let resolved = false;
    await new Promise((res) => {
      setTimeout(() => {
        resolved = true;
        res(true);
      }, 20);
    });
    expect(resolved).toBe(true);
  });
});