import { useContext, useEffect ,useState} from "react"
import {useNavigate, useParams} from  "react-router-dom"
import addToCart from "../functions/addToCart";
import { CartContext } from "../context/CartContext";
import { addToWishList } from "../functions/addToWishList";
import { WishListContext } from "../context/WishListContext";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";


const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="d-flex align-items-center">
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= roundedRating ? "#ffc107" : "#e4e5e9",
              fontSize: "20px",
              marginRight: "4px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* rating number */}
      <span className="ms-2 text-muted">
        {rating}
      </span>
    </div>
  );
};


const ProductDetailsPage=()=>{//product details
  const { setWishList, wishListLoading } = useContext(WishListContext);
  const navigate = useNavigate();
 
  const{productId}=useParams()
  //console.log(productId)
  const [quantity, setQuantity] = useState(1);

  const [product,setProduct]=useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[size,setSize]=useState(null)
   const{setCartList}=useContext(CartContext)
  useEffect(()=>{
  const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${API_BASE_URL}/products/${productId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load product");
        }

        setProduct(data.data || data);
        
      } catch (error) {
        console.error(error);
        setError(error.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  },[productId])

  const handleBuyNow = async () => {
    const addedItem = await addToCart(product?._id, quantity, size, setCartList);
    if (!addedItem) {
      return;
    }

    navigate("/placeOrder");
  };

  const handleAddToWishlist = async () => {
    if (!productId) {
      toast.error("Product not found");
      return;
    }

    await addToWishList(productId, setWishList);
  };
  
  if(loading){
    return(
      <div className="container py-4"><p>Loading product details...</p></div>
    )
  }

  if (error) {
    return <div className="container py-4"><p className="text-danger">{error}</p></div>;
  }

  if(!product){
    return <div className="container py-4"><p>Product not found.</p></div>;
  }

return(
    <div>
      <div className="container">
   <div className="row">
    <div className="col-12 col-lg-4 mb-4">
      <img src={product.imgUrl} alt="alt" className="img-fluid w-100"/><br />
      {/* buttons */}
      <button className="btn btn-success m-2 w-100" onClick={handleBuyNow}>Buy Now</button><br />
      <button className=" m-2 btn btn-primary w-100"onClick={() => addToCart(product._id, quantity, size, setCartList)}>Add to Cart</button><br />
      <button className="btn btn-danger m-2 w-100" disabled={wishListLoading} onClick={handleAddToWishlist}>
        {wishListLoading ? "Updating..." : "Add to Wishlist"}
      </button>
    </div>
    <div className="col-12 col-lg-8">
      <h4>{product.productName}</h4>
      <p className="text-muted">{product.fullDetails}</p>
      {/* star rating */}
      <StarRating rating={product.rating} />


      <p><strong>₹{Math.round(product.price-(product.price * product.discount) / 100)}</strong>  <span className="text-decoration-line-through ms-3">{product.price}</span></p>
     <p className="text-success">{product.discount}% off</p>
     <p>Quantity:
       <button  className="btn btn-outline-secondary mx-1 rounded-start-pill" onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))} >-</button>
      <button className="btn btn-outline-secondary mx-1" >{quantity}</button>
      <button className="btn btn-outline-secondary mx-1 rounded-end-circle" onClick={() => setQuantity(q => q + 1)} >+</button>
      </p>
      <p>
  Size:
  {["S", "M", "L", "XL", "XXL"].map(s => (
    <button
      key={s}
      className={`btn mx-1 ${
        size === s ? "btn-dark" : "btn-outline-secondary"
      }`}
      onClick={() => setSize(s)}
    >
      {s}
    </button>
  ))}
</p>
      <hr />
      {/* icons */}
      <div className="d-flex gap-4 mt-3">
  <div className="text-center">
    <i className="bi bi-truck fs-4 text-primary"></i>
    <p className="small mb-0">Free Delivery</p>
  </div>

  <div className="text-center">
    <i className="bi bi-arrow-repeat fs-4 text-success"></i>
    <p className="small mb-0">10 Days Refund</p>
  </div>

  <div className="text-center">
    <i className="bi bi-shield-lock fs-4 text-warning"></i>
    <p className="small mb-0">Secure Payment</p>
  </div>

  <div className="text-center">
    <i className="bi bi-cash-coin fs-4 text-danger"></i>
    <p className="small mb-0">Cash on Delivery</p>
  </div>
</div>


      <hr />
      <div>
        <p><strong>Description:</strong></p>
        <ul className="ps-3">
        {
          (product.description || []).map((detail,index)=>{
            return(
            <li key={index}>
              <p>{detail}</p>
            </li>
          )
        })
        }
        </ul>
      </div>
    </div>
   </div>
    </div>
    </div>
)
}
export default ProductDetailsPage
