import { useRoutes } from "react-router-dom";
import ProductList from "./pages/product/list";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import LayoutClient from "./Layouts/LayoutClient";
import CategoryList from "./pages/category/list";
import Order from "./pages/orders/List";
import DetailProduct from "./pages/DetailProduct";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import UserList from "./pages/users/ListAdmin";
import { Toaster } from "react-hot-toast";
import Product from "./pages/Product";
import HistoryOrder from "./pages/HistoryOrder";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashBoard from "./pages/dashboard/DashBoard";
import ListUser from "./pages/users/ListUser";
import Comment from "./pages/comments/Comment";

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
        { path: "historyOrder", element: <HistoryOrder /> },
        { path: "profile", element: <Profile /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,

      children: [
        { index: true, element: <DashBoard /> },
        { path: "product/list", element: <ProductList /> },
        { path: "user/listAdmin", element: <UserList /> },
        { path: "user/listUser", element: <ListUser /> },
        { path: "category", element: <CategoryList /> },
        { path: "order", element: <Order /> },
        { path: "comment", element: <Comment /> },
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
