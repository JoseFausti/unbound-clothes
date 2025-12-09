import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminLayout from "../components/screens/admin/AdminLayout"
import Layout from "../components/screens/Layout"
import Home from "../components/screens/Home/Home"
import Products from "../components/screens/Home/Products/Products"
import Product from "../components/screens/Home/Products/Product"
import Cart from "../components/screens/Cart/Cart"
import Dashboard from "../components/screens/admin/(manage)/Dashboard"
import ManageUsers from "../components/screens/admin/(manage)/ManageUsers"
import Login from "../components/screens/auth/Login"
import Register from "../components/screens/auth/Register"
import Logout from "../components/screens/auth/Logout"
import Profile from "../components/screens/user/Profile"
import CreateCart from "../components/ui/cart/CreateCart"
import ProfileUserMain from "../components/ui/user/profile/main/ProfileUserMain"
import FavoriteProducts from "../components/ui/user/profile/favorites/FavoriteProducts"
import MyProducts from "../components/ui/user/profile/seller/MyProducts"
import MyOrders from "../components/ui/user/profile/orders/MyOrders"
import OrdersView from "../components/screens/admin/(manage)/OrdersView"
import Info from "../components/ui/footer/info/Info"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Routes */}
        <Route path="/" element={<Layout/>}>

          {/* User Routes */}
          <Route path="profile" element={<Profile/>}>
            <Route index element={<ProfileUserMain/>} />
            <Route path="favorites" element={<FavoriteProducts/>} />
            <Route path="orders" element={<MyOrders/>} />
            {/* Seller Routes */}
            <Route path="myProducts" element={<MyProducts/>} />
          </Route>

          {/* Home Routes */}
          <Route index element={<Home/>} />
          <Route path="products" element={<Products/>} />
          <Route path="products/:id" element={<Product />} />
          
          {/* Cart Routes */}
          <Route path="cart" element={<Cart/>} />
          <Route path="cart/create" element={<CreateCart/>} />

          {/* Auth Routes */}
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="logout" element={<Logout/>} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path="users" element={<ManageUsers/>} />
            <Route path="orders" element={<OrdersView />} />
          </Route>

          {/* Footer Routes */}
          <Route path="info" element={<Info/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
