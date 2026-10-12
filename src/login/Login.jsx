import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import "./Login.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      setError("Please enter user name and password");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();
      const user = users.find(
        (u) => u.userName === userName && u.password === password,
      );

      if (!user) {
        setError("Invalid user name or password");
        return;
      }

      dispatch(
        login({
          userName: user.userName,
          email: user.email,
          role: user.role || "user",
        }),
      );
      navigate(user.role === "admin" ? "/admin/trains" : "/trains");
    } catch {
      setError("Server is not running");
    }
  };

  return (
    <div className="login">
      <h2>IRCTC Login</h2>

      <form onSubmit={handleSubmit}>
        <label>User Name</label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show password
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit">
          Login
        </button>
      </form>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
