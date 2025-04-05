import React from "react";
import { useAuth } from "../hook";
import { Button, Form, Input } from "antd";

const Login = () => {
  const { mutate } = useAuth({ resource: "login" });
  const handleLogin = async (values: any) => {
    mutate(values);
  };
  return (
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
        <Button type="primary" htmlType="submit" className="w-100">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
