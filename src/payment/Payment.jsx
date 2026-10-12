import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../passengers/Passengers.css";
import { formatArrival, getArrivalDay } from "../trains/arrival";

const METHODS = ["UPI", "Debit Card", "Credit Card"];

const Payment = () => {
  const { state } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [method, setMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="passengers">
        <h2>Payment</h2>
        <p>Please add passenger details first</p>
        <Link to="/trains">Search Trains</Link>
      </div>
    );
  }

  const { train, trainClass, date, quota, passengers } = state;
  const fare = train.fare[trainClass];
  const total = fare * passengers.length;

  const handlePay = async (e) => {
    e.preventDefault();

    if (method === "UPI") {
      if (!/^[\w.-]+@[a-zA-Z]+$/.test(upiId)) {
        setError("Please enter a valid UPI ID");
        return;
      }
    } else {
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("Card number must be 16 digits");
        return;
      }

      if (!cardName.trim()) {
        setError("Please enter the name on card");
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setError("Expiry must be in MM/YY format");
        return;
      }

      const [month, year] = expiry.split("/");
      if (new Date(2000 + Number(year), Number(month), 1) <= new Date()) {
        setError("Card is expired");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        setError("CVV must be 3 digits");
        return;
      }
    }

    setError("");

    const booking = {
      pnr: String(Math.floor(1000000000 + Math.random() * 9000000000)),
      userName: user ? user.userName : "",
      trainName: train.name,
      trainNumber: train.number,
      source: train.source,
      destination: train.destination,
      departure: train.departure,
      arrival: train.arrival,
      arrivalDay: getArrivalDay(train),
      date,
      trainClass,
      quota,
      passengers,
      total,
      method,
      status: "Confirmed",
      bookedOn: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!res.ok) {
        setError("Could not save the booking, please try again");
        return;
      }

      navigate("/bookings");
    } catch {
      setError("Server is not running");
    }
  };

  return (
    <div className="passengers">
      <h2>Payment</h2>
      <p>
        {train.name} ({train.number}) | {train.source} to {train.destination} |{" "}
        {date} | {trainClass} | {quota} quota
      </p>
      <p>
        Departs {train.departure} | Arrives {formatArrival(train, date)}
      </p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Berth Preference</th>
            <th>Fare</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.berth}</td>
              <td>Rs. {fare}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: Rs. {total}</h3>

      {METHODS.map((m) => (
        <p key={m}>
          <label>
            <input
              type="radio"
              name="method"
              checked={method === m}
              onChange={() => {
                setMethod(m);
                setError("");
              }}
            />{" "}
            {m}
          </label>
        </p>
      ))}

      <form onSubmit={handlePay}>
        {method === "UPI" ? (
          <input
            type="text"
            placeholder="UPI ID (name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <input
              type="password"
              placeholder="CVV"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </>
        )}
        <button type="submit">Pay Rs. {total}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        <Link to="/trains">Back to search</Link>
      </p>
    </div>
  );
};

export default Payment;
