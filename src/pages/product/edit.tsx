import { Form, Input, Button , message } from "antd";
import IProduct from "../../interfaces/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const ProductEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const getProductDetail = async () => {
    if (!id) return;
    const { data } = await axios.get(`http://localhost:3000/products/${id}`);
    return data;
  };

  const { data: product } = useQuery({
    queryKey: ["product"],
    queryFn: getProductDetail,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: IProduct) => {
      await axios.put(
        `http://localhost:3000/products/${id}`,
        data
      );
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      navigate("/admin/product/list");
    },
  });

  // Khi product có dữ liệu, set form values
  useEffect(() => {
    if (!product) return;
    form.setFieldsValue(product);
  }, [product]);

  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <>
      <h1>Thêm Sản Phẩm</h1>
      <Form
        form={form}
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

export default ProductEdit;
