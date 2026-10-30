

interface SphereCalculationResult {
  circumference: number;
  area: number;
  volume: number;
}

export class SphereCalculatorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this.setupListeners();
  }

  private validateRadius(value: string): number | null {
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num) || num <= 0) {
      return null;
    }
    return num;
  }

  private calculate(radius: number): SphereCalculationResult {
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * Math.pow(radius, 2);
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);

    return { circumference, area, volume };
  }

  private setupListeners(): void {
    const button = this.shadowRoot?.querySelector("#calc-btn") as HTMLButtonElement | null;
    const input = this.shadowRoot?.querySelector("#radius-input") as HTMLInputElement | null;
    const output = this.shadowRoot?.querySelector("#output") as HTMLDivElement | null;

    if (!button || !input || !output) return;

    button.addEventListener("click", () => {
      const radius = this.validateRadius(input.value);

      if (radius === null) {
        output.innerHTML = `
          <div class="error-box">
            Будь ласка, введіть коректне додатне числове значення радіуса!
          </div>
        `;
        return;
      }

      const res = this.calculate(radius);

      output.innerHTML = `
        <div class="result-box">
          <p><strong>Заданий радіус (r):</strong> ${radius}</p>
          <p><strong>Довжина кола (2πr):</strong> ${res.circumference.toFixed(4)}</p>
          <p><strong>Площа круга (πr²):</strong> ${res.area.toFixed(4)}</p>
          <p><strong>Об'єм кулі (4/3 πr³):</strong> ${res.volume.toFixed(4)}</p>
        </div>
      `;
    });
  }

  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 420px;
          margin: 0 auto;
        }

        .card {
          background-color: #ffffff;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #2c3e50;
          font-size: 18px;
          text-align: center;
        }

        .field {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #4a5568;
          font-size: 14px;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 15px;
          background-color: #ffffff;
          color: #2d3748;
        }

        input:focus {
          outline: none;
          border-color: #3182ce;
        }

        button {
          width: 100%;
          background-color: #3182ce;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: #2b6cb0;
        }

        .result-box {
          margin-top: 18px;
          padding: 14px;
          border-radius: 6px;
          background-color: #f7fafc;
          border-left: 4px solid #38a169;
        }

        .result-box p {
          margin: 6px 0;
          color: #2d3748;
          font-size: 14px;
        }

        .error-box {
          margin-top: 18px;
          padding: 12px;
          border-radius: 6px;
          background-color: #fff5f5;
          border-left: 4px solid #e53e3e;
          color: #c53030;
          font-size: 14px;
        }
      </style>

      <div class="card">
        <h2>Розрахунок кола та кулі (Вар. 7)</h2>
        <div class="field">
          <label for="radius-input">Радіус (r):</label>
          <input type="number" id="radius-input" placeholder="Введіть значення радіуса..." step="any" min="0">
        </div>
        <button id="calc-btn">Обчислити</button>
        <div id="output"></div>
      </div>
    `;
  }
}

customElements.define("sphere-calculator", SphereCalculatorComponent);