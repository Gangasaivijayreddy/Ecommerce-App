import { createContext, useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";

export const WishListContext = createContext();



export default function WishListProvider({ children }) {
  const [wishList, setWishList] = useState([]);
  const [wishListLoading, setWishListLoading] = useState(true);
  const [wishListError, setWishListError] = useState("");

  const fetchWishList = useCallback(async () => {
    try {
      setWishListLoading(true);
      setWishListError("");
      const response = await fetch(`${API_BASE_URL}/wishList/allItems`);
      const wishListProducts = await response.json();

      if (!response.ok) {
        throw new Error(wishListProducts.message || "Unable to load wishlist");
      }

      setWishList(wishListProducts.data);
    } catch (error) {
      console.log("error fetching the data",error);
      setWishListError(error.message || "Unable to load wishlist");
      setWishList([]);
    } finally {
      setWishListLoading(false);
    }
  }, []);

  useEffect(()=>{
    fetchWishList();
  },[fetchWishList])

  return (
    <WishListContext.Provider value={{ wishList, setWishList, fetchWishList, wishListLoading, wishListError }}>
      {children}
    </WishListContext.Provider>
  );
}
