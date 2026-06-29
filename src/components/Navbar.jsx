import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 28px", height: 56, background: "#fff",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky", top: 0, zIndex: 100
    }}>

      {/* Logo */}
      <Link to="/" style={{
        textDecoration: "none", display: "flex",
        alignItems: "center", gap: 6
      }}>
        <span style={{
          width: 30, height: 30, background: "#111827",
          borderRadius: 8, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 15
        }}>🛍</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#111827", letterSpacing: -0.3 }}>
          Shop<span style={{ color: "#f97316" }}>Now</span>
        </span>
      </Link>

      {/* Cart Button */}
      <button onClick={() => navigate("/cart")} style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 18px", borderRadius: 10,
        background: totalItems > 0 ? "#111827" : "#f4f4f5",
        color: totalItems > 0 ? "#fff" : "#374151",
        border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 14, transition: "all 0.2s"
      }}>
        <span>🛒</span>
        <span>Cart</span>
        {totalItems > 0 && (
          <span style={{
            background: "#f97316", color: "#fff",
            borderRadius: 50, width: 20, height: 20,
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
}