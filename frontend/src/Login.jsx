import { useEffect, useState } from "react";
import axios from "axios";
import Signup from "./Signup";

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 👤 STORED USER
  const storedEmail = localStorage.getItem("email");

  // 🔐 AUTO LOGIN ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  // 🚪 LOGOUT FUNCTION (reusable later in Settings too)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setLoggedIn(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://water-tank-backend-1-mjvz.onrender.com/api/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);

      setSuccess("Login successful!");
      setLoggedIn(true);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Login failed. Check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔁 SWITCH TO SIGNUP
  if (showSignup) {
    return <Signup setShowSignup={setShowSignup} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #000000)",
        fontFamily: "Arial",
      }}
    >
      {/* LOGIN CARD */}
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          color: "white",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>🔐 Login</h2>

        {/* 👤 USER INFO */}
        {storedEmail && (
          <div
            style={{
              marginBottom: "15px",
              fontSize: "13px",
              opacity: 0.8,
            }}
          >
            👤 Logged in as: <b>{storedEmail}</b>
          </div>
        )}

        {/* 🚪 LOGOUT BUTTON */}
        {storedEmail && (
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#ff4d4d",
              padding: "8px",
              borderRadius: "8px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div
            style={{
              background: "#4ade80",
              padding: "8px",
              borderRadius: "8px",
              marginBottom: "10px",
              fontSize: "14px",
              color: "black",
            }}
          >
            {success}
          </div>
        )}

        {/* EMAIL */}
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: loading ? "#64748b" : "#38bdf8",
            color: "black",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p style={{ fontSize: "14px", opacity: 0.8 }}>
          Don’t have an account?
        </p>

        <button
          onClick={() => setShowSignup(true)}
          style={{
            background: "transparent",
            border: "1px solid #38bdf8",
            color: "#38bdf8",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Go to Signup
        </button>
      </div>
    </div>
  );
}