import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Badge, Button, Drawer, Form, Input, Modal, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    message.success("Bạn đã đăng xuất!");
  };

  const showDrawer = () => {
    setDrawerVisible(true);
    fetchCartItems();
  };

  const closeDrawer = () => setDrawerVisible(false);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const fetchCartItems = async () => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để xem giỏ hàng!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      const validCartItems = response.data.map((item: any) => ({
        ...item,
        price: item.price || 0,
        quantity: item.quantity || 0,
      }));
      setCartItems(validCartItems);
    } catch (error) {
      message.error("Không thể tải dữ liệu giỏ hàng!");
    }
  };

  const deleteCartItem = async (itemId: number) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${itemId}`);
      setCartItems((prevCart) => prevCart.filter((item) => item.id !== itemId));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const updateCartQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(`http://localhost:3000/cart/${itemId}`, {
        quantity: newQuantity,
      });

      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      message.error("Cập nhật số lượng thất bại!");
    }
  };

  const handleRegister = async (values: {
    fullname: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/register", values);
      message.success("Đăng ký thành công!");
      closeModal();
    } catch (error: any) {
      message.error(error.response?.data || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", values);
      const { token } = response.data;
      localStorage.setItem("userId", token);
      setUserId(token);
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
                Trang Chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"product"} className="nav-link text-dark">
                Sản Phẩm
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark">
                Liên Hệ
              </a>
            </li>
          </ul>
          <ul className="nav ms-3">
            <li className="nav-item">
              <button className="nav-link text-dark">
                <FaSearch size={20} />
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link text-dark" onClick={showDrawer}>
                <Badge count={cartItemCount} offset={[10, 0]}>
                  <FaShoppingCart size={20} />
                </Badge>
              </button>
            </li>
            <li className="nav-item">
              {userId ? (
                <button className="btn btn-danger" onClick={handleLogout}>
                  🚪 Đăng Xuất
                </button>
              ) : (
                <button className="nav-link text-dark" onClick={showModal}>
                  <FaUser size={20} />
                </button>
              )}
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
              {cartItems.map((item) => (
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
                        {(item.price || 0).toLocaleString()} VNĐ
                      </p>
                    </div>
                  </div>
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
                      {item.quantity || 0}
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
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: "50%" }}
                    onClick={() => deleteCartItem(item.id)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
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
                    (total, item) =>
                      total + (item.price || 0) * (item.quantity || 0),
                    0
                  )
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </div>
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
