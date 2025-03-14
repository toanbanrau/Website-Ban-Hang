import {Navigate, useRoutes } from "react-router-dom";

import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import ProductEdit from "./pages/product/edit";

function App() {
  const element = useRoutes([
    {path: "/", element: <Navigate to="/product/list" /> },
    {
      path: "/product/list",
      element: <ProductList />,
    },
    {
      path: "/product/add",
      element: <ProductAdd />,
    },
    {
      path: "/product/:id/edit",
      element: <ProductEdit />,
    },
  ]);
  return element;
}
export default App;




