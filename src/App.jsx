import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from  "prop-types";
import searchIcon from "./assets/search.png"
import clearIcon from "./assets/clear.png"
import cloudIcon from "./assets/cloud.png"
import drizzleIcon from "./assets/drizzle.png"
import rainIcon from "./assets/rain.png"
import snowIcon from "./assets/snow.png"
import humidityIcon from "./assets/humidity.png"
import windIcon from "./assets/wind.png"

/** Weather details component */
const WeatherInfo = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className='icon'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='city'>{city}</div>
      <div className='country'>{country}</div>
      <div className='coords'>
        <div><span className='lat'>latitude</span><span>{lat}</span></div>
        <div><span className='lon'>longitude</span><span>{lon}</span></div>
      </div>
      <div className='details'>
        <div className='element'>
          <img src={humidityIcon} alt="Humidity Icon" className='small-icon' />
          <div className="data">
            <div className="humidity">{humidity}%</div>
            <div className="label">Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Wind Icon" className='small-icon' />
          <div className="data">
            <div className="wind">{wind} km/h</div>
            <div className="label">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  ); 
};

// Prop types validation
WeatherInfo.proptypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
};

/** Main app component */
function App() {
  let api_key = "6445a59befc6d0494ca4b1bad13778bf"; // API key

  // State variables
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(searchIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  
  // Weather icons map
  const weatherIconMap = {
    "01d" : clearIcon,
    "01n" : clearIcon,
    "02d" : cloudIcon,
    "02n" : cloudIcon,
    "03d" : drizzleIcon,
    "03n" : drizzleIcon,
    "04d" : drizzleIcon,
    "04n" : drizzleIcon,
    "09d" : rainIcon,
    "09n" : rainIcon,
    "10d" : rainIcon,
    "10n" : rainIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
  }

  /** Fetch weather data */
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      // Update state with weather data
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setIcon(weatherIconMap[data.weather[0].icon] || clearIcon)
      setCityNotFound(false);
    }catch(error){
      setError("An error occured while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };
  
  /** Handle input change */
  const handleCity = (e) => {
    setText(e.target.value);
  };

  /** Handle "Enter" key press */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
       search();
    }
  }

  // Fetch default city weather on mount
  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        {/* Search input */}
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          {/* Search icon */}
          <div className='search-icon' onClick={()=>search()}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        
        {/* Loading, error, and city not found messages */}
        {loading && <div className='loading-Message'>Loading...</div>}
        {error && <div className='error-Message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City Not Found</div>}

        {/* Weather details */}
        {!loading && !error && !cityNotFound && < WeatherInfo icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind}/>}
        
        {/* Footer */}
        <p className='copyright'>
          Designed by <span>ASHIF</span>
        </p>
      </div>
    </>
  );
}

export default App