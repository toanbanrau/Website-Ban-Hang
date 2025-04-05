import { Card, Button, Rate } from "antd"; // Thêm Rate để đánh giá
import "bootstrap/dist/css/bootstrap.min.css";
import { useList } from "../hook";
import IProduct from "../interfaces/product";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState<IProduct[]>([]); // Khởi tạo với mảng trống
  const { data, isLoading } = useList({ resource: "products" });

  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return; // Không chạy khi dữ liệu đang tải

    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const categoryId = searchParams.get("category");

    if (query) {
      setSearchTerm(query);
      fetchSearchResults(query);
    } else if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else if (Array.isArray(data)) {
      setProducts(data); // Chỉ gọi setProducts nếu data là một mảng
    }
  }, [location.search, data, isLoading]);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products?q=${query}`
      );
      console.log(response.data);

      setProducts(response.data); // Cập nhật sản phẩm theo kết quả tìm kiếm
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]); // Nếu có lỗi, đặt sản phẩm thành mảng trống
    }
  };
  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products?categoryId=${categoryId}`
      );
      console.log(response.data);

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setProducts([]); // Đặt products thành mảng trống nếu có lỗi
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        {searchTerm
          ? `Kết quả tìm kiếm cho "${searchTerm}"`
          : "Sản Phẩm Nổi Bật"}
      </h2>
      <div className="row">
        {products?.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          products.map((product: IProduct) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <Card
                hoverable
                className="shadow-sm rounded h-100"
                cover={
                  <img
                    alt={product.name || "Sản phẩm"}
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    className="img-fluid rounded-top"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <div className="d-flex justify-content-between">
                      <span>{product.name || "Chưa có tên"}</span>
                      <Rate
                        disabled
                        defaultValue={4}
                        style={{ fontSize: 14 }}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <strong className="text-danger">
                        {product.price?.toLocaleString("vi-VN") || "0"} ₫
                      </strong>
                      {product.discount && (
                        <span className="text-muted ms-2 text-decoration-line-through">
                          {(product.price * 1.2).toLocaleString("vi-VN")} ₫
                        </span>
                      )}
                    </div>
                  }
                />
                <p className="mt-2 text-truncate" title={product.description}>
                  {product.description || "Không có mô tả."}
                </p>
                <Link to={`/product/${product.id}`}>
                  <Button type="primary" block className="mt-2">
                    🔍 Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Product;
