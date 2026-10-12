import { Link } from "react-router-dom";
import "./passengers/Passengers.css";

const Unauthorized = () => {
  return (
    <div className="passengers">
      <h2>Unauthorized</h2>
      <p>You do not have permission to view this page</p>
      <Link to="/trains">Search Trains</Link>
      <br />
      <Link to="/login">Login with another account</Link>
    </div>
  );
};

export default Unauthorized;
