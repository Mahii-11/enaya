import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home"; 
import Checkout from "./pages/Checkout";
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
import Notfound from "./pages/Notfound";

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
        path: "/checkout",
        element: <Checkout />
      },

      

      {
        path: "/product-details/:slug",
        element: <ProductDetailsPage />
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
        path: "*",
        element: <Notfound />
      },

  

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
