import { useRoutes } from "react-router-dom";

import ProductList from "./pages/product/list";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import LayoutClient from "./Layouts/LayoutClient";
import CategoryList from "./pages/category/list";
import Order from "./pages/orders/List";
import DetailProduct from "./pages/DetailProduct";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import UserList from "./pages/users/list";
import JwtDecode from "jwt-decode";

import { Toaster } from "react-hot-toast";
import Product from "./pages/Product";
import SearchResults from "./pages/SeacrResults";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        { path: "/", element: <Home /> },
        { path: "product", element: <Product /> },
        { path: "product/:id", element: <DetailProduct /> },
        { path: "checkout", element: <Checkout /> },
        { path: "search", element: <SearchResults /> },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        { path: "product/list", element: <ProductList /> },

        { path: "user/list", element: <UserList /> },
        { path: "category", element: <CategoryList /> },
        { path: "order", element: <Order /> },
      ],
    },
  ]);

  return (
    <>
      {element}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
