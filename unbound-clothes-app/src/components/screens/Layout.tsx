import { Outlet } from "react-router-dom"
import Providers from "../../Providers/Providers"
import Header from "../ui/header/Header"
import Footer from "../ui/footer/Footer"
import "../../globals.css";

const Layout = () => {
  return (
    <>
      <Providers>
        <Header />
        <main><Outlet /></main>
        <Footer />
      </Providers>
    </>
  )
}

export default Layout;
