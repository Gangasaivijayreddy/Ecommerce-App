import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom"

import { useContext } from "react"
import { WishListContext } from "../context/WishListContext"
import { addToWishList } from "../functions/addToWishList"

import { useSortByPrice} from "../Hooks/useSortByPrice"
import { useHandleRatingChange } from "../Hooks/useHandleRatingChange"
import { useHandleCategory } from "../Hooks/useHandleCategory"
import { useFetch } from "../Hooks/useFetchCategory"
import { useFinalFilter } from "../Hooks/useFinalFilter"



function ProductListingPage(){

 const{setWishList, wishListLoading, wishListError}=useContext(WishListContext)
  const navigate = useNavigate();

  const {category}=useParams()
 
  const [searchParams] = useSearchParams()

  const searchTerm = searchParams.get("search") || ""


  //console.log(category)
  const{minRating,handleRatingChange,clearRating}=useHandleRatingChange()
  const {sortByPrice,handlePriceChange,clearPriceSort}=useSortByPrice()
  const{categoryToFilter,handleCategory,clearCategory}=useHandleCategory(category)// from use params
  const{productsList,loading,error }=useFetch()
  //console.log(productsList)
  const handleCategoryChange = (e) => {
    handleCategory(e);
    navigate(`/products/${e.target.value}`);
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    clearRating();
    clearPriceSort();
    clearCategory();
    navigate("/products");
  };

 const finalFilter = useFinalFilter(
  productsList,
  minRating,
  sortByPrice,
  categoryToFilter,
  searchTerm
);

 // console.log(finalFilter)
  if (loading) return <div className="container py-4"><p>Loading products...</p></div>;
  if (error) return <div className="container py-4"><p className="text-danger">{error}</p></div>; 

return(
  <>
 
 {/* filter offcanvas */}
<div>
  <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Filter products</button>

<div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Filter Items</h5>
    <button type="button" className="btn-close me-4" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body  me-5">

   <div className="d-flex justtify-content-between">
    <p><strong>Filter Products</strong></p>
    <a
  href="#"
  onClick={handleClearAll}
>
  Clear All
</a>
   </div>

    <div>
      <p><strong>Rating</strong></p>
       <label className="form-label">
          Minimum Rating: <strong>{minRating} ⭐</strong>
        </label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={handleRatingChange}
        />
        <div className="d-flex justify-content-between small text-muted">
          <span>0 ⭐</span>
          <span>5 ⭐</span>
        </div>

    </div>

    <div>
      <p><strong>Category</strong></p>
      <input type="radio" name="category" value="men" checked={categoryToFilter === "men"} onChange={handleCategoryChange} />men clothing<br />
      <input type="radio" name="category" value="women" checked={categoryToFilter === "women"} onChange={handleCategoryChange} />women clothing<br />
      <input type="radio" name="category" value="kids" checked={categoryToFilter === "kids"} onChange={handleCategoryChange} />kids clothing<br />
    </div>

    <div>
      <p><strong>Sort by price</strong></p>
      <input type="radio" name="price" value="low" checked={sortByPrice === "low"} onChange={handlePriceChange} />Low-High <br />
      <input type="radio" name="price" value="high" checked={sortByPrice === "high"} onChange={handlePriceChange} />High-Low <br />
    </div>


  </div>
</div>
</div>


{/* product listing */}
<div>
  <p><strong>Showing all products</strong> (showing {finalFilter.length} products)</p>
  
  <div className="row">
      
      {finalFilter.length === 0 ? (
        <div className="col-12">
          <div className="alert alert-light border">No products matched your filters.</div>
        </div>
      ) : (
        finalFilter.map(pro =>(
        <div key={pro._id}  className="col-12 col-sm-6 col-lg-3 px-2 ">
           
            
        <div className="card m-2">
          {/* this to be find in product details page */}
           <Link to={`/products/details/${pro._id}`} className="text-decoration-none">
        <div className="row">
        <div className="col">
            <img src={pro.imgUrl} className="img-fluid" alt="img" />
            
        </div>
        <div className="col">
            <p><strong>{pro.productName}</strong></p>
            <p><strong>₹ {Math.round(pro.price-(pro.price * pro.discount) / 100)}  </strong><span className="text-decoration-line-through">  ₹{pro.price}</span> </p>
            <p className="text-success">{pro.discount}% off</p>
            <p className="">{pro.rating}⭐
          </p>    
        </div>
      </div>
      </Link>
      {/* add to cart functionality */}
      
            
            <button className="mt-2 btn btn-danger" disabled={wishListLoading}  onClick={async () => {
  await addToWishList(pro._id, setWishList);
}}>{wishListLoading ? "Updating..." : "add to wishList"}</button>
           
      </div>
      
      
       </div>
)))}

   
    
  </div>
</div>
 </>    
)
}

export default ProductListingPage
