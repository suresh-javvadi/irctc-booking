import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Passengers.css";

const API_URL = "http://localhost:3000/passengers";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPassengers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPassengers(data);
      } catch {
        setError("Server is not running");
      }
    };

    loadPassengers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name || !age) {
      setError("Please enter name and age");
      return;
    }

    if (age < 1 || age > 120) {
      setError("Please enter a valid age");
      return;
    }

    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age), gender }),
      });

      if (!res.ok) {
        setError("Could not add passenger, please try again");
        return;
      }

      const newPassenger = await res.json();
      setPassengers([...passengers, newPassenger]);
      setName("");
      setAge("");
      setGender("Male");
    } catch {
      setError("Server is not running");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setError("Could not delete passenger, please try again");
        return;
      }

      setPassengers(passengers.filter((p) => p.id !== id));
    } catch {
      setError("Server is not running");
    }
  };

  return (
    <div className="passengers">
      <h2>Passengers List</h2>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {passengers.length === 0 ? (
        <p>No passengers added</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        <Link to="/profile">Back to profile</Link>
      </p>
    </div>
  );
};

export default Passengers;
