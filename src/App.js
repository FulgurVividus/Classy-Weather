import React from "react";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component {
  // it'll be placed on component instance
  // no 'this' keyword as it's also component instance, so we don't need it
  state = {
    location: "New York",
    isLoading: false,
    displayLocation: "",
    weather: {},
  };
  constructor(props) {
    super(props);
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  async fetchWeather() {
    this.setState({ isLoading: true });

    try {
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      // console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  setLocation = (e) => {
    this.setState({ location: e.target.value });
  };

  render() {
    return (
      <>
        <div className="app">
          <h1>Classy Weather</h1>
          <Input
            location={this.state.location}
            onChangeLocation={this.setLocation}
          />
          <button
            onClick={this.fetchWeather}
            style={{
              background: "none",
              outline: "none",
              padding: "6px",
              cursor: "pointer",
              border: "1px solid black",
              borderRadius: "5px",
            }}
          >
            Get Weather
          </button>

          {this.state.isLoading && <p className="loader">Loading...</p>}

          {this.state.weather.weathercode && (
            <Weather
              weather={this.state.weather}
              location={this.state.displayLocation}
            />
          )}
        </div>
      </>
    );
  }
}

export default App;

class Input extends React.Component {
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search from location..."
          value={this.props.location}
          onChange={this.props.onChangeLocation}
        />
      </div>
    );
  }
}

class Weather extends React.Component {
  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;
    return (
      <>
        <div>
          <h2>Weather in {this.props.location}</h2>
          <ul className="weather">
            {dates.map((date, index) => (
              <Day
                date={date}
                max={max.at(index)}
                min={min.at(index)}
                code={codes.at(index)}
                isToday={index === 0}
                key={date}
              />
            ))}
          </ul>
        </div>
      </>
    );
  }
}

// If we don't have to initialize states or manually bind the 'this' to some event handler methods, then we don't need 'constructor' function
class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;

    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
        </p>
      </li>
    );
  }
}
