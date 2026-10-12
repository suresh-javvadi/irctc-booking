import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../passengers/Passengers.css";
import { fetchTrains } from "../store/trainsSlice";

const SearchTrains = () => {
  const trains = useSelector((state) => state.trains.items);
  const loadError = useSelector((state) => state.trains.error);
  const dispatch = useDispatch();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [selectedQuota, setSelectedQuota] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    dispatch(fetchTrains());
  }, [dispatch]);

  const sources = [...new Set(trains.map((t) => t.source))]
    .filter((s) => s !== destination)
    .sort();
  const destinations = [...new Set(trains.map((t) => t.destination))]
    .filter((d) => d !== source)
    .sort();
  const quotas = [
    ...new Set(
      trains.flatMap((t) =>
        Object.values(t.availability).flatMap((c) => Object.keys(c)),
      ),
    ),
  ];
  const quota = selectedQuota || quotas[0] || "";

  const handleSearch = (e) => {
    e.preventDefault();

    if (!source || !destination || !date || !quota) {
      setError("Please select source, destination and date");
      return;
    }

    if (source === destination) {
      setError("Source and destination cannot be same");
      return;
    }

    if (date < today) {
      setError("Please select today or a future date");
      return;
    }

    setError("");

    const params = new URLSearchParams({ source, destination, date, quota });
    navigate("/availability?" + params);
  };

  return (
    <div className="passengers">
      <div className="search-header">
        <h2>Search Trains</h2>
        <p>
          <Link to="/profile">Profile</Link>
        </p>
      </div>

      <form onSubmit={handleSearch}>
        <div className="search-train-form">
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Source</option>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Destination</option>
            {destinations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            value={quota}
            onChange={(e) => setSelectedQuota(e.target.value)}
          >
            {quotas.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          <button type="submit">Search</button>
        </div>
      </form>

      {(error || loadError) && <p className="error">{error || loadError}</p>}
    </div>
  );
};

export default SearchTrains;
