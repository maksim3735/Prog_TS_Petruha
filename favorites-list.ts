

import { Chart, registerables } from "chart.js";
import type { CityWeather } from "../models/weather.model";
import { storageService } from "../services/storage.service";

Chart.register(...registerables);

export class FavoritesListComponent extends HTMLElement {

  private favorites: CityWeather[] = [];
  private chartInstance: Chart | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback(): Promise<void> {
    this.render();
    this.setupListeners();
    await this.loadStoredFavorites();
  }

  private async loadStoredFavorites(): Promise<void> {
    try {
      this.favorites = await storageService.getFavorites();
      this.render();
      this.updateChart();
    } catch (error) {
      console.error("Помилка завантаження обраного зі сховища:", error);
    }
  }

  private setupListeners(): void {
    window.addEventListener("add-favorite", (event: Event) => {
      const customEvent = event as CustomEvent<CityWeather>;
      if (customEvent.detail) {
        this.addCity(customEvent.detail);
      }
    });
  }

  public async addCity(city: CityWeather): Promise<void> {
    const exists = this.favorites.some((item) => item.city === city.city);
    if (exists) {
      alert(`Місто ${city.city} вже є у вашому списку обраного!`);
      return;
    }

    this.favorites.push(city);
    await storageService.saveFavorites(this.favorites);
    this.render();
    this.updateChart();
  }

  public async removeCity(cityName: string): Promise<void> {
    this.favorites = this.favorites.filter((item) => item.city !== cityName);
    this.render();
    this.updateChart();
  }

  private updateChart(): void {
    if (this.favorites.length === 0) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      return;
    }

    const canvas = this.shadowRoot?.querySelector("#weather-chart") as HTMLCanvasElement | null;
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = this.favorites.map((item) => item.city);
    const data = this.favorites.map((item) => item.temp_c);

    this.chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Температура (°C)",
            data: data,
            backgroundColor: "rgba(43, 108, 176, 0.7)",
            borderColor: "rgba(43, 108, 176, 1)",
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Градуси Цельсія (°C)"
            }
          }
        }
      }
    });
  }



  private render(): void {
    if (!this.shadowRoot) return;

    if (this.favorites.length === 0) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: Arial, sans-serif;
            margin-top: 24px;
          }
          .empty-box {
            padding: 24px;
            background-color: #f7fafc;
            border: 2px dashed #cbd5e0;
            border-radius: 8px;
            text-align: center;
            color: #718096;
            font-size: 15px;
          }
        </style>
        <div class="empty-box">
          Список обраного порожній. Додайте запис у вибране в таблиці міст.
        </div>
      `;
      return;
    }


    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          margin-top: 24px;
        }

        .favorites-card {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        h3 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badges-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .favorite-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ebf8ff;
          border: 1px solid #bee3f8;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 14px;
          color: #2b6cb0;
        }

        .btn-remove {
          background: transparent;
          border: none;
          color: #e53e3e;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
        }

        .btn-remove:hover {
          color: #9b2c2c;
        }

        .chart-wrapper {
          position: relative;
          height: 260px;
          width: 100%;
        }
      </style>

      <div class="favorites-card">
        <h3>⭐ Обрані міста (${this.favorites.length})</h3>
        
        <div class="badges-container">
            ${this.favorites.map((item) => `
                <div class="favorite-badge">
                    <span><strong>${item.city}</strong> (${item.temp_c}°C)</span>
                    <button class="btn-remove" data-city="${item.city}" type="button" title="Видалити">&times;</button>
                </div>`).join("")}
        </div>

        <div class="chart-wrapper">
          <canvas id="weather-chart"></canvas>
        </div>
      </div>
    `;

    const removeButtons = this.shadowRoot.querySelectorAll(".btn-remove");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (event: Event) => {
        const target = event.currentTarget as HTMLButtonElement;
        const cityName = target.getAttribute("data-city");
        if (cityName) {
          this.removeCity(cityName);
        }
      });
    });
  }
}

customElements.define("favorites-list", FavoritesListComponent);