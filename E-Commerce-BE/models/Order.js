const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        productName: String,
        imgUrl: String,
        size: String,
        quantity: Number,
        originalPrice: Number,
        discount: Number,
        finalPrice: Number
      }
    ],
    deliveryAddress: {
      name: String,
      phone: String,
      pincode: String,
      state: String,
      city: String,
      houseNo: String,
      area: String,
      landmark: String
    },
    price: Number,
    discount: Number,
    deliveryCharges: Number,
    totalAmount: Number,
    status: {
      type: String,
      default: "Placed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
