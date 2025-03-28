import React from "react";
import { Table } from "antd";

interface User {
  key: string;
  name: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [data, setData] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  return <Table dataSource={data} columns={columns} />;
};

export default UserList;
