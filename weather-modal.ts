

import type { CityWeather } from "../models/weather.model";

export class WeatherModalComponent extends HTMLElement {

  private currentCity: CityWeather | null = null;
  private isOpen: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener("show-details", (event: Event) => {
      const customEvent = event as CustomEvent<CityWeather>;
      if (customEvent.detail) {
        this.openModal(customEvent.detail);
      }
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && this.isOpen) {
        this.closeModal();
      }
    });
  }

  public openModal(cityData: CityWeather): void {
    this.currentCity = cityData;
    this.isOpen = true;
    this.render();
  }

  public closeModal(): void {
    this.isOpen = false;
    this.currentCity = null;
    this.render();
  }

  private render(): void {
    if (!this.shadowRoot) return;

    if (!this.isOpen || !this.currentCity) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    const city = this.currentCity;
    const iconUrl = city.conditionIcon.startsWith("http")
      ? city.conditionIcon
      : `https:${city.conditionIcon}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease-out;
        }

        .modal-card {
          background: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 480px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          position: relative;
          font-family: Arial, sans-serif;
          animation: slideUp 0.2s ease-out;
        }

        .btn-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: transparent;
          border: none;
          font-size: 22px;
          line-height: 1;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: color 0.2s, background-color 0.2s;
        }

        .btn-close:hover {
          color: #2d3748;
          background-color: #edf2f7;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }

        .weather-icon {
          width: 64px;
          height: 64px;
          background-color: #ebf8ff;
          border-radius: 50%;
          padding: 4px;
        }

        .title-group h2 {
          margin: 0;
          font-size: 22px;
          color: #2b6cb0;
        }

        .title-group p {
          margin: 4px 0 0 0;
          color: #718096;
          font-size: 14px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-item {
          background-color: #f7fafc;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #edf2f7;
        }

        .detail-label {
          font-size: 12px;
          color: #718096;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: bold;
          color: #2d3748;
        }

        .modal-footer {
          text-align: right;
        }

        .btn-dismiss {
          background-color: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-dismiss:hover {
          background-color: #cbd5e0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>

      <div class="modal-backdrop" id="backdrop">
        <div class="modal-card">
          <button class="btn-close" id="btn-close" type="button" title="Закрити">&times;</button>
          
          <div class="modal-header">
            <img class="weather-icon" src="${iconUrl}" alt="${city.conditionText}" />
            <div class="title-group">
              <h2>${city.city}</h2>
              <p>${city.state}, США &bull; <em>${city.conditionText}</em></p>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Температура</div>
              <div class="detail-value">${city.temp_c} °C</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Відчувається як</div>
              <div class="detail-value">${city.feelslike_c} °C</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Опади</div>
              <div class="detail-value">${city.precip_mm} мм</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Швидкість вітру</div>
              <div class="detail-value">${city.wind_kph} км/год</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Вологість</div>
              <div class="detail-value">${city.humidity} %</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Атмосферний тиск</div>
              <div class="detail-value">${city.pressure_mb} мбар</div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-dismiss" id="btn-dismiss" type="button">Закрити</button>
          </div>
        </div>
      </div>
    `;

    const backdrop = this.shadowRoot.querySelector("#backdrop");
    const closeBtn = this.shadowRoot.querySelector("#btn-close");
    const dismissBtn = this.shadowRoot.querySelector("#btn-dismiss");

    closeBtn?.addEventListener("click", () => this.closeModal());
    dismissBtn?.addEventListener("click", () => this.closeModal());

    backdrop?.addEventListener("click", (event: Event) => {
      if (event.target === backdrop) {
        this.closeModal();
      }
    });
  }
}

customElements.define("weather-modal", WeatherModalComponent);