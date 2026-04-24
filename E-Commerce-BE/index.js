const mongoose=require("mongoose")
const Product=require("./models/productsMoldel")
const Cart=require("./models/Cart")
const WishList=require("./models/Wishlist")
const Address=require("./models/Address")
const Order=require("./models/Order")
const cors=require("cors")


const fs= require("fs")
const path = require("path")
const express=require("express")
const{dbConnect}=require("./dbConnection/dbConnect")

const app=express()
app.use(express.json())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ecommerce-app-henna-iota.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const jsonData=fs.readFileSync(path.join(__dirname, "products.json"),"utf-8")
const productsData=JSON.parse(jsonData)

function buildProductPayload(product) {
  return {
    productName: product.productName,
    fullDetails: product.fullDetails,
    imgUrl: product.imgUrl,
    rating: product.rating,
    price: product.price,
    discount: product.discount,
    description: product.description,
    category: product.category
  };
}


// seed to data base
async function seedData({ replaceExisting = false } = {}){
    try {
        if (replaceExisting) {
          await Product.deleteMany({});
        }

        for(const product of productsData){
           const newProduct =await new Product(buildProductPayload(product))
           await newProduct.save()
           console.log(product.productName,"saved")
        }
        console.log("added data successfully")
    } catch (error) {
        console.log("an err occured while seeding the data",error)
    }
}


//seedData(productsData)

app.post("/products/seed", async (req, res) => {
  try {
    await seedData({ replaceExisting: true });
    const data = await Product.find();

    return res.status(200).json({
      message: "Products reseeded successfully from products.json",
      count: data.length,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to seed products",
      error: error.message
    });
  }
});
  

//get all products in products to show
app.get("/products",async(req,res)=>{
    try {
        const data= await Product.find() 
        if(data){
            res.status(200).json({message:"found products successfully",data})
        }else{
            res.status(404).json({error:"cant find products "})
        }
    } catch (error) {
       res.status(500).json({error:"some thing went wrong while fetching the data"})
       console.log(error)  
    }
})

// filter by category

app.get("/products/category/:category", async (req, res) => {
  try {
    const categoryName = req.params.category;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const categoryItems = await Product.find({ category: categoryName });

    if (categoryItems.length === 0) {
      return res.status(404).json({
        message: "No products found for this category",
        category: categoryName
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      category: categoryName,
      data: categoryItems,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong while fetching category items"
    });
  }
});

// adding items to cart

app.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity,size } = req.body;

    if (!productId || !quantity ||!size) {
      return res.status(400).json({
        message: "productId,quantity and size required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: "Invalid productId format"
      });
    }

    const existingItem = await Cart.findOne({ productId,size });

    //  IF PRODUCT EXISTS → UPDATE QUANTITY
    if (existingItem) {
      
      existingItem.quantity += quantity;
      await existingItem.save();
const populatedItem = await existingItem.populate("productId");

      return res.status(200).json({
        message: "Cart quantity updated because item already exists",
        data: populatedItem
      });
    }

    //  IF NOT EXISTS → CREATE NEW
    const cartItem = await Cart.create({
      productId,
      quantity,
      size
    });
    const populatedCartItem = await cartItem.populate("productId");       
    return res.status(201).json({
      message: "Item added to cart", 
      data: populatedCartItem 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


// get all items of cart
app.get("/cart/allItems",async(req,res)=>{
  try {
    const allCartList= await Cart.find().populate("productId") 
    res.status(200).json({data:allCartList})
  } catch (error) {
    console.log({error:"error fetching the data",error})
    res.status(500).json({ message: "Unable to fetch cart items", error: error.message })
  }
})

//update cart quantity
app.post("/cart/updatequantity/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid cart item id" });
    }

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🔥 PREVENT ZERO / NEGATIVE QUANTITY
    if (action === "dec" && cartItem.quantity === 1) {
      return res.status(200).json(cartItem);
    }

    if (action === "inc") cartItem.quantity += 1;
    else if (action === "dec") cartItem.quantity -= 1;
    else return res.status(400).json({ error: "Invalid action" });

    await cartItem.save();
    await cartItem.populate("productId");

    return res.status(200).json(cartItem);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// remove item from cart

app.delete("/cart/delete/:id",async(req,res)=>{
  const {id}=req.params
  
  console.log(id)
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid cart item id" });
}
    const deletedItem= await Cart.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({message:"Deleted successfully",deletedItem})
  } catch (error) {
    return res.status(500).json({message:"some thing went wrong",error:error.message})
  }
})

//find the product by id for product details page fetching
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
        
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// adding items to wishList

app.post("/wishList/add",async(req,res)=>{
    const{productId}=req.body;
    try {
       if(!productId){
      return res.status(400).json({
        message:"productId is required"
      })
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
      return res.status(400).json({
        error:"Invalid productId format"
      })
    }

    const existingItem =await WishList.findOne({productId});

    if(existingItem){
      const populatedItem=await existingItem.populate("productId")

      return res.status(200).json({
        message:"item already present in the wishList ", data:populatedItem
      })
    }

    const wishListItem=await WishList.create({
      productId:productId
    })

    const populatedWishListItem=await wishListItem.populate("productId")
    return res.status(201).json({
      message:"Item added to wishList",data:populatedWishListItem
    })
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:"Something went wrong in the server"})
    }
   
})

// get all items from wishlist

app.get("/wishList/allItems",async(req,res)=>{
  try {
    const allWishListItems = await WishList.find().populate("productId")
    res.status(200).json({data:allWishListItems})
    //console.log(allWishListItems)
  } catch (error) {
    res.status(400).json({message:"cant fetch the data",error})
    console.log(error)
  }
})

// remove item from wishlist                

app.delete("/wishList/delete/:id",async(req,res)=>{
  const {id}=req.params
  
  console.log(id)
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid wishList item id" });
}
    const deletedItem= await WishList.findByIdAndDelete(id)

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({message:"Deleted successfully",deletedItem})
  } catch (error) {
    return res.status(500).json({message:"some thing went wrong",error:error.message})
  }
})

//adding new  address

app.post("/address/add", async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json({ data: address });
  } catch (error) {
    res.status(500).json({ message: "Unable to save address", error: error.message });
  }
});

// get all address 

app.get("/address/all", async (req, res) => {
  try {
    const addresses = await Address.find().sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ data: addresses });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch addresses", error: error.message });
  }
});

// update the items

app.post("/address/:id", async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: "Unable to update address", error: error.message });
  }
});

// delete address

app.delete("/address/:id", async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete address", error: error.message });
  }
});

//set as default address

app.post("/address/default/:id", async (req, res) => {
  try {
    await Address.updateMany({}, { isDefault: false });
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: "Unable to set default address", error: error.message });
  }
});

app.post("/orders/place", async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Valid addressId is required" });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const cartItems = await Cart.find().populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const price = cartItems.reduce((acc, item) => {
      return acc + Number(item.productId.price) * Number(item.quantity);
    }, 0);

    const discount = cartItems.reduce((acc, item) => {
      return (
        acc +
        ((Number(item.productId.price) * Number(item.productId.discount)) / 100) *
          Number(item.quantity)
      );
    }, 0);

    const deliveryCharges = cartItems.length > 0 ? 500 : 0;
    const totalAmount = price - discount + deliveryCharges;

    const orderItems = cartItems.map((item) => {
      return {
        productId: item.productId._id,
        productName: item.productId.productName,
        imgUrl: item.productId.imgUrl,
        size: item.size,
        quantity: item.quantity,
        originalPrice: item.productId.price,
        discount: item.productId.discount,
        finalPrice: Math.round(
          Number(item.productId.price) -
            (Number(item.productId.price) * Number(item.productId.discount)) / 100
        )
      };
    });

    const newOrder = new Order({
      items: orderItems,
      deliveryAddress: {
        name: address.name,
        phone: address.phone,
        pincode: address.pincode,
        state: address.state,
        city: address.city,
        houseNo: address.houseNo,
        area: address.area,
        landmark: address.landmark
      },
      price,
      discount,
      deliveryCharges,
      totalAmount
    });

    await newOrder.save();
    await Cart.deleteMany({});

    return res.status(201).json({
      message: "Order placed successfully",
      data: newOrder
    });
  } catch (error) {
  console.log("Place order error:", error);
  return res.status(500).json({
    message: "Something went wrong while placing order",
    error: error.message
  });
}

});

app.get("/orders/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch orders",
      error: error.message
    });
  }
});



const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await dbConnect();

    app.listen(PORT, () => {
      console.log("server running in PORT:", PORT);
    });

  } catch (error) {
    console.error("server startup failed", error);
    process.exit(1);
  }
}

startServer();

