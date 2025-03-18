import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Table, Button, Space } from "antd";
import IProduct from "../../interfaces/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
// function component
function ProductList() {
  const queryClient = useQueryClient();
  const getAllProduct = async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  // Lấy danh sách sản phẩm từ API

  // Xử lý xóa sản phẩm
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries(["products"]); // Cập nhật lại danh sách sản phẩm
    },
    onError: (error: AxiosError) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Hàm xử lý xóa sản phẩm
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct.mutate(id);
    }
  };
  // };

  // Cấu trúc dữ liệu của bảng
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
      render: (price: number) => `${price.toLocaleString()} VNĐ`, // Format giá tiền
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IProduct) => (
        <Space size="middle">
          <Link to={`/admin/product/edit/${record.id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <Link to="/admin/product/add">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Thêm sản phẩm
        </Button>
      </Link>
      <Table dataSource={data} columns={columns} loading={isLoading} />
    </div>
  );
}

export default ProductList;
