import axios from "axios";
import { WeatherIcon } from "../types/weather";
const DARKSKY_API_KEY = process.env.REACT_APP_DARKSKY_KEY;

const getWeather = async (latitude: string, longitude: string) => {
  const DARKSKY_URI = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}?UNITS=ca`;

  return await axios.get(DARKSKY_URI).then((res) => res.data);
};

const weatherMapping = (input: WeatherIcon) => {
  switch (input) {
    case WeatherIcon.CLEAR_DAY:
      return "/";
    case WeatherIcon.CLEAR_NIGHT:
      return "(";
    case WeatherIcon.RAIN:
      return "b";
    case WeatherIcon.SNOW:
      return "N";
    case WeatherIcon.SLEET:
      return "o";
    case WeatherIcon.WIND:
      return "T";
    case WeatherIcon.FOG:
      return "j";
    case WeatherIcon.CLOUDY:
      return "1";
    case WeatherIcon.PARTLY_CLOUDY_DAY:
      return "3";
    case WeatherIcon.PARTLY_CLOUDY_NIGHT:
      return "4";
    case WeatherIcon.HAIL:
      return "%";
    case WeatherIcon.THUNDERSTORM:
      return "G";
    case WeatherIcon.TORNADO:
      return "^";
    case WeatherIcon.UNKNOWN:
      return "*";
    default:
      return "*";
  }
};

export { getWeather, weatherMapping };
