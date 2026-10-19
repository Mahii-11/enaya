import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from './Footer'
import ScrollToTop from "./ScrollToTop";
import CartDrawer from "./CartDrawer";

export default function AppLayout() {


  return (
    <div>
      <ScrollToTop/>
      <CartDrawer />
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Outlet  /> 
      </main>
      <Footer/>
    </div>
  )
}