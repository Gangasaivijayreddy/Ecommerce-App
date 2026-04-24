import { useState,useEffect } from "react";
import { API_BASE_URL } from "../lib/api";
// fetching the data by category

export function useFetch(){
 const [productsList,setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE_URL}/products`;

        const res = await fetch(url);

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load products");
        }
        setProductsList(data.data || []);
      } catch (error) {
        setProductsList([]);
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { productsList, loading, error };
}
