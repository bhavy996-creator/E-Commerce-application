import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛍 ShopNow</Link>
      <Link to="/cart" style={styles.cartBtn}>
        🛒 Cart ({totalItems})
      </Link>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center",
         padding:"12px 24px", background:"#fff", borderBottom:"1px solid #eee" },
  logo: { fontSize:20, fontWeight:600, textDecoration:"none", color:"#D85A30" },
  cartBtn: { textDecoration:"none", color:"#333", padding:"8px 16px",
              border:"1px solid #ddd", borderRadius:8 }
};