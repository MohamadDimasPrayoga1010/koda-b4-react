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
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import UserList from "./pages/UserList";
import PrivateRoute from "./components/PrivateRoute";
import CategoryList from "./pages/CategoryList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomaPage /> },
      { path: "/our-product", element: <OurProduct /> },
      { path: "/detail-product/:slug", element: <DetailProduct /> },
      { 
        path: "/payment-details", 
        element: (
          <PrivateRoute>
            <PaymentDetails />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/history-order", 
        element: (
          <PrivateRoute>
            <HistoryOrder />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/order-detail/:id", 
        element: (
          <PrivateRoute>
            <OrderDetail />
          </PrivateRoute>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ) 
      },
    ],
  },
  {
    path: "/",
    element: <MainLayoutAdmin />,
    children: [
      { 
        path: "/dashboard", 
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Dashboard />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/product-list", 
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <ProductList />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/order-list", 
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <OrderList />
          </PrivateRoute>
        ) 
      },
      { 
        path: "/user-list", 
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <UserList />
          </PrivateRoute>
        ) 
      },
       { 
        path: "/category-list", 
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <CategoryList />
          </PrivateRoute>
        ) 
      },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;