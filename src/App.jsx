import { useState, useEffect} from 'react';
import './App.css';

// Images
import clearIcon from './assets/sun.png';
import cloudyIcon from './assets/cloudy.png';
import snowIcon from './assets/snow.png';
import cloudIcon from './assets/cloud.png';
import windIcon from './assets/wind.png';
import humidityIcon from './assets/humidity.png';
import searchIcon from './assets/search.png';

// ✅ Component to show weather details
const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className="weather-details">
        <img src={icon} alt="Weather Icon" className="weather-img" />

        <div className="location">{city}</div>
        <div className="country">{country}</div>

        {/* Latitude & Longitude */}
        <div className="cord">
          <div>
            <span className="lat">Latitude: </span>
            <span>{lat}</span>
          </div>
          <div>
            <span className="lon">Longitude: </span>
            <span>{lon}</span>
          </div>
        </div>

        <h2 className="temp">{temp}°C</h2>
      </div>

      {/* ✅ Data container for humidity & wind */}
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} Km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  // API Key from OpenWeather
  let api_key = "b77db9bd472b61f4bf13f6401dc8933a";

  const [text, setText] = useState("Tirunelveli");
  const [temp, setTemp] = useState(28);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState("13.0827");
  const [lon, setLon] = useState("80.2707");
  const [humidity, setHumidity] = useState(85);
  const [wind, setWind] = useState(5);
  const [icon, setIcon] = useState(cloudyIcon); // ✅ dynamic icon
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);

  // ✅ Mapping OpenWeather icon codes to our local images
  const weatherIconMap= {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": cloudyIcon,
    "03n": cloudyIcon,
    "04d": cloudyIcon,
    "04n": cloudyIcon,
    "09d": cloudIcon,  // you can add rain icon here if available
    "09n": cloudIcon,
    "10d": cloudIcon,
    "10n": cloudIcon,
    "11d": cloudIcon,  // thunderstorm (replace with correct icon)
    "11n": cloudIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  // ✅ Search function to fetch data
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod === 200) {
        setTemp(Math.round(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLon(data.coord.lon);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);

        // ✅ set correct weather icon
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || cloudyIcon);
        setCityNotFound(false);
      } else {
        setCityNotFound(true);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setCityNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle input change
  const handleCity = (e) => {
    setText(e.target.value);
  };

  // ✅ Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(function(){

    search();
  },[]);

  return (
    <div className="container">
      {/* Input Search Box */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Search City Name"
          className="cityInput"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon" onClick={() => search()}>
          <img src={searchIcon} alt="search" />
        </div>
      </div>

      {/* Show Loading */}
      {loading && <p>Loading...</p>}

      {/* Show Error */}
      {cityNotFound && <p className="error">City not found. Try again!</p>}

      {/* Weather Details */}
      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      )}

      <p className="copyright">
        Designed by <span>Ranjith</span>
      </p>
    </div>
  );
}

export default App;
