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
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 24px", height: 56, background: "#fff",
      borderBottom: "1px solid #ebebeb",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      width: "100%", boxSizing: "border-box"
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32,
          background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
          borderRadius: 9, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 16, flexShrink: 0
        }}>
          🛍
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <span style={{
            fontSize: 17, fontWeight: 800, color: "#1c1c1e",
            letterSpacing: -0.5, lineHeight: 1
          }}>Shop</span>
          <span style={{
            fontSize: 17, fontWeight: 800, color: "#ff6b35",
            letterSpacing: -0.5, lineHeight: 1
          }}>Now</span>
        </div>
      </Link>

      {/* Cart */}
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
          transition: "background 0.15s", flexShrink: 0
        }}>
        <span style={{ fontSize: 16 }}>🛒</span>
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