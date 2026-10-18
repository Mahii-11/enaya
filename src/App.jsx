import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home"; 
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import ThankYouPage from "./pages/ThankYouPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import OnlineSale from "./pages/OnlineSale";
import SearchResultsPage from "./pages/SearchResultsPage";
import OurLocation from "./pages/OurLocation";
import Dashboard from "./pages/Dashboard";
import OrderDetails from "./components/dashboard/OrderDetails";
import ShopPage from "./pages/shoppages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductDetailsPagenumone from "./pages/ProductDetailsPagenumone"

const router = createBrowserRouter([
  {
    path: "/", 
    element: <AppLayout />,
    children: [
      {
        path: "/", 
        element: <Home />,
      },

      {
        path: "/cart",
        element: <Cart />,
       },
       
      {
        path: "/checkout",
        element: <Checkout />
      },

      

      {
        path: "/product-details/:slug",
        element: <ProductDetails />
      },

      {

        path: "/thank-you",
        element: <ThankYouPage/>
      },

      {
        path: "/login",
        element: <AuthPage/>
      },

      {
        path: "/search",
        element: <SearchPage/>
      },

      {

        path: "/online-sale",
        element: <OnlineSale/>
      },

      {
        path: "/search-results",
        element: <SearchResultsPage/>
      },

      {
        path: "/our-location",
        element: <OurLocation/>
      },

      {
        path: "/dashboard",
        element: <Dashboard/>
      },

      { 
        path: "/order-details/:id",
        element: <OrderDetails />
      },

      {
        path: "/shop-page",
        element: <ShopPage />
      },

      {
        path: "/productdetailspage",
        element: <ProductDetailsPage />
      },

      {
        path: "/productDetailsPagenumone",
        element: <ProductDetailsPagenumone/>
      }
 
  

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
