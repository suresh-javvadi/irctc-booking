import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Passengers.css";

const API_URL = "http://localhost:3000/trains";
const PASSENGERS_URL = "http://localhost:3000/passengers";
const BERTHS = [
  "No Preference",
  "Lower",
  "Middle",
  "Upper",
  "Side Lower",
  "Side Upper",
];
const MAX_PASSENGERS = 6;

const PassengerDetails = () => {
  const [searchParams] = useSearchParams();
  const trainId = searchParams.get("trainId");
  const trainClass = searchParams.get("class");
  const date = searchParams.get("date");
  const quota = searchParams.get("quota");

  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [berth, setBerth] = useState("No Preference");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrain = async () => {
      try {
        const res = await fetch(`${API_URL}/${trainId}`);

        if (!res.ok) {
          setError("Train not found");
          return;
        }

        const data = await res.json();
        setTrain(data);
      } catch {
        setError("Server is not running");
      }
    };

    if (trainId) {
      loadTrain();
    }
  }, [trainId]);

  useEffect(() => {
    const loadSavedPassengers = async () => {
      try {
        const res = await fetch(PASSENGERS_URL);
        const data = await res.json();
        setSavedPassengers(data);
      } catch {
        setError("Server is not running");
      }
    };

    loadSavedPassengers();
  }, []);

  if (!trainId || !trainClass || !date || !quota) {
    return (
      <div className="passengers">
        <h2>Passenger Details</h2>
        <p>Please search trains and select a class first</p>
        <Link to="/trains">Search Trains</Link>
      </div>
    );
  }

  const seats = train?.availability?.[trainClass]?.[quota] ?? 0;
  const maxPassengers = Math.min(seats, MAX_PASSENGERS);

  const handleNameChange = (e) => {
    setName(e.target.value);

    const saved = savedPassengers.find((p) => p.name === e.target.value);
    if (saved) {
      setAge(saved.age);
      setGender(saved.gender);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !age) {
      setError("Please enter name and age");
      return;
    }

    if (age < 1 || age > 120) {
      setError("Please enter a valid age");
      return;
    }

    if (passengers.length >= maxPassengers) {
      setError("You can add only " + maxPassengers + " passengers");
      return;
    }

    setError("");
    setPassengers([
      ...passengers,
      { id: Date.now(), name, age: Number(age), gender, berth },
    ]);
    setName("");
    setAge("");
    setGender("Male");
    setBerth("No Preference");
  };

  const handleRemove = (id) => {
    setPassengers(passengers.filter((p) => p.id !== id));
    setError("");
  };

  const handleContinue = () => {
    navigate("/payment", {
      state: { train, trainClass, date, quota, passengers },
    });
  };

  return (
    <div className="passengers">
      <h2>Passenger Details</h2>

      {train && (
        <p>
          {train.name} ({train.number}) | {train.source} to {train.destination}{" "}
          | {date} | {trainClass} | {quota} quota | Available {seats}
        </p>
      )}

      {train && (
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Name"
            list="saved-passengers"
            value={name}
            onChange={handleNameChange}
          />
          <datalist id="saved-passengers">
            {savedPassengers.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <select value={berth} onChange={(e) => setBerth(e.target.value)}>
            {BERTHS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <button type="submit">Add Passenger</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      {train && passengers.length === 0 && <p>No passengers added</p>}

      {passengers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Berth Preference</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.berth}</td>
                <td>
                  <button onClick={() => handleRemove(p.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {passengers.length > 0 && (
        <p>
          <button onClick={handleContinue}>Continue</button>
        </p>
      )}

      <p>
        <Link to="/trains">Back to search</Link>
      </p>
    </div>
  );
};

export default PassengerDetails;
