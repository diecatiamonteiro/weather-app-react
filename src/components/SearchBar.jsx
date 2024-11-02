import "./SearchBar.css";

export default function SearchBar({
  city,
  setCity,
  handleSearch,
  is24HourFormat,
  setIs24HourFormat,
  isCelsius,
  setIsCelsius,
}) {
  return (
    <>
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            className="input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button className="search-button" type="submit">
            SEARCH
          </button>
        </form>
      </div>
      <div className="format-buttons">
        <button onClick={() => setIs24HourFormat(!is24HourFormat)}>
          {is24HourFormat ? "12H" : "24H"}
        </button>
        <button onClick={() => setIsCelsius(!isCelsius)}>
          {isCelsius ? "°F" : "°C"}
        </button>
      </div>
    </>
  );
}
