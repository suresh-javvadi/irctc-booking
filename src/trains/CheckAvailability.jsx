import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import "../passengers/Passengers.css";
import { fetchTrains } from "../store/trainsSlice";
import "./CheckAvailability.css";
import { formatArrival } from "./arrival";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CheckAvailability = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const quota = searchParams.get("quota");

  const trains = useSelector((state) => state.trains.items);
  const loaded = useSelector((state) => state.trains.loaded);
  const error = useSelector((state) => state.trains.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrains());
  }, [dispatch]);

  if (!source || !destination || !date || !quota) {
    return (
      <div className="passengers">
        <h2>Check Availability</h2>
        <p>Please search trains first</p>
        <Link to="/trains">Search Trains</Link>
      </div>
    );
  }

  const day = DAYS[new Date(date + "T00:00").getDay()];
  const results = trains.filter(
    (t) =>
      t.source === source &&
      t.destination === destination &&
      t.days.includes(day),
  );

  return (
    <div className="passengers">
      <h2>Check Availability</h2>
      <p>
        {source} to {destination} | {date} | {quota} quota
      </p>

      {error && <p className="error">{error}</p>}

      {loaded && results.length === 0 && <p>No trains found</p>}

      {results.map((t) => (
        <div className="train" key={t.id}>
          <h4>
            {t.name} ({t.number})
          </h4>
          <p>
            {t.source} {t.departure} - {t.destination}{" "}
            {formatArrival(t, date)}
          </p>

          <div className="class-boxes">
            {Object.keys(t.availability).map((c) => {
              const seats = t.availability[c][quota];

              if (seats > 0) {
                const params = new URLSearchParams({
                  trainId: t.id,
                  class: c,
                  date,
                  quota,
                });

                return (
                  <Link
                    className="class-box"
                    key={c}
                    to={"/passenger-details?" + params}
                  >
                    <strong>{c}</strong>
                    <span className="available">Available {seats}</span>
                  </Link>
                );
              }

              return (
                <div className="class-box" key={c}>
                  <strong>{c}</strong>
                  <span className="not-available">Not available</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p>
        <Link to="/trains">Back to search</Link>
      </p>
    </div>
  );
};

export default CheckAvailability;
