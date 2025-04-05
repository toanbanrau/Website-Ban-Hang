import "../assets/styles/HistoryOrder.css"; // Giả sử chúng ta sẽ tạo file CSS riêng
import { useEffect, useState } from "react";
import axios from "axios";

const HistoryOrder = () => {
  // Dữ liệu mẫu cho lịch sử đơn hàng
  const [orders, setOrders] = useState<any[]>([]);

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");

        // Lọc các đơn hàng theo userId từ localStorage
        const userOrders = response.data.filter(
          (order: any) => order.userId.toString() === userId
        );

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]); // Khi userId thay đổi, gọi lại useEffect

  // Hàm tính tổng tiền đơn hàng
  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="history-order-container">
      <h2>Lịch Sử Đơn Hàng</h2>

      <div className="orders-table">
        <div className="table-header">
          <span>Mã đơn hàng</span>
          <span>Ngày đặt</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
          <span>Chi tiết</span>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="order-row">
            <span>{order.id}</span>
            <span>{order.date}</span>
            <span>{calculateTotal(order.items).toLocaleString("vi-VN")} ₫</span>
            <span>{order.status}</span>
            <button className="details-btn">Xem chi tiết</button>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-message">
            Chưa có đơn hàng nào trong lịch sử
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryOrder;
