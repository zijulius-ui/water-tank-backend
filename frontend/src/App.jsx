import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Login from "./Login";

function App() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [tab, setTab] = useState("dashboard");

  const [loggedIn, setLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

const fetchData = async () => {
  try {
    await axios.post(
  "https://water-tank-backend-1-mjvz.onrender.com/api/sensors",
  {
    waterLevel: 10,
    temperature: 30,
    humidity: 60,
    leakDetected: true,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

    const data = res.data;

    if (data.length > 0) {
      const newest = data[0];

      if (newest.leakDetected && (!latest || !latest.leakDetected)) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      }

      setLatest(newest);
      setHistory(data.slice(0, 10).reverse());
    }

    setLoading(false);
  } catch (err) {
    console.log(err.message);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
  const d = new Date(date);

  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();

  // add ordinal suffix (st, nd, rd, th)
  const getSuffix = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const time = d.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day}${getSuffix(day)} ${time}`;
};

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  const boxStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "12px",
  textAlign: "center",
};

const textStyle = {
  margin: 0,
  fontSize: "12px",
  opacity: 0.7,
};

const valueStyle = {
  margin: "6px 0 0",
  fontSize: "18px",
  fontWeight: "bold",
};

  return (
    <div
    style={{
  minHeight: "100vh",
  background: `
    linear-gradient(
      135deg,
      #020617 0%,
      #0f172a 25%,
      #111827 50%,
      #1e293b 75%,
      #0f172a 100%
    )
  `,
  color: "white",
  fontFamily: "Arial",
  padding: "20px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
}}

    >
      

      <h1 style={{ position: "relative", zIndex: 2 }}>
        💧 Water Tank Monitoring System
      </h1>

      {showAlert && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "red",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          ⚠️ Leak Detected in Tank A1!
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {["dashboard", "history", "settings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: tab === t ? "#38bdf8" : "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: tab === t ? "bold" : "normal",
              backdropFilter: "blur(10px)",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading || !latest ? (
        <p style={{ position: "relative", zIndex: 2 }}>Loading...</p>
      ) : (
        <>
          {/* DASHBOARD */}
          {tab === "dashboard" && (
  <div
    style={{
      marginTop: "40px",
      display: "flex",
      justifyContent: "center",
      zIndex: 2,
      position: "relative",
    }}
  >
    {/* MAIN CONTAINER */}
    <div
      style={{
        width: "460px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* TITLE */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        💧 Most Recent Readings
      </h2>

      {/* BIG STATUS INDICATOR */}
      <div
        style={{
          textAlign: "center",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          background: latest.leakDetected
            ? "rgba(255,0,0,0.15)"
            : "rgba(34,197,94,0.12)",
          border: latest.leakDetected
            ? "1px solid rgba(255,0,0,0.4)"
            : "1px solid rgba(34,197,94,0.4)",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: latest.leakDetected ? "#ff4d4d" : "#4ade80",
            fontSize: "18px",
            letterSpacing: "1px",
          }}
        >
          {latest.leakDetected ? "⚠ LEAK DETECTED" : "SYSTEM NORMAL"}
        </h3>
      </div>

      {/* DATA GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div style={boxStyle}>
          <p style={textStyle}>Water Level</p>
          <h3 style={valueStyle}>{latest.waterLevel} cm</h3>
        </div>

        <div style={boxStyle}>
          <p style={textStyle}>Temperature</p>
          <h3 style={valueStyle}>{latest.temperature} °C</h3>
        </div>

        <div style={boxStyle}>
          <p style={textStyle}>Humidity</p>
          <h3 style={valueStyle}>{latest.humidity} %</h3>
        </div>

        <div style={boxStyle}>
          <p style={textStyle}>System Health</p>
          <h3
            style={{
              ...valueStyle,
              color: latest.leakDetected ? "#ff4d4d" : "#4ade80",
            }}
          >
            {latest.leakDetected ? "Fault" : "OK"}
          </h3>
        </div>
      </div>

      {/* LAST UPDATED */}
      <div
        style={{
          marginTop: "18px",
          textAlign: "center",
          fontSize: "12px",
          opacity: 0.6,
        }}
      >
        Last updated: {formatTime(latest.createdAt)}
      </div>
    </div>
  </div>
)}

          {/* HISTORY */}
          {tab === "history" && (
            <div style={{ marginTop: "20px", position: "relative", zIndex: 2 }}>
              <h2>📜 Last 10 Water Level Readings</h2>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <XAxis dataKey="createdAt" hide />
                  <YAxis />
                  <Tooltip labelFormatter={(val) => formatTime(val)} />
                  <Line
                    type="monotone"
                    dataKey="waterLevel"
                    stroke="#38bdf8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div
                style={{
                  marginTop: "20px",
                  overflowX: "auto",
                  background: "rgba(255,255,255,0.08)",
                  padding: "15px",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <table
  style={{
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    color: "white",
  }}
>
                  
                    <thead>
  <tr style={{ textAlign: "center" }}>
                      <th>Time</th>
                      <th>Water</th>
                      <th>Temp</th>
                      <th>Humidity</th>
                      <th>Leak</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item, index) => (
                      <tr
  key={index}
  style={{
    textAlign: "center",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "10px",
    height: "37px",   
  }}
>
  
                        <td>{formatTime(item.createdAt)}</td>
                        <td>{item.waterLevel} cm</td>
                        <td>{item.temperature} °C</td>
                        <td>{item.humidity}%</td>
                        <td
                          style={{
                            color: item.leakDetected ? "#ff4d4d" : "#4ade80",
                            fontWeight: "bold",
                          }}
                        >
                          {item.leakDetected ? "Leak" : "Safe"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS (UPDATED ONLY THIS SECTION) */}
          {tab === "settings" && (
            <div
              style={{
                marginTop: "20px",
                position: "relative",
                zIndex: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "420px",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
              >
                <h2>⚙️ Settings</h2>

                <div style={{ marginTop: "15px" }}>
                  <h3>👤 Account</h3>
                  <p>Email: {localStorage.getItem("email")}</p>
                  <p>Status: Active</p>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <h3>📡 System</h3>
                  <p>Backend: Connected</p>
                  <p>Sensor Feed: Live</p>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <h3>🔔 Alerts</h3>
                  <p>Leak Detection: Enabled</p>
                </div>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "12px",
              textAlign: "center",
              width: "300px",
              color: "white",
            }}
          >
            <h3>⚠️ Confirm Logout</h3>
            <p>Are you sure?</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, padding: "10px" }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("email");
                  setLoggedIn(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#ef4444",
                  color: "white",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
