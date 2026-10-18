import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from './Footer'
import ScrollToTop from "./ScrollToTop";

export default function AppLayout() {


  return (
    <div>
      <ScrollToTop/>
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Outlet  /> 
      </main>
      <Footer/>
    </div>
  )
}