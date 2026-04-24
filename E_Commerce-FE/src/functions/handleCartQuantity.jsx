import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";



const useCartQuantity=()=>{
  
  const{setCartList}=useContext(CartContext)

  const handleCartQuantity =async (cartItemId, actionType) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/updatequantity/${cartItemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType }),
      });
      const updatedItem = await res.json();

      if (!res.ok) {
        throw new Error(updatedItem.message || "Unable to update quantity");
      }

      setCartList((prev) =>
        prev.map((item) => (item._id === cartItemId ? updatedItem.data || updatedItem : item))
      );
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error(err.message || "Unable to update quantity");
    }
  };

  return handleCartQuantity

}


  export default useCartQuantity;
