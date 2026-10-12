import { Link } from "react-router-dom";
import "./passengers/Passengers.css";

const NotFound = () => {
  return (
    <div className="passengers">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist</p>
      <Link to="/trains">Search Trains</Link>
    </div>
  );
};

export default NotFound;
