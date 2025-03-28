import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  TagsOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅ Hook điều hướng

  // Danh sách menu
  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <InboxOutlined />,
      label: "Product",
      onClick: () => navigate("/admin/product/list"),
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Order",
      onClick: () => navigate("/admin/order"),
    },
    {
      key: "10",
      icon: <FileOutlined />,
      label: "Category",
      onClick: () => navigate("/admin/category"), // ✅ Thêm Category
    },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "User",
      children: [
        {
          key: "3",
          label: "Admin",
          onClick: () => navigate("/admin/user/list"),
        },
        {
          key: "4",
          label: "Bill",
          onClick: () => navigate("/admin/user/"),
        },
      ],
    },
    {
      key: "sub2",
      icon: <TeamOutlined />,
      label: "Team",
      children: [
        { key: "6", label: "Team 1", onClick: () => navigate("/admin/team/1") },
        { key: "8", label: "Team 2", onClick: () => navigate("/admin/team/2") },
      ],
    },
    {
      key: "9",
      icon: <FileOutlined />,
      label: "Files",
      onClick: () => navigate("/admin/files"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            textAlign: "center",
            lineHeight: "64px",
            color: "white",
            fontSize: 20,
          }}
        >
          Admin Panel
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Layout chính */}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Admin Dashboard
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
