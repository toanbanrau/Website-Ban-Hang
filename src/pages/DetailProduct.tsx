import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const DetailProduct = () => {
  const { id } = useParams();

  const getProductDetail = async () => {
    if (!id) return;
    const { data } = await axios.get(`http://localhost:3000/products/${id}`);
    return data;
  };
  const addToCart = async (product: any) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      // Kiểm tra xem giỏ hàng của user đã tồn tại chưa
      const response = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      const cart = response.data[0]; // Giỏ hàng của user

      if (cart) {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProductIndex = cart.products.findIndex(
          (p: any) => p.id === product.id
        );

        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng + tổng giá
          cart.products[existingProductIndex].quantity += 1;
          cart.products[existingProductIndex].totalPrice =
            cart.products[existingProductIndex].quantity * product.price;
        } else {
          // Nếu sản phẩm chưa có, thêm mới vào danh sách
          cart.products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1,
            totalPrice: product.price,
          });
        }

        // Cập nhật giỏ hàng
        await axios.patch(`http://localhost:3000/cart/${cart.id}`, {
          products: cart.products,
        });
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        // Nếu user chưa có giỏ hàng, tạo giỏ hàng mới
        const newCart = {
          userId,
          products: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              thumbnail: product.thumbnail,
              quantity: 1,
              totalPrice: product.price,
            },
          ],
        };

        await axios.post("http://localhost:3000/cart", newCart);
        toast.success("Giỏ hàng mới đã được tạo và sản phẩm đã được thêm!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: getProductDetail,
  });

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
