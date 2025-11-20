import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomaPage from "./pages/HomePage";
import MainLayout from "./layout/MainLayout";
import OurProduct from "./pages/OurProduct";
import DetailProduct from "./pages/DetailProduct";
import PaymentDetails from "./pages/PaymentDetails";
import HistoryOrder from "./pages/HistoryOrder";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import MainLayoutAdmin from "./layout/MainLayoutAdmin";
import Dashboard from "./pages/Dashboard";
// import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import UserList from "./pages/UserList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomaPage /> },
      { path: "/our-product", element: <OurProduct /> },
      { path: "/detail-product/:slug", element: <DetailProduct /> },
      { path: "/payment-details", element: <PaymentDetails /> },
      { path: "/history-order", element: <HistoryOrder /> },
      { path: "/order-detail/:id", element: <OrderDetail /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
  path: "/",
  element: <MainLayoutAdmin />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
  {path:"/product-list" ,element: <ProductList />},
{path: "/order-list", element: <OrderList />},
{path: "/user-list", element: <UserList />}],
},
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <AuthProvider> */}
          <RouterProvider router={router} />
        {/* </AuthProvider> */}
      </PersistGate>
    </Provider>
  );
}

export default App;
