import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Badge, Button, Drawer, Form, Input, Modal, Tabs, message } from "antd"; // Import Modal & Tabs từ Ant Design
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const cartItemCount = cartItems.reduce(
    (total, item: any) => total + item.quantity,
    0
  );

  const showDrawer = () => {
    setDrawerVisible(true);
    fetchCartItems(); // Gọi API để lấy dữ liệu giỏ hàng
  };
  const closeDrawer = () => setDrawerVisible(false);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Handle user registration
  interface RegisterValues {
    fullname: string;
    email: string;
    password: string;
  }

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cart");
      setCartItems(response.data); // Lưu dữ liệu giỏ hàng vào state
    } catch (error) {
      message.error("Không thể tải dữ liệu giỏ hàng!");
    }
  };

  const updateCartQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Không cho số lượng nhỏ hơn 1

    try {
      await axios.patch(`http://localhost:3000/cart/${itemId}`, {
        quantity: newQuantity,
      });

      // Cập nhật UI ngay sau khi API thành công
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      message.error("Cập nhật số lượng thất bại!");
    }
  };

  const handleRegister = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        values
      );
      message.success("Đăng ký thành công!");
      closeModal();
    } catch (error: any) {
      message.error(error.response?.data || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", values);
      const { token } = response.data; // Extract token from response
      localStorage.setItem("userId", token); // Store token in localStorage
      message.success("Đăng nhập thành công!");
      closeModal();
    } catch (error: any) {
      message.error(error.response?.data || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
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
                TRANG CHỦ
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark">
                NIKE
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark">
                ADIDAS
              </a>
            </li>
          </ul>
          <ul className="nav ms-3">
            <li className="nav-item">
              <a href="#" className="nav-link text-dark">
                <FaSearch size={20} />
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark" onClick={showModal}>
                <FaUser size={20} />
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark" onClick={showDrawer}>
                <Badge count={cartItemCount} offset={[10, 0]}>
                  <FaShoppingCart size={20} />
                </Badge>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <Drawer
        title={<h4 className="fw-bold text-success">🛒 Giỏ Hàng Của Bạn</h4>}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={420}
      >
        {cartItems.length > 0 ? (
          <>
            <ul className="list-group mb-3">
              {cartItems.map((item: any) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-0"
                  style={{
                    borderRadius: "12px",
                    background: "#f8f9fa",
                    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={`Ảnh sản phẩm ${item.name}`}
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
                        {item.price.toLocaleString()} VNĐ
                      </p>
                    </div>
                  </div>

                  {/* Bộ điều chỉnh số lượng sản phẩm */}
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-light btn-sm px-2"
                      style={{
                        borderRadius: "50%",
                        fontWeight: "bold",
                        background: "#eee",
                      }}
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span
                      className="mx-2 px-3 py-1"
                      style={{
                        borderRadius: "8px",
                        background: "#fff",
                        border: "1px solid #ddd",
                        minWidth: "35px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-light btn-sm px-2"
                      style={{
                        borderRadius: "50%",
                        fontWeight: "bold",
                        background: "#eee",
                      }}
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Giá sản phẩm */}
                  <span
                    className="text-success fw-bold"
                    style={{
                      fontSize: "16px",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </span>
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
              <span>Tổng tiền:</span>
              <span className="text-danger fs-4">
                {cartItems
                  .reduce(
                    (total: number, item: any) =>
                      total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </div>

            {/* Nút Thanh Toán */}
            <button
              className="btn w-100 text-white py-2"
              style={{
                background: "linear-gradient(135deg, #ff7f50, #ff6347)",
                fontSize: "18px",
                borderRadius: "10px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Thanh Toán Ngay
            </button>
          </>
        ) : (
          <p className="text-center text-muted">
            🛒 Giỏ hàng của bạn đang trống.
          </p>
        )}
      </Drawer>

      <Modal
        title="Tài khoản"
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        centered
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Đăng nhập" key="1">
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đăng ký" key="2">
            <Form layout="vertical" onFinish={handleRegister}>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={loading}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Header;
