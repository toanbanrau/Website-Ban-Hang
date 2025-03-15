import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Table, Button, Space } from "antd";
import IProduct from "../../interfaces/product";

// function component
function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/products");
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        toast.error((error as AxiosError).message);
      }
    };
    getAll();
  }, []);

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        toast.success("Xóa sản phẩm thành công!");
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        toast.error((error as AxiosError).message);
      }
    }
  };

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
          <Link to={`/product/${record.id}/edit`}>
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
      <Link to="/product/add">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Thêm sản phẩm
        </Button>
      </Link>
      <Table
        dataSource={products.map((p) => ({ ...p, key: p.id }))}
        columns={columns}
      />
    </div>
  );
}

export default ProductList;
