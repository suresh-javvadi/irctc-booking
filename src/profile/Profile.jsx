import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";
import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="profile">
      <h2>User Profile</h2>
      {user ? (
        <>
          <p>User Name: {user.userName}</p>
          {user.email && <p>Email: {user.email}</p>}
          {user.role === "admin" && <p>Role: Admin</p>}
        </>
      ) : (
        <p>No user logged in</p>
      )}
      <div className="profile-links">
        <Link to="/passengers">Passengers List</Link>
        <br />
        <Link to="/trains">Search Trains</Link>
        <br />
        <Link to="/bookings">My Bookings</Link>
        {user?.role === "admin" && (
          <>
            <br />
            <Link to="/admin/trains">Manage Train Routes</Link>
            <br />
            <Link to="/admin/users">Manage Users</Link>
          </>
        )}
      </div>
      <p>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </p>
    </div>
  );
};

export default Profile;
