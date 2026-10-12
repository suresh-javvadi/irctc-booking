import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../passengers/Passengers.css";

const API_URL = "http://localhost:3000/users";

const AdminUsers = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsers(data);
      } catch {
        setError("Server is not running");
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (user, role) => {
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        setError("Could not update the role, please try again");
        return;
      }

      const updated = await res.json();
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setError("");
    } catch {
      setError("Server is not running");
    }
  };

  return (
    <div className="passengers">
      <div className="search-header">
        <h2>Users</h2>
        <p>
          <Link to="/profile">Profile</Link>
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdmin = u.role === "admin";

              return (
                <tr key={u.id}>
                  <td>{u.userName}</td>
                  <td>{u.email}</td>
                  <td>{isAdmin ? "Admin" : "User"}</td>
                  <td>
                    {u.userName === currentUser.userName ? (
                      "You"
                    ) : (
                      <button
                        onClick={() =>
                          handleRoleChange(u, isAdmin ? "user" : "admin")
                        }
                      >
                        {isAdmin ? "Remove admin" : "Make admin"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
