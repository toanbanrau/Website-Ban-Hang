import axiosInstance from "../config/axios";


type Props = {
  resource?: string;
  id?: number | string;
  values?: any;
};

export const getList = async ({ resource = "products" }: Props) => {
  const { data } = await axiosInstance.get(resource);
  return data;
};

export const getProductById = async ({ resource = "products", id }: Props) => {
  const { data } = await axiosInstance.get(`${resource}/${id}`);
  return data;
};

export const createProduct = async ({ resource = "products", values }: Props) => {
  const { data } = await axiosInstance.post(resource, values);
  return data;
};

export const updateProduct = async ({ resource = "products", id, values }: Props) => {
  const { data } = await axiosInstance.put(`${resource}/${id}`, values);
  return data;
};

export const deleteProduct = async ({ resource = "products", id }: Props) => {
  const { data } = await axiosInstance.delete(`${resource}/${id}`);
  return data;
};


export const auth = async ({ resource = "register", values }: Props) => {
  const { data } = await axiosInstance.post(resource, values);
  return data;
};

