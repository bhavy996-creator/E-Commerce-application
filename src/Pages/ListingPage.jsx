import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ListingPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [hoveredId, setHoveredId] = useState(null);
  const { cart, addToCart, changeQty } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then(r => r.json())
      .then(d => setProducts(d.products));
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];

  let filtered = [...products]
    .filter(p => category === "all" || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "#0f0f0f",
        padding: "60px 32px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: 44,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -1.5,
          marginBottom: 8,
          lineHeight: 1.1
        }}>
          Find what you love.
        </h1>
        <p style={{
          color: "#555",
          fontSize: 15,
          marginBottom: 32,
          fontWeight: 400
        }}>
          194 products — free shipping above $50
        </p>

        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: "4px 4px 4px 16px",
          gap: 8
        }}>
          <span style={{ color: "#555", fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#fff",
              padding: "10px 0"
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              background: "#2a2a2a", border: "none", color: "#888",
              borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Sticky Filter Row */}
      <div style={{
        position: "sticky", top: 56, zIndex: 90,
        background: "#fff", borderBottom: "1px solid #f0f0f0"
      }}>
        {/* Category scroll */}
        <div style={{
          display: "flex", gap: 6, overflowX: "auto",
          padding: "12px 24px 0", scrollbarWidth: "none"
        }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid",
              borderColor: category === c ? "#0f0f0f" : "#e8e8e8",
              background: category === c ? "#0f0f0f" : "#fafafa",
              color: category === c ? "#fff" : "#555",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: category === c ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.12s",
              letterSpacing: 0.2
            }}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* Count + Sort */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "10px 24px"
        }}>
          <span style={{ fontSize: 13, color: "#999" }}>
            {filtered.length} products
          </span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              fontSize: 13, color: "#333", background: "#fafafa",
              border: "1px solid #e8e8e8", borderRadius: 6,
              padding: "5px 10px", cursor: "pointer", outline: "none"
            }}>
            <option value="default">Default</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1px",
        background: "#f0f0f0",
        borderTop: "1px solid #f0f0f0"
      }}>
        {filtered.map(p => {
          const ogPrice = (p.price / (1 - p.discountPercentage / 100)).toFixed(2);
          const inCart = cart[p.id];
          const isHovered = hoveredId === p.id;

          return (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isHovered ? "#fafafa" : "#fff",
                cursor: "pointer",
                transition: "background 0.15s",
                position: "relative",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Image Block */}
              <div style={{
                background: "#f7f7f7",
                height: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  style={{
                    maxHeight: 180,
                    maxWidth: "85%",
                    objectFit: "contain",
                    transition: "transform 0.3s",
                    transform: isHovered ? "scale(1.05)" : "scale(1)"
                  }}
                />
                {/* Discount tag */}
                {p.discountPercentage > 2 && (
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: "#ff3b30", color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    padding: "2px 7px", borderRadius: 4,
                    letterSpacing: 0.3
                  }}>
                    -{Math.round(p.discountPercentage)}%
                  </span>
                )}
                {p.stock < 10 && (
                  <span style={{
                    position: "absolute", bottom: 10, left: 12,
                    background: "rgba(0,0,0,0.65)", color: "#fff",
                    fontSize: 10, fontWeight: 500,
                    padding: "2px 8px", borderRadius: 4
                  }}>
                    Only {p.stock} left
                  </span>
                )}
              </div>

              {/* Info Block */}
              <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{
                  fontSize: 11, color: "#bbb", textTransform: "uppercase",
                  letterSpacing: 1, fontWeight: 500
                }}>
                  {p.category}
                </p>
                <p style={{
                  fontSize: 14, fontWeight: 500, color: "#111",
                  lineHeight: 1.4, marginBottom: 4,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {p.title}
                </p>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{
                    background: p.rating >= 4 ? "#1a7a4a" : p.rating >= 3 ? "#e67e00" : "#cc3300",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 4,
                    display: "flex", alignItems: "center", gap: 3
                  }}>
                    {p.rating.toFixed(1)} ★
                  </div>
                  <span style={{ fontSize: 11, color: "#bbb" }}>({p.stock} in stock)</span>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
                    ${p.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>
                    ${ogPrice}
                  </span>
                </div>

                {/* Cart Controls */}
                <div style={{ marginTop: 10 }} onClick={e => e.stopPropagation()}>
                  {inCart ? (
                    <div style={{
                      display: "flex", alignItems: "center",
                      border: "1.5px solid #0f0f0f", borderRadius: 8,
                      overflow: "hidden"
                    }}>
                      <button
                        onClick={() => changeQty(p.id, -1)}
                        style={{
                          flex: 1, padding: "8px", background: "#fff",
                          border: "none", cursor: "pointer",
                          fontSize: 16, fontWeight: 700, color: "#111"
                        }}>−</button>
                      <span style={{
                        flex: 1, textAlign: "center", fontWeight: 700,
                        fontSize: 14, background: "#0f0f0f", color: "#fff",
                        padding: "8px 0"
                      }}>{inCart.qty}</span>
                      <button
                        onClick={() => changeQty(p.id, 1)}
                        style={{
                          flex: 1, padding: "8px", background: "#fff",
                          border: "none", cursor: "pointer",
                          fontSize: 16, fontWeight: 700, color: "#111"
                        }}>+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      style={{
                        width: "100%", padding: "9px",
                        background: isHovered ? "#0f0f0f" : "#fff",
                        color: isHovered ? "#fff" : "#111",
                        border: "1.5px solid #0f0f0f",
                        borderRadius: 8, cursor: "pointer",
                        fontSize: 13, fontWeight: 600,
                        transition: "all 0.15s"
                      }}>
                      + Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}