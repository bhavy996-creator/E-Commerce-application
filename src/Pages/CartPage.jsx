import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, changeQty, clearCart } = useCart();
  const navigate = useNavigate();
  const items = Object.values(cart);

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const ogTotal  = items.reduce((a, i) => a + (i.price / (1 - i.discountPercentage / 100)) * i.qty, 0);
  const savings  = ogTotal - subtotal;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  if (items.length === 0) return (
    <div style={{ textAlign:"center", padding:"4rem" }}>
      <p style={{ fontSize:18, marginBottom:16 }}>🛒 Your cart is empty</p>
      <button onClick={() => navigate("/")}
        style={{ padding:"10px 24px", background:"#D85A30", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" }}>
        Start Shopping
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:24 }}>
      <button onClick={() => navigate(-1)}
        style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#888", marginBottom:20 }}>
        ← Continue Shopping
      </button>
      <h2 style={{ fontWeight:600, marginBottom:20 }}>
        Your Cart ({items.reduce((a, i) => a + i.qty, 0)} items)
      </h2>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24, alignItems:"start" }}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{ fontWeight:500 }}>Items</span>
            <button onClick={clearCart} style={{ background:"none", border:"none", color:"#D85A30", cursor:"pointer" }}>
              Clear all
            </button>
          </div>
          {items.map(item => (
            <div key={item.id} style={styles.item}>
              <img src={item.thumbnail} alt={item.title}
                style={{ width:64, height:64, objectFit:"contain", border:"1px solid #eee", borderRadius:8, padding:4, background:"#f8f8f8" }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:500, marginBottom:4 }}>{item.title}</p>
                <p style={{ fontSize:12, color:"#999", marginBottom:8 }}>{item.category}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={() => changeQty(item.id, -1)} style={styles.qtyBtn}>−</button>
                  <span style={{ fontWeight:500 }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:18 }}>🗑</button>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ color:"#D85A30", fontWeight:600 }}>${(item.price * item.qty).toFixed(2)}</p>
                <p style={{ fontSize:12, color:"#aaa" }}>${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, position:"sticky", top:72 }}>
          <h3 style={{ fontWeight:600, fontSize:16, marginBottom:16, paddingBottom:12, borderBottom:"1px solid #eee" }}>
            Bill Summary
          </h3>
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`],
            ["Discount savings", `-$${savings.toFixed(2)}`],
            ["Shipping", shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`],
            ["Tax (8%)", `$${tax.toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:14, color:"#555" }}>
              <span>{label}</span><span>{val}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 0",
                        borderTop:"1px solid #eee", marginTop:8, fontWeight:700, fontSize:16 }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <div style={{ background:"#E1F5EE", borderRadius:8, padding:"10px 12px", marginTop:12, fontSize:13, color:"#085041" }}>
              🎉 You save ${savings.toFixed(2)} on this order!
            </div>
          )}
          <button style={{ width:"100%", marginTop:16, padding:12, background:"#D85A30", color:"#fff",
                           border:"none", borderRadius:8, cursor:"pointer", fontSize:15, fontWeight:500 }}>
            🔒 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background:"#fff", border:"1px solid #eee", borderRadius:12, overflow:"hidden", padding:0 },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 20px", borderBottom:"1px solid #eee" },
  item: { display:"flex", gap:12, padding:"14px 20px", borderBottom:"1px solid #eee", alignItems:"center" },
  qtyBtn: { width:28, height:28, border:"1px solid #ddd", borderRadius:6, background:"#fff", cursor:"pointer" }
};