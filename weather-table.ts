

//основна табличка

import { weatherService } from "../services/weather.service";
import type { CityWeather } from "../models/weather.model";

export class WeatherTableComponent extends HTMLElement {
  private weatherData: CityWeather[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback(): Promise<void> {
    this.renderSkeleton();
    await this.loadData();
  }

  private renderSkeleton(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          margin-bottom: 24px;
        }

        .table-container {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          background-color: #f7fafc;
          color: #4a5568;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid #edf2f7;
          font-size: 14px;
          color: #2d3748;
          vertical-align: middle;
        }

        tr.city-row {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        tr.city-row:hover {
          background-color: #ebf8ff;
        }

        .city-name {
          font-weight: bold;
          color: #2b6cb0;
        }

        .state-name {
          font-size: 12px;
          color: #718096;
        }

        .btn-favorite {
          background-color: #38a169;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-favorite:hover {
          background-color: #2f855a;
        }

        .status-message {
          padding: 24px;
          text-align: center;
          color: #718096;
          font-size: 15px;
        }

        .error-message {
          padding: 20px;
          text-align: center;
          color: #e53e3e;
          font-size: 15px;
        }
      </style>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Місто (Штат)</th>
              <th>Температура</th>
              <th>Опади</th>
              <th>Вітер</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody id="table-body">
            <tr>
              <td colspan="5" class="status-message">⏳ Отримання погоди столиць США...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private async loadData(): Promise<void> {
    const tbody = this.shadowRoot?.querySelector("#table-body");
    if (!tbody) return;

    try {
      this.weatherData = await weatherService.getAllCapitalsWeather();
      this.renderRows();
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="error-message">
            ⚠️ Не вдалося завантажити дані погоди. Перевірте API-ключ або з'єднання з мережею.
          </td>
        </tr>
      `;
    }
  }

  private renderRows(): void {
    const tbody = this.shadowRoot?.querySelector("#table-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    this.weatherData.forEach((item) => {
      const row = document.createElement("tr");
      row.className = "city-row";

      row.innerHTML = `
        <td>
          <div class="city-name">${item.city}</div>
          <div class="state-name">${item.state}</div>
        </td>
        <td><strong>${item.temp_c}°C</strong></td>
        <td>${item.precip_mm} мм</td>
        <td>${item.wind_kph} км/год</td>
        <td>
          <button class="btn-favorite" type="button">⭐ У вибране</button>
        </td>
      `;

      row.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("btn-favorite")) return;

        this.dispatchEvent(
          new CustomEvent("show-details", {
            detail: item,
            bubbles: true,
            composed: true 
          })
        );
      });


      const favButton = row.querySelector(".btn-favorite") as HTMLButtonElement | null;
      favButton?.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation(); 

        this.dispatchEvent(
          new CustomEvent("add-favorite", {
            detail: item,
            bubbles: true,
            composed: true 
          })
        );
      });

      tbody.appendChild(row);
    });
  }
}

customElements.define("weather-table", WeatherTableComponent);