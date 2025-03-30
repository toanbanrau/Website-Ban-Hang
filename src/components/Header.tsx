import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Badge, Button, Drawer, Form, Input, Modal, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { DeleteOutlined } from "@ant-design/icons";

const Header = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

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
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      message.error("Không thể tìm kiếm sản phẩm!");
    }
  };

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
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      console.log(data);

      const validCartItems = data.flatMap((cart: any) =>
        cart.products.map((product: any) => ({
          id: product.id, // ID của sản phẩm trong giỏ hàng
          productId: product.id, // ID của sản phẩm trong danh sách sản phẩm
          name: product.name, // Tên sản phẩm
          price: product.price, // Giá sản phẩm
          thumbnail: product.thumbnail, // Ảnh sản phẩm
          quantity: product.quantity, // Số lượng sản phẩm
          totalPrice: product.totalPrice, // Tổng giá
        }))
      );
      setCartItems(validCartItems);
    } catch (error) {
      toast.error("Không thể tải dữ liệu giỏ hàng!");
    }
  };

  const deleteCartItem = async (productId: string) => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để thao tác!");
      return;
    }

    try {
      // 1️⃣ Lấy giỏ hàng hiện tại của user
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );

      if (!data || data.length === 0) {
        message.warning("Giỏ hàng trống!");
        return;
      }

      let cart = data[0];

      // 2️⃣ Lọc bỏ sản phẩm cần xóa
      const updatedProducts = cart.products.filter(
        (product: any) => product.id !== productId
      );

      if (updatedProducts.length === 0) {
        // 3️⃣ Xóa giỏ hàng nếu không còn sản phẩm
        await axios.delete(`http://localhost:3000/cart/${cart.id}`);
        setCartItems([]); // Reset giỏ hàng trong state
      } else {
        // 4️⃣ Cập nhật giỏ hàng nếu vẫn còn sản phẩm
        await axios.put(`http://localhost:3000/cart/${cart.id}`, {
          ...cart,
          products: updatedProducts,
        });

        // 🔥 Cập nhật state DỰA TRÊN STATE CŨ để đảm bảo không mất dữ liệu
        setCartItems((prevCart) =>
          prevCart.filter((item) => item.id !== productId)
        );
      }

      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Xóa sản phẩm thất bại!");
    }
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

    try {
      // Lấy giỏ hàng hiện tại của user
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );

      if (!data || data.length === 0) {
        message.warning("Giỏ hàng trống!");
        return;
      }

      let cart = data[0];

      // Cập nhật số lượng sản phẩm trong giỏ hàng
      const updatedProducts = cart.products.map((product: any) =>
        product.id === productId
          ? {
              ...product,
              quantity: newQuantity,
              totalPrice: newQuantity * product.price,
            }
          : product
      );

      // Gửi yêu cầu cập nhật giỏ hàng
      await axios.put(`http://localhost:3000/cart/${cart.id}`, {
        ...cart,
        products: updatedProducts,
      });

      // Cập nhật state giỏ hàng
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * item.price,
              }
            : item
        )
      );

      message.success("Cập nhật số lượng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
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

      const { accessToken } = response.data;
      if (!accessToken) throw new Error("Không nhận được accessToken!");

      // 🛠 Decode JWT để lấy userID
      const decoded = jwtDecode(accessToken);
      console.log("Decoded Token:", decoded);

      if (!decoded?.sub) throw new Error("Không tìm thấy userID trong token!");

      localStorage.setItem("token", accessToken);
      localStorage.setItem("userId", decoded.sub);

      setUserId(localStorage.getItem("userId")); // Chuyển id thành string để lưu vào localStorage

      toast.success("Đăng nhập thành công!");
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
