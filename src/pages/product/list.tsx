import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Table,
  Button,
  Space,
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import IProduct from "../../interfaces/product";
import ICategory from "../../interfaces/categorys";

function ProductList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // State mở/đóng Sidebar
  const [isEditing, setIsEditing] = useState(false); // Xác định đang sửa hay thêm mới
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null); // Lưu sản phẩm đang chỉnh sửa

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/categories");
      return data;
    },
  });

  // Fetch danh sách sản phẩm
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/products");
      return data;
    },
  });

  // Thêm sản phẩm mới
  const addProduct = useMutation({
    mutationFn: async (newProduct: IProduct) => {
      await axios.post("http://localhost:3000/products", newProduct);
    },
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries(["products"]);
      setOpen(false);
      form.resetFields();
    },
    onError: () => {
      toast.error("Lỗi khi thêm sản phẩm!");
    },
  });

  // Cập nhật sản phẩm
  const editProduct = useMutation({
    mutationFn: async (updatedProduct: IProduct) => {
      await axios.put(
        `http://localhost:3000/products/${updatedProduct.id}`,
        updatedProduct
      );
    },
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries(["products"]);
      setOpen(false);
      setEditingProduct(null);
      form.resetFields();
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật sản phẩm!");
    },
  });

  // Hàm mở Sidebar khi thêm mới
  const showAddDrawer = () => {
    setIsEditing(false);
    form.resetFields();
    setOpen(true);
  };

  // Hàm mở Sidebar khi chỉnh sửa
  const showEditDrawer = (product: IProduct) => {
    setIsEditing(true);
    setEditingProduct(product);
    form.setFieldsValue(product); // Load dữ liệu vào form
    setOpen(true);
  };

  // Hàm đóng Sidebar
  const closeDrawer = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  // Xử lý khi nhấn "Lưu"
  const onFinish = (values: IProduct) => {
    if (isEditing && editingProduct) {
      editProduct.mutate({ ...editingProduct, ...values });
    } else {
      addProduct.mutate(values);
    }
  };
  const removeProduct = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries(["products"]); // Làm mới danh sách sản phẩm
    },
    onError: () => {
      toast.error("Lỗi khi xóa sản phẩm!");
    },
  });

  // ✅ Gọi mutate bên trong hàm `handleRemove`
  const handleRemove = (id: string) => {
    removeProduct.mutate(id);
  };
  // Cấu trúc bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) => (
        <img src={thumbnail} alt="Product" width="100" />
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Danh Mục",
      dataIndex: "categoryId",
      render: (categoryId: string) => {
        const category = categories?.find(
          (cat: ICategory) => cat.id === categoryId
        );
        return category ? category.name : "Không xác định";
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IProduct) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showEditDrawer(record)}>
            Sửa
          </Button>
          <Button onClick={() => handleRemove(record.id)} type="primary" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddDrawer}
      >
        Thêm sản phẩm
      </Button>

      <Table dataSource={products} columns={columns} loading={isLoading} />

      {/* Sidebar Thêm/Sửa Sản Phẩm */}
      <Drawer
        title={isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        width={400}
        onClose={closeDrawer}
        open={open}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="thumbnail"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories?.map((category: ICategory) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Cập nhật" : "Lưu"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ProductList;
