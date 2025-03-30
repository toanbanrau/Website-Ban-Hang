import React, { useEffect, useState } from "react";
import { Table, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        const formattedData = response.data.map((order) => ({
          key: order.id,
          id: order.id,
          name: order.name,
          phone: order.phone,
          address: order.address,
          items: order.items,
          payment: order.paymentMethod,
          // Giữ nguyên danh sách sản phẩm
          totalAmount: order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          status: order.status,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (value, record) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${record.id}`, {
        status: value,
      });

      setData((prevData) =>
        prevData.map((item) =>
          item.id === record.id ? { ...item, status: value } : item
        )
      );

      console.log(`Cập nhật trạng thái đơn hàng ${record.id} thành: ${value}`);
    } catch (error) {
      console.error(
        `Lỗi khi cập nhật trạng thái đơn hàng ${record.id}:`,
        error
      );
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Products",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul>
          {items.map((item) => (
            <li key={item.productId}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Total Amount ($)",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record)}
          disabled={status === "Completed"} // Vô hiệu hóa nếu trạng thái là Completed
        >
          <Option value="Pending">Pending</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <h1>Order List</h1>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default Order;
