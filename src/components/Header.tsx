import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Badge, Button, Drawer, Form, Input, Modal, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { DeleteOutlined } from "@ant-design/icons";
import "../assets/styles/navbar.css";
import "../assets/styles/Header.css";
import { useCart } from "../hook";
import { useUser } from "../contexts/userContext";

const Header = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  const navigate = useNavigate();
  const closeDrawer = () => setDrawerVisible(false);

  const [category, setCategory] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { userId, logout, user } = useUser();
  const { cartItems, fetchCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategory(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
      }
    }; // Tải giỏ hàng khi component được mount
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCart(); // Tải giỏ hàng khi userId thay đổi
    }
  }, [userId]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.warning("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/products?q=${searchTerm}`
      );
      const searchResults = response.data; // Kết quả tìm kiếm từ API
      console.log("Kết quả tìm kiếm:", searchResults);

      // Chuyển hướng đến trang kết quả tìm kiếm
      navigate(`/product?query=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      message.error("Không thể tìm kiếm sản phẩm!");
    }
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const deleteCartItem = async (productId: string) => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để thao tác!");
      return;
    }

    removeFromCart(productId); // Xóa sản phẩm khỏi giỏ hàng
  };

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      message.warning("Số lượng phải lớn hơn 0!");
      return;
    }

    if (!userId) {
      message.warning("Vui lòng đăng nhập để thao tác!");
      return;
    }

    updateQuantity(productId, newQuantity); // Cập nhật số lượng giỏ hàng
  };

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    message.success("Đăng xuất thành công!");
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex flex-column">
          <h1 className="fw-bold" style={{ color: "#008000", lineHeight: "1" }}>
            MARBLE <br /> FEET
          </h1>
        </div>
        <nav className="d-flex align-items-center">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link text-dark">
                Trang Chủ
              </Link>
            </li>
            <li className="nav-item dropdown hover-dropdown">
              <Link
                to={"/product"}
                className="nav-link dropdown-toggle text-dark"
              >
                Sản Phẩm
              </Link>
              <ul className="dropdown-menu">
                {category.map((item: any) => (
                  <li key={item.id} className="dropdown-item">
                    <Link
                      to={`/product?category=${item.id}`}
                      className="text-dark"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark">
                Liên Hệ
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200, marginRight: 10 }}
            />
            <Button type="primary" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </div>
          <ul className="nav ms-3">
            <li className="nav-item">
              <button className="nav-link text-dark" onClick={showDrawer}>
                <Badge count={cartItemCount} offset={[10, 0]}>
                  <FaShoppingCart size={20} />
                </Badge>
              </button>
            </li>

            <li className="nav-item">
              {userId ? (
                <div className="user-dropdown">
                  <button className="nav-link text-dark user-icon">
                    <FaUser size={20} />
                  </button>
                  <div className="dropdown-menu">
                    <Link to={"/profile"} className="dropdown-item">
                      Thông tin cá nhân
                    </Link>
                    <Link to={"/historyOrder"} className="dropdown-item">
                      Lịch sử mua hàng
                    </Link>
                    <button
                      className="dropdown-item btn-danger"
                      onClick={handleLogout}
                    >
                      🚪 Đăng Xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-dropdown">
                  <button className="nav-link text-dark user-icon">
                    <FaUser size={20} />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/login" className="dropdown-item">
                      🔐 Đăng nhập
                    </Link>
                    <Link to="/register" className="dropdown-item">
                      📝 Đăng ký
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>{user && user.email ? <p>Hi: {user.email}</p> : null}</li>
          </ul>
        </nav>
      </header>

      <Drawer
        title={<h4 className="fw-bold text-success">🛒 Giỏ Hàng</h4>}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={420}
      >
        {cartItems.length > 0 ? (
          <>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="d-flex justify-content-between align-items-center p-3 border-0"
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.thumbnail}
                      alt={`Ảnh ${item.name}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "12px",
                      }}
                    />
                    <div>
                      <span className="fw-bold">{item.name}</span>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "14px" }}
                      >
                        {(item.price || 0).toLocaleString()} VNĐ
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "#f8f9fa",
                        fontWeight: "bold",
                        transition: "0.3s",
                      }}
                      onClick={() =>
                        updateCartQuantity(item.productId, item.quantity - 1)
                      }
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#e0e0e0")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#f8f9fa")
                      }
                    >
                      −
                    </button>

                    <span
                      className="mx-2 px-3 py-1 fw-bold text-dark"
                      style={{
                        borderRadius: "8px",
                        background: "#fff",
                        border: "1px solid #ddd",
                        minWidth: "40px",
                        textAlign: "center",
                        fontSize: "16px",
                      }}
                    >
                      {item.quantity || 0}
                    </span>

                    <button
                      className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "#f8f9fa",
                        fontWeight: "bold",
                        transition: "0.3s",
                      }}
                      onClick={() =>
                        updateCartQuantity(item.productId, item.quantity + 1)
                      }
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#e0e0e0")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#f8f9fa")
                      }
                    >
                      +
                    </button>
                  </div>
                  <span
                    className="text-success fw-bold"
                    style={{
                      fontSize: "16px",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {(
                      (item.price || 0) * (item.quantity || 0)
                    ).toLocaleString()}{" "}
                    VNĐ
                  </span>
                  <button
                    className="btn btn-light btn-sm d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                      transition: "0.3s ease-in-out",
                      border: "1px solid #e0e0e0",
                      color: "#d9534f",
                      backgroundColor: "white",
                    }}
                    onClick={() => deleteCartItem(item.productId)}
                    onMouseOver={(e) => (
                      (e.currentTarget.style.background = "#d9534f"),
                      (e.currentTarget.style.color = "#fff")
                    )}
                    onMouseOut={(e) => (
                      (e.currentTarget.style.background = "white"),
                      (e.currentTarget.style.color = "#d9534f")
                    )}
                  >
                    <DeleteOutlined style={{ fontSize: "18px" }} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Tổng tiền */}
            <div
              className="d-flex justify-content-between align-items-center fw-bold py-3 px-2"
              style={{
                borderTop: "2px solid #ddd",
                fontSize: "18px",
              }}
            >
              <span>Tổng:</span>
              <span className="text-danger fs-4">
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + (item.price || 0) * (item.quantity || 0),
                    0
                  )
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </div>

            {/* Nút Thanh Toán */}
            <div className="d-flex justify-content-center mt-3">
              <Link to={"/checkout"}>
                {" "}
                <Button
                  type="primary"
                  size="large"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    message.success("Chuyển đến trang thanh toán!")
                  }
                >
                  🛒 Thanh toán ngay
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-muted">
            🛒 Giỏ hàng của bạn đang trống.
          </p>
        )}
      </Drawer>
    </div>
  );
};

export default Header;
