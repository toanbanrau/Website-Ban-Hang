import { useQuery } from "@tanstack/react-query";
import { Button, Input } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useCart } from "../hook";

const DetailProduct = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  const { addToCart } = useCart();
  useEffect(() => {
    const getComentById = async () => {
      if (!id) return;
      const { data } = await axios.get(
        `http://localhost:3000/comments?productId=${id}`
      );
      setComments(data || []);
    };
    getComentById();
  }, []);

  const getProductDetail = async () => {
    if (!id) return;
    const { data } = await axios.get(`http://localhost:3000/products/${id}`);
    return data;
  };

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: getProductDetail,
  });

  const [form] = Form.useForm(); // Để reset form sau khi gửi

  const addComment = async (values: any) => {
    try {
      // Lấy userId từ localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Vui lòng đăng nhập để bình luận!");
        return;
      }

      // Tạo object bình luận để gửi lên API
      const newComment = {
        userId: userId,
        content: values.comment,
        timestamp: new Date().toISOString(),
      };

      // Gọi API gửi bình luận
      const response = await axios.post(
        "http://localhost:3000/comments",
        newComment
      );

      // Giả sử API trả về bình luận vừa thêm
      setComments([...comments, response.data]);
      toast.success("Bình luận đã được thêm!");

      // Reset form sau khi gửi thành công
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      toast.error("Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  return (
    <div className="product-detail-wrapper">
      <h1 className="product-detail-title">Chi Tiết Sản Phẩm</h1>
      <div className="product-container">
        <div className="product-image-section">
          <img
            src={product?.thumbnail}
            alt="Giày cao cấp"
            className="product-image"
          />
        </div>
        <div className="product-info-section">
          <h2 className="product-name">{product?.name}</h2>
          <p className="product-description">{product?.description}</p>
          <div className="price-section">
            <span className="current-price">{product?.price} VNĐ</span>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              Thêm vào giỏ hàng
            </button>
            <button className="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
      <div className="comment-section mt-5 p-4 bg-light rounded shadow-lg">
        <h2 className="mb-4 text-center text-primary">Bình luận</h2>

        {/* Form bình luận */}
        <div className="max-w-3xl mx-auto">
          {/* Form nhập bình luận */}
          <Form
            form={form}
            onFinish={addComment}
            layout="vertical"
            className="mb-6"
          >
            <Form.Item
              name="comment"
              rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
            >
              <Input.TextArea
                placeholder="Viết bình luận của bạn..."
                className="shadow-sm p-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                rows={4}
              />
            </Form.Item>
            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="px-6 py-2 h-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
              >
                Gửi
              </Button>
            </div>
          </Form>

          {/* Danh sách bình luận */}
          <div className="comment-list mt-5">
            {comments.map((c, index) => (
              <div
                key={index}
                className="comment-item mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-2 border-indigo-400"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-indigo-600">
                    Bình luận {index + 1}
                  </p>
                  <small className="text-xs text-gray-500">Vừa xong</small>
                </div>
                <p className="mb-0 text-gray-800 leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS inline trong cùng file */}
      <style jsx>{`
        .product-detail-wrapper {
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
          font-family: "Arial", sans-serif;
        }

        .product-detail-title {
          text-align: center;
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .product-image-section {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9f9f9;
          border-radius: 15px;
          overflow: hidden;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .product-info-section {
          padding: 20px;
        }

        .product-name {
          font-size: 2rem;
          color: #2c2c2c;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .product-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .price-section {
          margin-bottom: 25px;
        }

        .current-price {
          font-size: 2rem;
          color: #d4af37;
          font-weight: 700;
          margin-right: 15px;
        }

        .original-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
        }

        .product-details p {
          margin: 10px 0;
          color: #444;
          font-size: 1rem;
        }

        .stock-status {
          color: #27ae60;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .add-to-cart,
        .buy-now {
          padding: 12px 30px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-to-cart {
          background: #2c2c2c;
          color: #fff;
        }

        .add-to-cart:hover {
          background: #d4af37;
          color: #fff;
        }

        .buy-now {
          background: #d4af37;
          color: #fff;
        }

        .buy-now:hover {
          background: #b8932e;
        }

        @media (max-width: 768px) {
          .product-container {
            grid-template-columns: 1fr;
          }

          .product-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailProduct;
