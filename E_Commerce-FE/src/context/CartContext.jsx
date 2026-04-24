import { useCallback, useEffect, useState, createContext } from "react";
import { API_BASE_URL } from "../lib/api";

export const CartContext = createContext();

export default function CartProvider({children}) {
  const [cartList, setCartList] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      setCartError("");
      const response = await fetch(`${API_BASE_URL}/cart/allItems`);
      const productsData = await response.json();

      if (!response.ok) {
        throw new Error(productsData.message || "Unable to load cart items");
      }

      setCartList(productsData.data || []);
    } catch (error) {
      console.log("Error fetching the data", error);
      setCartError(error.message || "Unable to load cart items");
      setCartList([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{cartList,setCartList,cartLoading,cartError,fetchCart}}> 
        {children}
       
       
    </CartContext.Provider>
  );
}
