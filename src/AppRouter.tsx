// import { useRoutes } from "react-router-dom";
import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import ProductEdit from "./pages/product/edit";

function AppRoutes() {
  const element = ([
    {
      path: "./product/list",
      element: <ProductList />,
    },
    {
      path: "./product/add",
      element: <ProductAdd />,
    },
    {
      path: "./product/:id/edit",
      element: <ProductEdit />,
    },
  ]);

  return element;
}

export default AppRoutes;
