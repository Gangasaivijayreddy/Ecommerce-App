
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './pages/Nav'
import Home from './pages/Home'
import ProductListingPage from './pages/ProductListingPage'
import CartProvider from './context/CartContext'
import WishListProvider from './context/WishListContext'
import CartItems from './pages/CartItems'
import ProductDetailsPage from './pages/ProductDetailsPage'
import WishList from './pages/WishList'
import ProfilePage from './pages/UserProfile'
import PlaceOrder from './pages/PlaceOrder'
import OrderHistory from './pages/OrderHistory'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CartProvider>
      <WishListProvider>
        <BrowserRouter>
          <Nav/>
          <div className="page-transition">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/products" element={<ProductListingPage/>} />
              <Route path="/products/:category" element={<ProductListingPage/>}/>
              <Route path="/cartItems" element={<CartItems/>}/>
              <Route path="/wishList" element={<WishList/>}/>
              <Route path="/products/details/:productId" element={<ProductDetailsPage/>}/>
              <Route path="/profilePage" element={<ProfilePage/>}/>
              <Route path="/placeOrder" element={<PlaceOrder />} />
              <Route path="/orderHistory" element={<OrderHistory />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick />
        </BrowserRouter>
      </WishListProvider>
    </CartProvider>
  )
}

export default App
