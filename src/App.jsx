import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomaPage from "./pages/HomePage";
import MainLayout from "./layout/MainLayout";
import OurProduct from "./pages/OurProduct";
import DetailProduct from "./pages/DetailProduct";
import PaymentDetails from "./pages/PaymentDetails";
import HistoryOrder from "./pages/HistoryOrder";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomaPage />,
      },
      {
        path: "/our-product",
        element: <OurProduct />,
      },
      {
        path: "/detail-product/:slug",
        element: <DetailProduct />,
      },
      {
        path: "/payment-details",
        element: <PaymentDetails />,
      },
      {
        path: "/history-order",
        element: <HistoryOrder />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
