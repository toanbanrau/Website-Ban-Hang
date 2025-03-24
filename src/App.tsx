import { useRoutes } from "react-router-dom";

import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import ProductEdit from "./pages/product/edit";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import LayoutClient from "./Layouts/LayoutClient";
import CategoryList from "./pages/category/list";
import Order from "./pages/orders/List";
import DetailProduct from "./pages/DetailProduct";
import Home from "./pages/Home";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "product/:id",
          element: <DetailProduct />,
        },
    
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          path: "product/list",
          element: <ProductList />,
        },
        {
          path: "product/add",
          element: <ProductAdd />,
        },
        {
          path: "product/edit/:id",
          element: <ProductEdit />,
        },

        {
          path: "category",
          element: <CategoryList />,
        },
        {
          path: "order",
          element: <Order />,
        },
      ],
    },
  ]);
  return element;
}
export default App;
