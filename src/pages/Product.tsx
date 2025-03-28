import React from "react";
import { Card, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useList } from "../hook";
import IProduct from "../interfaces/product";
import { Link } from "react-router-dom";

const Product = () => {
  const { data: products, isLoading } = useList({ resource: "products" });

  if (isLoading) {
    return <p>Đang tải sản phẩm...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {products?.map((product: IProduct) => (
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
              <p className="mt-2">{product.description || "Không có mô tả."}</p>
              <Link to={product.id}>
                {" "}
                <Button type="primary" block className="mt-2">
                  🔍 Xem chi tiết
                </Button>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
