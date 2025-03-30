import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Button, Card, Spin, message } from "antd";
import IProduct from "../interfaces/product";

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy từ khóa tìm kiếm từ query string
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        message.warning("Không có từ khóa tìm kiếm!");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/products?q=${query}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải kết quả tìm kiếm:", error);
        message.error("Không thể tải kết quả tìm kiếm!");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spin tip="Đang tải kết quả tìm kiếm..." />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Kết quả tìm kiếm cho: <strong>"{query}"</strong>
      </h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product: IProduct) => (
            <div key={product.id} className="col-md-4 col-sm-6 mb-4">
              <Card
                hoverable
                className="shadow-lg rounded"
                cover={
                  <img
                    alt={product.name || "Sản phẩm"}
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    className="img-fluid rounded-top"
                    style={{
                      height: "300px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={product.name || "Chưa có tên"}
                  description={
                    <strong className="text-danger">
                      ${product.price || "0"}
                    </strong>
                  }
                />
                <p className="mt-2">
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
        ) : (
          <p className="text-center text-muted w-100">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa:{" "}
            <strong>"{query}"</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
