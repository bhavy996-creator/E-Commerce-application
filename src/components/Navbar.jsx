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
      padding: "0 28px", height: 56, background: "#fff",
      borderBottom: "1px solid #ebebeb",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
    }}>

      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 28, height: 28, background: "#1c1c1e",
          borderRadius: 8, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14
        }}>🛍</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1c1c1e", letterSpacing: -0.3 }}>
          Shop<span style={{ color: "#ff6b35" }}>Now</span>
        </span>
      </Link>

      <button
        onClick={() => navigate("/cart")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 10,
          background: hovered ? "#f5f5f0" : "#fff",
          color: "#1c1c1e",
          border: "1.5px solid #e0e0e0",
          cursor: "pointer", fontWeight: 600,
          fontSize: 14, transition: "background 0.15s"
        }}>
        <span>🛒</span>
        <span>Cart</span>
        {totalItems > 0 && (
          <span style={{
            background: "#ff6b35", color: "#fff",
            borderRadius: 50, minWidth: 20, height: 20,
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px"
          }}>
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
}