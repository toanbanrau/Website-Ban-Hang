import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Divider,
  List,
  Typography,
  message,
  Select,
} from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId"); // 📌 Lấy userId từ localStorage

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]); // Chạy khi userId thay đổi

  // 📌 Gọi API lấy giỏ hàng theo userId
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      setCartItems(response.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu giỏ hàng!");
    }
  };

  // 📌 Cập nhật số lượng sản phẩm
  const updateCartQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(`http://localhost:3000/cart/${itemId}`, {
        quantity: newQuantity,
      });

      // Cập nhật UI ngay lập tức
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      message.error("Cập nhật số lượng thất bại!");
    }
  };

  // 📌 Xóa sản phẩm khỏi giỏ hàng
  const removeCartItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${itemId}`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  // 📌 Gửi đơn hàng lên server
  const handleOrder = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/orders", {
        userId,
        items: cartItems,
        ...values,
      });
      message.success("Đặt hàng thành công!");
      setCartItems([]); // Xóa giỏ hàng sau khi đặt hàng
    } catch (error) {
      message.error("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      {/* Form nhập thông tin giao hàng */}
      <Card title="Thông Tin Giao Hàng" className="checkout-card">
        <Form form={form} layout="vertical" onFinish={handleOrder}>
          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ giao hàng"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="paymentMethod"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương thức thanh toán",
              },
            ]}
          >
            <Select placeholder="Chọn phương thức thanh toán">
              <Select.Option value="creditCard">Thẻ tín dụng</Select.Option>
              <Select.Option value="cashOnDelivery">
                Thanh toán khi nhận hàng
              </Select.Option>
              <Select.Option value="bankTransfer">
                Chuyển khoản ngân hàng
              </Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đặt Hàng
          </Button>
        </Form>
      </Card>

      {/* Danh sách sản phẩm trong giỏ hàng */}
      <Card title="Giỏ Hàng Của Bạn" className="checkout-card">
        <List
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <Text>{item.name}</Text>
              <div>
                <Button
                  size="small"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                <Button
                  size="small"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Text strong>
                {item.quantity} x ${item.price}
              </Text>
              <Button
                type="link"
                danger
                onClick={() => removeCartItem(item.id)}
              >
                Xóa
              </Button>
            </List.Item>
          )}
        />
        <Divider />
        <Title level={4}>Tổng tiền: ${totalPrice}</Title>
      </Card>
    </div>
  );
};

export default Checkout;
