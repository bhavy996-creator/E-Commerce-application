import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ListingPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const { cart, addToCart, changeQty } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then(r => r.json())
      .then(d => setProducts(d.products));
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];

  let filtered = products
    .filter(p => category === "all" || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(rating) ? "#f59e0b" : "#e5e7eb", fontSize: 14 }}>★</span>
    ));
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "48px 24px", textAlign: "center", color: "#fff"
      }}>
        <p style={{ fontSize: 13, letterSpacing: 3, color: "#f59e0b", marginBottom: 10, textTransform: "uppercase" }}>
          ✦ AI-Curated Collection
        </p>
        <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          Discover Products <br />
          <span style={{ color: "#f59e0b" }}>You'll Love</span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 28 }}>
          194 hand-picked products · Free shipping over $50
        </p>

        {/* Search inside hero */}
        <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
          <input
            placeholder="Search for products, brands, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 44px",
              borderRadius: 50, border: "none", fontSize: 15,
              outline: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
            }}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #f1f5f9",
        padding: "0 24px", position: "sticky", top: 56, zIndex: 90,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0", scrollbarWidth: "none" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "6px 16px", borderRadius: 50, border: "1.5px solid",
              borderColor: category === c ? "#D85A30" : "#e5e7eb",
              background: category === c ? "#D85A30" : "#fff",
              color: category === c ? "#fff" : "#374151",
              cursor: "pointer", fontSize: 13, fontWeight: 500,
              whiteSpace: "nowrap", transition: "all 0.15s"
            }}>
              {c === "all" ? "🛍 All" : c}
            </button>
          ))}
        </div>

        {/* Sort + Results count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10 }}>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            <strong style={{ color: "#111" }}>{filtered.length}</strong> products found
          </p>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8,
            fontSize: 13, color: "#374151", background: "#fff", cursor: "pointer"
          }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 }}>
        {filtered.map(p => {
          const ogPrice = (p.price / (1 - p.discountPercentage / 100)).toFixed(2);
          const inCart = cart[p.id];
          return (
            <div key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              style={{
                background: "#fff", borderRadius: 16, overflow: "hidden",
                border: "1px solid #f1f5f9", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>

              {/* Image + Discount Badge */}
              <div style={{ position: "relative", background: "#f8fafc", padding: 16, textAlign: "center" }}>
                <img src={p.thumbnail} alt={p.title}
                  style={{ width: "100%", height: 150, objectFit: "contain" }} />
                {p.discountPercentage > 5 && (
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: "#ef4444", color: "#fff", fontSize: 11,
                    fontWeight: 700, padding: "3px 8px", borderRadius: 50
                  }}>
                    -{Math.round(p.discountPercentage)}%
                  </span>
                )}
                {p.stock < 10 && (
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#f59e0b", color: "#fff", fontSize: 10,
                    fontWeight: 600, padding: "3px 8px", borderRadius: 50
                  }}>
                    Only {p.stock} left!
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {p.category}
                </p>
                <p style={{
                  fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 6,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4
                }}>
                  {p.title}
                </p>

                {/* Stars */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                  {renderStars(p.rating)}
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{p.rating.toFixed(1)}</span>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#D85A30" }}>${p.price.toFixed(2)}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af", textDecoration: "line-through" }}>${ogPrice}</span>
                </div>

                {/* Cart Controls */}
                {inCart ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onClick={e => e.stopPropagation()}>
                    <button onClick={() => changeQty(p.id, -1)} style={styles.qtyBtn}>−</button>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{inCart.qty}</span>
                    <button onClick={() => changeQty(p.id, 1)} style={{ ...styles.qtyBtn, background: "#D85A30", color: "#fff", borderColor: "#D85A30" }}>+</button>
                  </div>
                ) : (
                  <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={styles.addBtn}>
                    + Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  qtyBtn: {
    width: 34, height: 34, borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  addBtn: {
    width: "100%", padding: "9px 0", borderRadius: 10,
    background: "linear-gradient(135deg, #D85A30, #f59e0b)",
    color: "#fff", border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, letterSpacing: 0.3
  }
};