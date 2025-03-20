import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Table, Button, Space, Drawer, Form, Input, InputNumber } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import IProduct from "../../interfaces/product";
import ICategory from "../../interfaces/categorys";

function CategoryList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // State mở/đóng Sidebar
  const [isEditing, setIsEditing] = useState(false); // Xác định đang sửa hay thêm mới
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<ICategory | null>(null); // Lưu sản phẩm đang chỉnh sửa

  // Fetch danh sách sản phẩm
  const { data: products, isLoading } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/categorys");
      return data;
    },
  });

  // Thêm sản phẩm mới
  const addProduct = useMutation({
    mutationFn: async (newProduct: IProduct) => {
      await axios.post("http://localhost:3000/categorys", newProduct);
    },
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries(["categorys"]);
      setOpen(false);
      form.resetFields();
    },
    onError: () => {
      toast.error("Lỗi khi thêm sản phẩm!");
    },
  });

  // Cập nhật sản phẩm
  const editProduct = useMutation({
    mutationFn: async (updatedProduct: ICategory) => {
      await axios.put(
        `http://localhost:3000/categorys/${updatedProduct.id}`,
        updatedProduct
      );
    },
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries(["categorys"]);
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

  // Cấu trúc bảng
  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ICategory) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showEditDrawer(record)}>
            Sửa
          </Button>
          <Button type="primary" danger>
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
        Thêm Danh Mục
      </Button>

      <Table dataSource={products} columns={columns} loading={isLoading} />

      {/* Sidebar Thêm/Sửa Sản Phẩm */}
      <Drawer
        title={isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        width={400}
        onClose={closeDrawer}
        open={open}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Cập nhật" : "Lưu"}s
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default CategoryList;
