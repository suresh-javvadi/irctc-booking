import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../passengers/Passengers.css";
import { addTrain, fetchTrains } from "../store/trainsSlice";
import "./AdminTrains.css";
import { getArrivalDay } from "../trains/arrival";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CLASSES = ["SL", "3A", "2A", "1A"];
const QUOTAS = ["General", "Tatkal", "Ladies"];
const ARRIVAL_DAYS = [
  { value: 1, label: "Same day" },
  { value: 2, label: "Next day (Day 2)" },
  { value: 3, label: "Day 3" },
  { value: 4, label: "Day 4" },
];

const emptyClasses = () =>
  Object.fromEntries(
    CLASSES.map((c) => [c, { fare: "", General: "", Tatkal: "", Ladies: "" }]),
  );

const AdminTrains = () => {
  const trains = useSelector((state) => state.trains.items);
  const loadError = useSelector((state) => state.trains.error);
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [arrivalDay, setArrivalDay] = useState(1);
  const [days, setDays] = useState(DAYS);
  const [classes, setClasses] = useState(emptyClasses);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchTrains());
  }, [dispatch]);

  const toggleDay = (day) => {
    setDays(
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
    );
  };

  const handleClassChange = (c, field, value) => {
    setClasses({ ...classes, [c]: { ...classes[c], [field]: value } });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    const trainSource = source.trim();
    const trainDestination = destination.trim();

    if (
      !number ||
      !name.trim() ||
      !trainSource ||
      !trainDestination ||
      !departure ||
      !arrival
    ) {
      setError("Please fill all the train details");
      return;
    }

    if (!/^\d{5}$/.test(number)) {
      setError("Train number must be 5 digits");
      return;
    }

    if (trains.some((t) => t.number === number)) {
      setError("Train number already exists");
      return;
    }

    if (trainSource.toLowerCase() === trainDestination.toLowerCase()) {
      setError("Source and destination cannot be same");
      return;
    }

    if (arrivalDay === 1 && arrival <= departure) {
      setError("Arrival must be after departure, or select a later arrival day");
      return;
    }

    if (days.length === 0) {
      setError("Please select at least one day");
      return;
    }

    const selected = CLASSES.filter((c) => classes[c].fare !== "");

    if (selected.length === 0) {
      setError("Please enter fare for at least one class");
      return;
    }

    const invalid = selected.some(
      (c) =>
        Number(classes[c].fare) <= 0 ||
        QUOTAS.some((q) => Number(classes[c][q]) < 0),
    );

    if (invalid) {
      setError("Please enter valid fare and seats");
      return;
    }

    setError("");

    const availability = {};
    const fare = {};

    selected.forEach((c) => {
      availability[c] = Object.fromEntries(
        QUOTAS.map((q) => [q, Number(classes[c][q])]),
      );
      fare[c] = Number(classes[c].fare);
    });

    try {
      await dispatch(
        addTrain({
          number,
          name: name.trim(),
          source: trainSource,
          destination: trainDestination,
          departure,
          arrival,
          arrivalDay,
          days: DAYS.filter((d) => days.includes(d)),
          availability,
          fare,
        }),
      ).unwrap();

      setMessage("Train route added");
      setNumber("");
      setName("");
      setSource("");
      setDestination("");
      setDeparture("");
      setArrival("");
      setArrivalDay(1);
      setDays(DAYS);
      setClasses(emptyClasses());
    } catch (message) {
      setError(message);
    }
  };

  return (
    <div className="passengers">
      <div className="search-header">
        <h2>Train Routes</h2>
        <p>
          <Link to="/profile">Profile</Link>
        </p>
      </div>

      <h4>Add Train Route</h4>

      <form className="admin-form" onSubmit={handleAdd}>
        <div className="admin-row">
          <input
            type="text"
            placeholder="Train Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Train Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="admin-row">
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="admin-row">
          <label>
            Departure{" "}
            <input
              type="time"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </label>
          <label>
            Arrival{" "}
            <input
              type="time"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
          </label>
          <select
            value={arrivalDay}
            onChange={(e) => setArrivalDay(Number(e.target.value))}
          >
            {ARRIVAL_DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                Arrives: {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-row">
          {DAYS.map((d) => (
            <label key={d}>
              <input
                type="checkbox"
                checked={days.includes(d)}
                onChange={() => toggleDay(d)}
              />
              {d}
            </label>
          ))}
        </div>

        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Fare</th>
              {QUOTAS.map((q) => (
                <th key={q}>{q} seats</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((c) => (
              <tr key={c}>
                <td>{c}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={classes[c].fare}
                    onChange={(e) =>
                      handleClassChange(c, "fare", e.target.value)
                    }
                  />
                </td>
                {QUOTAS.map((q) => (
                  <td key={q}>
                    <input
                      type="number"
                      min="0"
                      value={classes[c][q]}
                      onChange={(e) => handleClassChange(c, q, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">Leave fare empty for classes the train does not have</p>

        <button type="submit">Add Train Route</button>
      </form>

      {(error || loadError) && <p className="error">{error || loadError}</p>}
      {message && <p className="success">{message}</p>}

      <h4>All Train Routes</h4>

      {trains.length === 0 ? (
        <p>No train routes added</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Route</th>
              <th>Time</th>
              <th>Classes</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((t) => (
              <tr key={t.id}>
                <td>{t.number}</td>
                <td>{t.name}</td>
                <td>
                  {t.source} to {t.destination}
                </td>
                <td>
                  {t.departure} - {t.arrival}
                  {getArrivalDay(t) > 1 && ` (Day ${getArrivalDay(t)})`}
                </td>
                <td>{Object.keys(t.fare).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTrains;
