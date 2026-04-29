import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { WishListContext } from "../context/WishListContext";
import { addToWishList } from "../functions/addToWishList";
import { useSortByPrice } from "../Hooks/useSortByPrice";
import { useHandleRatingChange } from "../Hooks/useHandleRatingChange";
import { useHandleCategory } from "../Hooks/useHandleCategory";
import { useFetch } from "../Hooks/useFetchCategory";
import { useFinalFilter } from "../Hooks/useFinalFilter";

function ProductListingPage() {
  const { setWishList, wishListLoading } = useContext(WishListContext);
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { minRating, handleRatingChange, clearRating } = useHandleRatingChange();
  const { sortByPrice, handlePriceChange, clearPriceSort } = useSortByPrice();
  const { categoryToFilter, handleCategory, clearCategory } = useHandleCategory(category);
  const { productsList, loading, error } = useFetch();

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

  if (loading) return <div className="container py-4"><p>Loading products...</p></div>;
  if (error) return <div className="container py-4"><p className="text-danger">{error}</p></div>;

  return (
    <>
      <div className="listing-toolbar">
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        >
          Filter products
        </button>

        <div
          className="offcanvas offcanvas-start filter-offcanvas"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasWithBothOptions"
          aria-labelledby="offcanvasWithBothOptionsLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              Filter Items
            </h5>
            <button
              type="button"
              className="btn-close me-4"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body filter-offcanvas-body">
            <div className="d-flex justify-content-between">
              <p><strong>Filter Products</strong></p>
              <a href="#" onClick={handleClearAll}>
                Clear All
              </a>
            </div>

            <div className="filter-section">
              <p><strong>Rating</strong></p>
              <label className="form-label">
                Minimum Rating: <strong>{minRating} star</strong>
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
                <span>0 star</span>
                <span>5 star</span>
              </div>
            </div>

            <div className="filter-section">
              <p><strong>Category</strong></p>
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="men"
                  checked={categoryToFilter === "men"}
                  onChange={handleCategoryChange}
                />
                <span>men clothing</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="women"
                  checked={categoryToFilter === "women"}
                  onChange={handleCategoryChange}
                />
                <span>women clothing</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="kids"
                  checked={categoryToFilter === "kids"}
                  onChange={handleCategoryChange}
                />
                <span>kids clothing</span>
              </label>
            </div>

            <div className="filter-section">
              <p><strong>Sort by price</strong></p>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="low"
                  checked={sortByPrice === "low"}
                  onChange={handlePriceChange}
                />
                <span>Low-High</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value="high"
                  checked={sortByPrice === "high"}
                  onChange={handlePriceChange}
                />
                <span>High-Low</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="listing-summary">
          <strong>Showing all products</strong> (showing {finalFilter.length} products)
        </p>

        <div className="row g-3">
          {finalFilter.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-light border">No products matched your filters.</div>
            </div>
          ) : (
            finalFilter.map((pro) => (
              <div key={pro._id} className="col-12 col-sm-6 col-lg-3">
                <div className="card m-0 product-card h-100">
                  <Link to={`/products/details/${pro._id}`} className="text-decoration-none product-card-link">
                    <div className="row g-0">
                      <div className="col-12">
                        <img src={pro.imgUrl} className="img-fluid product-card-image" alt="img" />
                      </div>
                      <div className="col-12 product-card-body">
                        <p><strong>{pro.productName}</strong></p>
                        <p>
                          <strong>
                            Rs. {Math.round(pro.price - (pro.price * pro.discount) / 100)}
                          </strong>
                          <span className="text-decoration-line-through"> Rs. {pro.price}</span>
                        </p>
                        <p className="text-success">{pro.discount}% off</p>
                        <p>{pro.rating} star</p>
                      </div>
                    </div>
                  </Link>

                  <button
                    className="mt-2 btn btn-danger product-card-action"
                    disabled={wishListLoading}
                    onClick={async () => {
                      await addToWishList(pro._id, setWishList);
                    }}
                  >
                    {wishListLoading ? "Updating..." : "add to wishList"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ProductListingPage;
