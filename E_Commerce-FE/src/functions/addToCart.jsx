import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";


const addToCart = async (id, quantity, size, setCartList) => {
  const normalizedSize = size?.trim()?.toUpperCase();

  if (!normalizedSize) {
    toast.info("Please select a size");
    return;
  }

  try {
    const response=await fetch(`${API_BASE_URL}/cart/add`,{
     method:"POST"   ,
     headers:{
        "Content-Type":"application/json"
     },
     body:JSON.stringify({
        productId:id,
        quantity,
        size: normalizedSize
     })
    })
    //console.log(response)
    const data =await response.json()

    if(!response.ok){
        throw new Error(data.message || data.error || "Failed to add item to cart");
    }
     
     console.log("Added to cart:",data)
     toast.success(data.message || "Item added to cart");

     setCartList((prev) => {
  const exists = prev.find(
    (item) =>
      item.productId._id === data.data.productId._id &&
      item.size === data.data.size
  );

  if (exists) {
    return prev.map((item) =>
      item._id === data.data._id ? data.data : item
    );
  }

  return [...prev, data.data];
});
      
    return data;
  } catch (error) {
   console.error("Error adding to cart", error);
   toast.error(error.message || "Unable to add item to cart");
   return null;
  }
};
export default addToCart;
