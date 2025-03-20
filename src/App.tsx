import { useRoutes } from "react-router-dom";

import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import ProductEdit from "./pages/product/edit";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import LayoutClient from "./Layouts/LayoutClient";
import CategoryList from "./pages/category/list";
import Order from "./pages/orders/list";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <LayoutClient />,
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
