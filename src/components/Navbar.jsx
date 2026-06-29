import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 24px",
      height: 56,
      background: "#fff",
      borderBottom: "1px solid #ebebeb",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxSizing: "border-box",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>

      <Link to="/" style={{
        textDecoration: "none", display: "flex",
        alignItems: "center", gap: 10, flexShrink: 0
      }}>
        <div style={{
          width: 30, height: 30,
          background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
          borderRadius: 8, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, flexShrink: 0
        }}>
          🛍
        </div>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{
            fontSize: 17, fontWeight: 800, color: "#1c1c1e",
            letterSpacing: -0.5, fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}>Shop</span>
          <span style={{
            fontSize: 17, fontWeight: 800, color: "#ff6b35",
            letterSpacing: -0.5, fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}>Now</span>
        </div>
      </Link>

      <button
        onClick={() => navigate("/cart")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 16px", borderRadius: 10,
          background: hovered ? "#f5f5f0" : "#fff",
          color: "#1c1c1e", border: "1.5px solid #e0e0e0",
          cursor: "pointer", fontWeight: 600, fontSize: 14,
          transition: "background 0.15s", flexShrink: 0,
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }}>
        <span>🛒</span>
        <span>Cart</span>
        {totalItems > 0 && (
          <span style={{
            background: "#ff6b35", color: "#fff",
            borderRadius: 50, minWidth: 20, height: 20,
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center",
            justifyContent: "center", padding: "0 5px"
          }}>
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
}