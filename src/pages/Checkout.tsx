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
  Col,
  Row,
} from "antd";
import axios from "axios";
import { useCart } from "../hook";

const { Title, Text } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId"); // 📌 Lấy userId từ localStorage
  const [vouchers, setVouchers] = useState([]); // Danh sách voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher được chọn
  const [discountedTotal, setDiscountedTotal] = useState(); // Tổng tiền sau giảm giá // 📌 Khởi tạo state cho voucher
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  // Chạy khi userId thay đổi

  // 📌 Gọi API lấy giỏ hàng theo userId
  // Lấy tất cả voucher
  useEffect(() => {
    const fetchAllVouchers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/vouchers");
        setVouchers(data); // Hiển thị danh sách voucher trong console
      } catch (error) {
        console.error("Lỗi khi lấy danh sách voucher:", error);
        message.error("Không thể tải dữ liệu voucher!");
      }
    };

    fetchAllVouchers();
  }, []);

  const handleApplyVoucher = (voucherCode) => {
    const voucher = vouchers.find((v) => v.code === voucherCode);

    if (!voucher) {
      message.error("Mã giảm giá không hợp lệ!");
      setSelectedVoucher(null);
      setDiscountedTotal(totalPrice); // Không áp dụng giảm giá
      return;
    }

    if (totalPrice < voucher.minOrderValue) {
      message.warning(
        `Đơn hàng phải có giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()} VNĐ để áp dụng mã giảm giá này!`
      );
      setSelectedVoucher(null);
      setDiscountedTotal(totalPrice); // Không áp dụng giảm giá
      return;
    }

    // Tính tổng tiền sau giảm giá
    const discount = (totalPrice * voucher.discount) / 100;
    const newTotal = totalPrice - discount;

    setSelectedVoucher(voucher); // Lưu voucher được chọn
    setDiscountedTotal(newTotal); // Cập nhật tổng tiền sau giảm giá
    message.success(
      `Áp dụng mã giảm giá thành công! Giảm ${discount.toLocaleString()} VNĐ`
    );
  };

  // 📌 Cập nhật số lượng sản phẩm
  const deleteCartItem = async (productId: string) => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để thao tác!");
      return;
    }

    removeFromCart(productId);
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

    updateQuantity(productId, newQuantity);
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
    <div className="container">
      <Row gutter={24}>
        {/* Cột bên trái: Form nhập thông tin giao hàng */}
        <Col xs={24} md={12}>
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
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^0\d{9}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" type="tel" />
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
        </Col>

        {/* Cột bên phải: Giỏ hàng */}
        <Col xs={24} md={12}>
          <Card title="Giỏ Hàng Của Bạn" className="checkout-card">
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.name}</Text>
                  <div>
                    <Button
                      size="small"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                    <Button
                      size="small"
                      onClick={() =>
                        updateCartQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Text strong>
                    {item.quantity} x {item.price} VNĐ
                  </Text>
                  <Button
                    type="link"
                    danger
                    onClick={() => deleteCartItem(item.productId)}
                  >
                    Xóa
                  </Button>
                </List.Item>
              )}
            />
            <Divider />
            <Title level={4}>
              Tổng tiền: {totalPrice.toLocaleString()} VNĐ
            </Title>
            {selectedVoucher && (
              <Title level={4} style={{ color: "green" }}>
                Giảm giá: -
                {(totalPrice - discountedTotal || 0).toLocaleString()} VNĐ
              </Title>
            )}
            <Title level={4}>
              Tổng thanh toán:{" "}
              {(discountedTotal ?? totalPrice).toLocaleString()} VNĐ
            </Title>
          </Card>
          <Card title="Áp Dụng Mã Giảm Giá" className="checkout-card">
            <Select
              placeholder="Chọn mã giảm giá"
              style={{ width: "100%" }}
              onChange={handleApplyVoucher}
            >
              {vouchers.map((voucher) => (
                <Select.Option key={voucher.id} value={voucher.code}>
                  {voucher.code} - Giảm {voucher.discount}% (Tối thiểu:{" "}
                  {voucher.minOrderValue.toLocaleString()} VNĐ)
                </Select.Option>
              ))}
            </Select>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
