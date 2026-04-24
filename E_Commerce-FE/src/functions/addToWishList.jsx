import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";

export async function addToWishList(id,setWishList) {

  try {
    const response = await fetch(`${API_BASE_URL}/wishList/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });
    //console.log(response)
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to wishlist");
    }
    console.log(data)
    console.log("Added to wishlist:", data);
    const nextItem = {
      ...data.data,
      productId:
        data?.data?.productId && typeof data.data.productId === "object"
          ? data.data.productId
          : null,
    };

    setWishList((prev) => {
  const exists = prev.find(item => item._id === nextItem._id);
  if (exists) return prev;

  if (!nextItem.productId?._id) return prev;

  return [...prev, nextItem];
});
   toast.success(data.message)
    return (data)
      
     // useful for UI updates

  } catch (error) {
    console.error("Error adding the data:", error.message);
    toast.error(error.message || "Unable to add item to wishlist");
  }
}
