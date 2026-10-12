import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../passengers/Passengers.css";
import "../trains/CheckAvailability.css";
import { formatArrival } from "../trains/arrival";

const API_URL = "http://localhost:3000/bookings";

const Bookings = () => {
  const user = useSelector((state) => state.auth.user);
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setBookings(data);
      } catch {
        setError("Server is not running");
      }
    };

    loadBookings();
  }, []);

  if (!user) {
    return (
      <div className="passengers">
        <h2>My Bookings</h2>
        <p>Please login to see your bookings</p>
        <Link to="/">Login</Link>
      </div>
    );
  }

  const myBookings = bookings
    ? bookings.filter((b) => b.userName === user.userName).reverse()
    : [];

  const handleCancel = async (booking) => {
    if (!window.confirm("Cancel ticket with PNR " + booking.pnr + "?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (!res.ok) {
        setError("Could not cancel the ticket, please try again");
        return;
      }

      const updated = await res.json();
      setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
      setError("");
    } catch {
      setError("Server is not running");
    }
  };

  return (
    <div className="passengers">
      <h2>My Bookings</h2>

      {error && <p className="error">{error}</p>}

      {bookings && myBookings.length === 0 && <p>No bookings found</p>}

      {myBookings.map((b) => (
        <div className="train" key={b.id}>
          <h4>
            PNR {b.pnr} -{" "}
            <span
              className={
                b.status === "Confirmed" ? "available" : "not-available"
              }
            >
              {b.status}
            </span>
          </h4>
          <p>
            {b.trainName} ({b.trainNumber})
          </p>
          <p>
            {b.source} {b.departure} - {b.destination}{" "}
            {formatArrival(b, b.date)}
          </p>
          <p>
            {b.date} | {b.trainClass} | {b.quota} quota
          </p>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Berth Preference</th>
              </tr>
            </thead>
            <tbody>
              {b.passengers.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.berth}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Paid Rs. {b.total} by {b.method}
          </p>

          {b.status === "Confirmed" ? (
            <button onClick={() => handleCancel(b)}>Cancel Ticket</button>
          ) : (
            <p>Refund of Rs. {b.total} will be processed (mock)</p>
          )}
        </div>
      ))}

      <p>
        <Link to="/trains">Search Trains</Link>
      </p>
    </div>
  );
};

export default Bookings;
