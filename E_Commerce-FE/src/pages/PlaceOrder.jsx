import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";

export default function PlaceOrder() {
  const { cartList, setCartList } = useContext(CartContext);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const navigate = useNavigate();

  const getDiscountedUnitPrice = (item) =>
    Math.round(
      Number(item.productId.price) -
        (Number(item.productId.price) * Number(item.productId.discount)) / 100
    );

  useEffect(() => {
    fetch(`${API_BASE_URL}/address/all`)
      .then((res) => res.json())
      .then((data) => {
        const selectedAddress = (data.data || data.addresses || []).find((addr) => addr.isDefault);
        setDefaultAddress(selectedAddress || null);
      })
      .catch((error) => {
        console.log("Error fetching address", error);
        toast.error("Unable to load addresses");
      })
      .finally(() => {
        setLoadingAddress(false);
      });
  }, []);

  const cartItemsPrice = cartList.reduce((acc, item) => {
    return acc + Number(item.productId.price) * Number(item.quantity);
  }, 0);

  const cartItemsDiscount = cartList.reduce((acc, item) => {
    return (
      acc +
      ((Number(item.productId.price) * Number(item.productId.discount)) / 100) *
        Number(item.quantity)
    );
  }, 0);

  const cartItemsFinalPrice = cartList.reduce((acc, item) => {
    return acc + getDiscountedUnitPrice(item) * Number(item.quantity);
  }, 0);

  const deliveryCharges = cartList.length > 0 ? 500 : 0;
  const totalAmount = cartItemsFinalPrice + deliveryCharges;

  const handleConfirmPlaceOrder = async () => {
    if (!defaultAddress) {
      toast.info("Please select a default address in profile page");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: defaultAddress._id,
        }),
      });

      const textData = await response.text();
      const data = textData ? JSON.parse(textData) : {};

      if (!response.ok) {
        toast.error(data.message || "Failed to place order");
        return;
      }

      setCartList([]);
      toast.success("Order placed successfully");
      navigate("/orderHistory");
    } catch (error) {
      console.log("Error placing order", error);
      toast.error("Something went wrong while placing order");
    }
  };

  return (
    <div className="container mt-4 px-2 px-md-3">
      <h3>Place Order</h3>

      <div className="card p-3 mb-3">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-start">
          <div>
            <h5>Delivery Address</h5>

            {defaultAddress ? (
              <>
                <p className="mb-1"><strong>{defaultAddress.name}</strong></p>
                <p className="mb-1">
                  {defaultAddress.houseNo}, {defaultAddress.area}
                </p>
                <p className="mb-1">
                  {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                </p>
                <p className="mb-0">Phone: {defaultAddress.phone}</p>
              </>
            ) : (
              <p>{loadingAddress ? "Loading default address..." : "No default address selected"}</p>
            )}
          </div>

          <Link to="/profilePage" className="btn btn-outline-primary w-100">
            Change Address
          </Link>
        </div>
      </div>

      <div className="card p-3 mb-3">
        <h5>Products</h5>

        {cartList.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartList.map((item) => {
            const finalPrice = getDiscountedUnitPrice(item) * Number(item.quantity);

            return (
              <div key={item._id} className="d-flex flex-column flex-sm-row gap-2 justify-content-between border-bottom py-2">
                <div>
                  <p className="mb-1">{item.productId.productName}</p>
                  <p className="mb-1">Size: {item.size}</p>
                  <p className="mb-1">Quantity: {item.quantity}</p>
                </div>
                <div>
                  <strong>Rs. {finalPrice}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="card p-3">
        <h5>Price Details</h5>

        <div className="d-flex justify-content-between">
          <p>Original Price</p>
          <p>Rs. {cartItemsPrice}</p>
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
          <strong>Total Amount</strong>
          <strong>Rs. {totalAmount}</strong>
        </div>

        <button
          className="btn btn-success mt-3 w-100"
          onClick={handleConfirmPlaceOrder}
          disabled={cartList.length === 0}
        >
          Confirm Place Order
        </button>
      </div>
    </div>
  );
}
