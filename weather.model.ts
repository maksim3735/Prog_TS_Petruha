

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    precip_mm: number;
    wind_kph: number;
    humidity: number;
    pressure_mb: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}


export interface CityWeather {
  city: string;         
  state: string;         
  temp_c: number;       
  precip_mm: number;   
  wind_kph: number;   
  humidity: number;     
  feelslike_c: number;  
  pressure_mb: number;  
  conditionText: string;
  conditionIcon: string; 
}


export interface StateCapital {
  city: string;
  state: string;
}