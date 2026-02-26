import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // no BrowserRouter here
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from './pages/Login';
import MainLayout from "./layout/MainLayout";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard products={products} />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <MainLayout>
              <Products products={products} setProducts={setProducts} />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;