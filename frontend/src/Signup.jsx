import { useState } from "react";
import axios from "axios";

export default function Signup({ setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // VALIDATION (THIS FIXES YOUR "EMPTY ACCOUNT" BUG)
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://water-tank-backend-1-mjvz.onrender.com/api/signup",
        { email, password }
      );

      setSuccess("Account created successfully!");

      // optional: auto return to login after signup
      setTimeout(() => {
        setShowSignup(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a, #020617)",
        fontFamily: "Arial",
        color: "white",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <h2>📝 Create Account</h2>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {success && (
          <p style={{ color: "#4ade80" }}>{success}</p>
        )}

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* RETURN TO LOGIN BUTTON */}
        <button
          onClick={() => setShowSignup(false)}
          style={{
            marginTop: "10px",
            background: "transparent",
            border: "1px solid #38bdf8",
            color: "#38bdf8",
            padding: "10px",
            borderRadius: "8px",
            width: "100%",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#38bdf8",
  fontWeight: "bold",
  cursor: "pointer",
};