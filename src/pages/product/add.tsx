import { Form, Input, Button, Checkbox, message } from "antd";
import IProduct from "../../interfaces/product";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
  const navigate = useNavigate();
  const addProduct = async (data: IProduct) => {
    await axios.post("http://localhost:3000/products", data);
  };

  const { mutate } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công");
      navigate("/admin/product/list");
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
  };
  return (
    <>
      <h1>Thêm Sản Phẩm</h1>
      <Form
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Tên sản phẩm" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Giá Sản Phẩm" name="price">
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh Sản Phẩm" name="thumbnail">
          <Input />
        </Form.Item>
        <Form.Item label="Mô Tả" name="description">
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductAdd;
