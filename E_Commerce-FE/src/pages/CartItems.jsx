import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import useCartQuantity from "../functions/handleCartQuantity";
import { addToWishList } from "../functions/addToWishList";
import { WishListContext } from "../context/WishListContext";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";

export default function CartItems() {
  const { cartList, setCartList, cartLoading, cartError } = useContext(CartContext);
  const { setWishList, wishListLoading } = useContext(WishListContext);
  const handleCartQuantity = useCartQuantity();

  const getDiscountedUnitPrice = (item) =>
    Math.round(
      Number(item.productId.price) -
        (Number(item.productId.price) * Number(item.productId.discount)) / 100
    );

  const removeCartItem = (id) => {
    fetch(`${API_BASE_URL}/cart/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete item");
        }
        return res.json();
      })
      .then((data) => {
        toast.success(data.message || "Item removed from cart");
        setCartList((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Unable to delete item");
      });
  };

  const moveToWishlist = async (item) => {
    const result = await addToWishList(item.productId._id, setWishList);
    if (result) {
      removeCartItem(item._id);
    }
  };

  const cartItemsOriginalPrice = cartList.reduce(
    (acc, item) => acc + Number(item.productId.price) * Number(item.quantity),
    0
  );

  const cartItemsDiscount = cartList.reduce(
    (acc, item) =>
      acc +
      (((Number(item.productId.price) * Number(item.productId.discount)) / 100) *
        Number(item.quantity)),
    0
  );

  const cartItemsFinalPrice = cartList.reduce(
    (acc, item) => acc + getDiscountedUnitPrice(item) * Number(item.quantity),
    0
  );

  const totalItems = cartList.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );

  const deliveryCharges = cartList.length > 0 ? 500 : 0;
  const totalAmount = cartItemsFinalPrice + deliveryCharges;

  if (cartLoading) {
    return <div className="container py-4"><p>Loading cart...</p></div>;
  }

  if (cartError) {
    return <div className="container py-4"><p className="text-danger">{cartError}</p></div>;
  }

  return (
    <div className="container px-2 px-md-3">
      <h3>Cart Items ({totalItems})</h3>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          {cartList.length === 0 ? (
            <div className="alert alert-light border">Your cart is empty.</div>
          ) : (
            cartList.map((item) => (
              <div className="card my-2" key={item._id}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <img src={item.productId.imgUrl} alt="img" className="img-fluid" />
                  </div>
                  <div className="col-12 col-md-6">
                    <p>{item.productId.productName}</p>
                    <h6>
                      Rs. {getDiscountedUnitPrice(item)}
                      <span className="text-decoration-line-through"> Rs. {item.productId.price}</span>
                    </h6>

                    <div className="mb-3">
                      <p className="mb-2">Quantity:</p>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <button className="btn btn-primary" onClick={() => handleCartQuantity(item._id, "dec")}>-</button>
                        <button className="btn btn-primary">{item.quantity}</button>
                        <button className="btn btn-primary" onClick={() => handleCartQuantity(item._id, "inc")}>+</button>
                      </div>
                    </div>

                    <p><strong>Size:</strong> "{item.size}"</p>

                    <div className="d-grid gap-2 d-sm-flex">
                      <button className="btn btn-danger" onClick={() => removeCartItem(item._id)}>
                        Remove from cart
                      </button>
                      <button
                        className="btn btn-primary"
                        disabled={wishListLoading}
                        onClick={async () => {
                          await moveToWishlist(item);
                        }}
                      >
                        {wishListLoading ? "Moving..." : "Move to wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-12 col-md-6">
          <div className="card">
            <p><strong>PRICE DETAILS</strong></p>
            <hr />

            <div className="d-flex justify-content-between">
              <p>Original Price ({totalItems} items)</p>
              <p>Rs. {cartItemsOriginalPrice}</p>
            </div>

            <div className="d-flex justify-content-between">
              <p>Discount</p>
              <p>Rs. {cartItemsDiscount}</p>
            </div>

            <div className="d-flex justify-content-between">
              <p>Subtotal</p>
              <p>Rs. {cartItemsFinalPrice}</p>
            </div>

            <div className="d-flex justify-content-between">
              <p>Delivery Charges</p>
              <p>Rs. {deliveryCharges}</p>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <p><strong>Total Amount</strong></p>
              <p><strong>Rs. {totalAmount}</strong></p>
            </div>

            <hr />
            <p>You will save Rs. {cartItemsDiscount} on this order</p>

            {cartList.length > 0 ? (
              <Link to="/placeOrder" className="btn btn-primary w-100">
                Place Order
              </Link>
            ) : (
              <button className="btn btn-primary w-100" disabled>
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
