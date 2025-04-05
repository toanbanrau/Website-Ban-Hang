import { Button, Form, Input } from "antd";
import { useAuth } from "../hook";

const Register = () => {
  const { mutate } = useAuth({ resource: "register" });
  const handleRegister = async (values: any) => {
    mutate(values);
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item
          label="Họ và tên"
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
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
          <Button type="primary" htmlType="submit" className="w-100">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
