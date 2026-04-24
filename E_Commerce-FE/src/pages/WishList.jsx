import { useContext } from "react";
import { useState } from "react";
import { WishListContext } from "../context/WishListContext";
import addToCart from "../functions/addToCart";
import { CartContext } from "../context/CartContext";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";




const WishList=()=>{
  const{wishList,setWishList,wishListLoading,wishListError}=useContext(WishListContext)
  const { setCartList } = useContext(CartContext);
  const [selectedSizes, setSelectedSizes] = useState({});
  const validWishListItems = wishList.filter((item) => item?.productId?._id);
   
   //remove from wishlist
  const removeFromWishList=(id)=>{
  
  fetch(`${API_BASE_URL}/wishList/delete/${id}`,{
    method:"DELETE"
  })
  .then((res)=>{
    if(!res.ok){
      throw new Error("Failed to delete item");
    }
    return res.json();
  }).then((data)=>{
    toast.success(data.message || "Item removed from wishlist")
    setWishList((prev)=>prev.filter((item)=>item._id!==id))
    //fetchWishList()
  }).catch((error) => {
    console.error("Error removing from wishlist:", error);
    toast.error("Unable to remove item from wishlist");
  })
}

const handleSizeChange = (itemId, value) => {
  setSelectedSizes((prev) => ({
    ...prev,
    [itemId]: value,
  }));
};

if (wishListLoading) {
  return <div className="container py-4"><p>Loading wishlist...</p></div>;
}

   return(
    <div className="container">
      <h3>wishlist items({validWishListItems.length})</h3>
      
     <div className="row">
  {validWishListItems.length === 0 ? (
    <div className="col-12">
      <div className="alert alert-light border">Your wishlist is empty.</div>
    </div>
  ) : validWishListItems.map((item) => (
    <div className="col-12 col-md-4 mb-4" key={item._id}>
      
      <div className="card h-100 shadow-sm">

        <div className="d-flex justify-content-center align-items-center" style={{height:"220px"}}>
          <img
            src={item.productId.imgUrl}
            alt="img"
            style={{maxHeight:"100%", maxWidth:"100%", objectFit:"contain"}}
          />
        </div>

        <div className="card-body d-flex flex-column">

          <h6 className="card-title">
            {item.productId.productName}
          </h6>

          <p className="fw-bold">₹{item.productId.price}</p>

          <div className="mb-3">
            <label className="form-label">Size</label>
            <select
              className="form-select"
              value={selectedSizes[item._id] || ""}
              onChange={(e) => handleSizeChange(item._id, e.target.value)}
            >
              <option value="">Select size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <button className="btn btn-danger mt-auto" onClick={async () => {
  const result = await addToCart(item.productId._id, 1, selectedSizes[item._id], setCartList);
  if (result) {
    removeFromWishList(item._id);
  }
}}>
            Add to Cart
          </button>
          <button className="btn btn-danger mt-1" onClick={()=>removeFromWishList(item._id)} >Remove From WishList</button>

        </div>

      </div>

    </div>
  ))}
</div>
      </div>

   ) 
}
export default WishList;
