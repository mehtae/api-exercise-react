import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [cityData, setCityData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //RegExp for valid input (all letters and includes åäö with spaces, hyphens, dots, no numbers, atleast 3 characers).
    const validInput = /^[a-zA-ZåäöÅÄÖ. -]{2,}$/gm;
    if (!validInput.test(city)) {
      setCityData(null);
      setError("Please enter a valid city name.");
      return;
    }

    try {
      const res = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}`,
        {
          headers: {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key":
              "API_KEY_HERE",
          },
        }
      );
      if (res.data.data.length > 0) {
        setCityData(res.data.data);
        setError(null);
      } else {
        setCityData(null);
        setError("No cities found.");
      }
    } catch (error) {
      setCityData(null);
      console.error(error);
      setError("API error. Check console.");
    }
  };

  return (
    <div>
      <h1>City Search By Name</h1>
      <p>
        This app displays a maximum of 5 cities according to the search input.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      {cityData && (
        <ul>
          {cityData
            .sort((a, b) => b.population - a.population)
            .map((city) => (
              <li key={city.id}>
                <strong>City: </strong>
                {city.name} <br />
                <strong> Region: </strong>
                {city.region} <br />
                <strong> Country: </strong>
                {city.country} <br />
                <strong> Latitude: </strong>
                {city.latitude} <br />
                <strong> Longitude: </strong>
                {city.longitude} <br />
                <strong> Population: </strong>
                {city.population}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default App;
