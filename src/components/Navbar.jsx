import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 24px", height: 56, background: "#fff",
      borderBottom: "1px solid #f1f5f9", position: "sticky",
      top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>🛍</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>Shop</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#D85A30" }}>Now</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate("/cart")} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 18px", borderRadius: 50,
          background: totalItems > 0 ? "#D85A30" : "#fff",
          color: totalItems > 0 ? "#fff" : "#374151",
          border: "1.5px solid", borderColor: totalItems > 0 ? "#D85A30" : "#e5e7eb",
          cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s"
        }}>
          🛒
          {totalItems > 0
            ? <span>Cart · {totalItems}</span>
            : <span>Cart</span>
          }
        </button>
      </div>
    </nav>
  );
}