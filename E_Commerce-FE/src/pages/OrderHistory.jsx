import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { toast } from "react-toastify";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders/all`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Unable to load order history");
        }
        return data;
      })
      .then((data) => {
        setOrders(data.data || []);
      })
      .catch((error) => {
        console.log("Error fetching orders", error);
        setError(error.message || "Unable to load order history");
        toast.error(error.message || "Unable to load order history");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mt-4"><p>Loading order history...</p></div>;
  }

  if (error) {
    return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
  }

  return (
    <div className="container mt-4">
      <h3>Order History</h3>

      {orders.length === 0 ? (
        <p>No orders placed yet</p>
      ) : (
        orders.map((order) => (
          <div className="card p-3 mb-3" key={order._id}>
            <h5>Order ID: {order._id}</h5>
            <p className="mb-1">Status: {order.status}</p>
            <p className="mb-1">Total Amount: Rs. {order.totalAmount}</p>
            <p className="mb-2">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>

            <h6>Delivery Address</h6>
            {order.deliveryAddress ? (
              <>
                <p className="mb-1">
                  {order.deliveryAddress.name}, {order.deliveryAddress.phone}
                </p>
                <p className="mb-2">
                  {order.deliveryAddress.houseNo}, {order.deliveryAddress.area}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                </p>
              </>
            ) : (
              <p className="mb-2 text-muted">Delivery address unavailable</p>
            )}

            <h6>Ordered Items</h6>
            {(order.items || []).map((item, index) => (
              <div key={index} className="border-top pt-2">
                <p className="mb-1">{item.productName}</p>
                <p className="mb-1">Size: {item.size}</p>
                <p className="mb-1">Quantity: {item.quantity}</p>
                <p className="mb-1">Price: Rs. {item.finalPrice}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
