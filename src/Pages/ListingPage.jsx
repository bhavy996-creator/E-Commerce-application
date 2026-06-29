import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ListingPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const { cart, addToCart } = useCart();
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <input placeholder="Search..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex:1, padding:"8px 12px", border:"1px solid #ddd", borderRadius:8 }} />
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ padding:"8px 12px", border:"1px solid #ddd", borderRadius:8 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding:"8px 12px", border:"1px solid #ddd", borderRadius:8 }}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      <p style={{ color:"#888", marginBottom:16 }}>{filtered.length} products found</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
        {filtered.map(p => (
          <div key={p.id} style={styles.card} onClick={() => navigate(`/product/${p.id}`)}>
            <img src={p.thumbnail} alt={p.title} style={styles.img} />
            <div style={{ padding:12 }}>
              <p style={{ fontSize:11, color:"#999", marginBottom:4 }}>{p.category}</p>
              <p style={styles.title}>{p.title}</p>
              <p style={{ color:"#D85A30", fontWeight:600 }}>${p.price.toFixed(2)}</p>
              <p style={{ fontSize:12, color:"#888" }}>⭐ {p.rating.toFixed(1)}</p>
              <button onClick={e => { e.stopPropagation(); addToCart(p); }}
                style={{ ...styles.btn, ...(cart[p.id] ? styles.btnAdded : {}) }}>
                {cart[p.id] ? "✓ In Cart" : "+ Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { background:"#fff", border:"1px solid #eee", borderRadius:12, overflow:"hidden",
          cursor:"pointer", transition:"transform 0.15s" },
  img: { width:"100%", height:160, objectFit:"contain", background:"#f8f8f8", padding:8 },
  title: { fontSize:14, fontWeight:500, marginBottom:6,
            display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" },
  btn: { width:"100%", marginTop:8, padding:"7px 0", border:"1px solid #ddd",
         borderRadius:8, background:"#fff", cursor:"pointer", fontSize:13 },
  btnAdded: { background:"#D85A30", color:"#fff", border:"none" }
};