import { useMutation, useQuery } from "@tanstack/react-query";
import { auth, getList } from "../Provieder";
import {  useContext } from "react";
import { CartContext } from "../contexts/cartContext";

import { useUser } from "../contexts/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



export const useList = ({ resource = "products" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const useAuth = ({ resource = "register" }) => {
  const { login } = useUser();
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values: any) => auth({ resource, values }),
    onSuccess: (data) => {
      toast.success("Thành Công");
      if (resource == "register") {
        nav("/login");
        return;
      }
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId",data.user.id);
      nav("/");
      login(data.user.id,data.user);
    },
  });
};