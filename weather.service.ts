
// підтягує із сайту 

import axios from "axios";
import type { WeatherApiResponse, CityWeather, StateCapital } from "../models/weather.model";

export const US_CAPITALS: StateCapital[] = [
  { city: "Columbus", state: "Ohio" },
  { city: "Austin", state: "Texas" },
  { city: "Sacramento", state: "California" },
  { city: "Albany", state: "New York" },
  { city: "Tallahassee", state: "Florida" },
  { city: "Phoenix", state: "Arizona" },
  { city: "Denver", state: "Colorado" },
  { city: "Boston", state: "Massachusetts" },
  { city: "Atlanta", state: "Georgia" },
  { city: "Honolulu", state: "Hawaii" },
  { city: "Nashville", state: "Tennessee" },
  { city: "Indianapolis", state: "Indiana" }
];

export class WeatherService {

  private readonly apiKey: string = "246b54953c1a47f6a24134427263010";
  private readonly baseUrl: string = "https://api.weatherapi.com/v1/current.json";

  async getWeatherByCapital(capital: StateCapital): Promise<CityWeather> {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(capital.city)}&aqi=no`;

    const response = await axios.get<WeatherApiResponse>(url);
    const data = response.data;

    return {
      city: capital.city,
      state: capital.state,
      temp_c: data.current.temp_c,
      precip_mm: data.current.precip_mm,
      wind_kph: data.current.wind_kph,
      humidity: data.current.humidity,
      feelslike_c: data.current.feelslike_c,
      pressure_mb: data.current.pressure_mb,
      conditionText: data.current.condition.text,
      conditionIcon: data.current.condition.icon
    };
  }

  async getAllCapitalsWeather(): Promise<CityWeather[]> {

    const requests = US_CAPITALS.map((capital) => this.getWeatherByCapital(capital));

    return await Promise.all(requests);
  }
}

export const weatherService = new WeatherService();
