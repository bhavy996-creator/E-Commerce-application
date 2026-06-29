import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => r.json())
      .then(d => { setProduct(d); setActiveImg(d.thumbnail); });
  }, [id]);

  if (!product) return <p style={{ padding:24 }}>Loading...</p>;

  const ogPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24 }}>
      <button onClick={() => navigate(-1)}
        style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#888", marginBottom:20 }}>
        ← Back
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
        <div>
          <div style={{ background:"#f8f8f8", borderRadius:12, padding:24, textAlign:"center" }}>
            <img src={activeImg} alt={product.title} style={{ maxWidth:"100%", maxHeight:280, objectFit:"contain" }} />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
            {product.images?.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setActiveImg(img)}
                style={{ width:56, height:56, objectFit:"contain", border: activeImg===img ? "2px solid #D85A30" : "1px solid #ddd",
                         borderRadius:8, padding:4, cursor:"pointer", background:"#f8f8f8" }} />
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <p style={{ fontSize:12, color:"#999", textTransform:"uppercase" }}>{product.category} · {product.brand}</p>
          <h1 style={{ fontSize:22, fontWeight:600, lineHeight:1.3 }}>{product.title}</h1>
          <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
            <span style={{ fontSize:28, fontWeight:700, color:"#D85A30" }}>${product.price.toFixed(2)}</span>
            <span style={{ fontSize:16, textDecoration:"line-through", color:"#aaa" }}>${ogPrice}</span>
            <span style={{ fontSize:13, background:"#FAECE7", color:"#993C1D", padding:"3px 8px", borderRadius:6 }}>
              {Math.round(product.discountPercentage)}% off
            </span>
          </div>
          <p style={{ fontSize:14, color:"#555", lineHeight:1.7 }}>{product.description}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[["SKU", product.sku], ["Warranty", product.warrantyInformation],
              ["Shipping", product.shippingInformation], ["Return", product.returnPolicy]].map(([k,v]) => (
              <div key={k} style={{ background:"#f8f8f8", borderRadius:8, padding:"10px 12px" }}>
                <p style={{ fontSize:11, color:"#999" }}>{k}</p>
                <p style={{ fontSize:13, fontWeight:500 }}>{v || "N/A"}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
            <span style={{ fontWeight:600, fontSize:16 }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={styles.qtyBtn}>+</button>
            <button onClick={() => { addToCart(product, qty); navigate("/cart"); }} style={styles.addBtn}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  qtyBtn: { width:34, height:34, border:"1px solid #ddd", borderRadius:8, background:"#fff",
             cursor:"pointer", fontSize:18 },
  addBtn: { flex:1, padding:11, background:"#D85A30", color:"#fff", border:"none",
             borderRadius:8, cursor:"pointer", fontSize:15, fontWeight:500 }
};