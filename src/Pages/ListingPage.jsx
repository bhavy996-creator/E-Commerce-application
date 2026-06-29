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
    <div style={{ background: "#f5f5f0", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #1c1c1e 0%, #2c2c2e 100%)",
        padding: "56px 32px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: 42, fontWeight: 700, color: "#f5f5f0",
          letterSpacing: -1.2, marginBottom: 10, lineHeight: 1.15
        }}>
          Find what you love.
        </h1>
        <p style={{ color: "#8e8e93", fontSize: 15, marginBottom: 30 }}>
          194 products · Free shipping above $50
        </p>

        <div style={{
          maxWidth: 480, margin: "0 auto",
          display: "flex", alignItems: "center",
          background: "#fff", border: "1px solid #e0e0e0",
          borderRadius: 12, padding: "4px 4px 4px 14px", gap: 8
        }}>
          <span style={{ color: "#aaa", fontSize: 15 }}>🔍</span>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none",
              outline: "none", fontSize: 14, color: "#1c1c1e", padding: "9px 0"
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              background: "#f0f0f0", border: "none", color: "#888",
              borderRadius: 8, padding: "7px 11px", cursor: "pointer", fontSize: 12
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        position: "sticky", top: 56, zIndex: 90,
        background: "#fff", borderBottom: "1px solid #ebebeb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          display: "flex", gap: 6, overflowX: "auto",
          padding: "12px 24px 0", scrollbarWidth: "none"
        }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "6px 14px", borderRadius: 20,
              border: "1.5px solid",
              borderColor: category === c ? "#1c1c1e" : "#e5e5e5",
              background: category === c ? "#1c1c1e" : "#fff",
              color: category === c ? "#fff" : "#555",
              cursor: "pointer", fontSize: 12,
              fontWeight: category === c ? 600 : 400,
              whiteSpace: "nowrap", transition: "all 0.12s"
            }}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "10px 24px"
        }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>{filtered.length} products</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            fontSize: 13, color: "#333", background: "#fff",
            border: "1px solid #e5e5e5", borderRadius: 8,
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
        gap: 20, padding: 24
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
                background: "#fff",
                borderRadius: 16,
                border: "1px solid",
                borderColor: isHovered ? "#d0d0d0" : "#ebebeb",
                cursor: "pointer",
                overflow: "hidden",
                boxShadow: isHovered
                  ? "0 12px 32px rgba(0,0,0,0.10)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)"
              }}
            >
              {/* Image */}
              <div style={{
                background: "#fafaf8", height: 200,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
              }}>
                <img src={p.thumbnail} alt={p.title} style={{
                  maxHeight: 165, maxWidth: "82%", objectFit: "contain",
                  transition: "transform 0.3s",
                  transform: isHovered ? "scale(1.06)" : "scale(1)"
                }} />
                {p.discountPercentage > 2 && (
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: "#ff3b30", color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    padding: "3px 8px", borderRadius: 6
                  }}>
                    -{Math.round(p.discountPercentage)}%
                  </span>
                )}
                {p.stock < 10 && (
                  <span style={{
                    position: "absolute", bottom: 10, left: 10,
                    background: "rgba(28,28,30,0.7)", color: "#fff",
                    fontSize: 10, padding: "2px 8px", borderRadius: 4
                  }}>
                    Only {p.stock} left
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                <p style={{
                  fontSize: 10, color: "#b0b0b0", textTransform: "uppercase",
                  letterSpacing: 1, fontWeight: 600
                }}>{p.category}</p>

                <p style={{
                  fontSize: 14, fontWeight: 600, color: "#1c1c1e", lineHeight: 1.4,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>{p.title}</p>

                {/* Rating pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    background: p.rating >= 4 ? "#e8f5ee" : p.rating >= 3 ? "#fff4e5" : "#fff0f0",
                    color: p.rating >= 4 ? "#1a7a4a" : p.rating >= 3 ? "#b45309" : "#cc2200",
                    fontSize: 11, fontWeight: 700,
                    padding: "2px 7px", borderRadius: 6
                  }}>
                    ★ {p.rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 11, color: "#c0c0c0" }}>{p.stock} in stock</span>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#1c1c1e" }}>
                    ${p.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 12, color: "#c8c8c8", textDecoration: "line-through" }}>
                    ${ogPrice}
                  </span>
                </div>

                {/* Cart controls */}
                <div style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
                  {inCart ? (
                    <div style={{
                      display: "flex", alignItems: "center",
                      border: "1.5px solid #e0e0e0", borderRadius: 10, overflow: "hidden"
                    }}>
                      <button onClick={() => changeQty(p.id, -1)} style={{
                        flex: 1, padding: "8px", background: "#f5f5f5",
                        border: "none", cursor: "pointer",
                        fontSize: 16, fontWeight: 700, color: "#333"
                      }}>−</button>
                      <span style={{
                        flex: 1, textAlign: "center", fontWeight: 700,
                        fontSize: 14, color: "#1c1c1e", padding: "8px 0",
                        background: "#fff"
                      }}>{inCart.qty}</span>
                      <button onClick={() => changeQty(p.id, 1)} style={{
                        flex: 1, padding: "8px", background: "#f5f5f5",
                        border: "none", cursor: "pointer",
                        fontSize: 16, fontWeight: 700, color: "#333"
                      }}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p)} style={{
                      width: "100%", padding: "9px",
                      background: isHovered ? "#1c1c1e" : "#f5f5f0",
                      color: isHovered ? "#fff" : "#1c1c1e",
                      border: "1.5px solid #1c1c1e",
                      borderRadius: 10, cursor: "pointer",
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