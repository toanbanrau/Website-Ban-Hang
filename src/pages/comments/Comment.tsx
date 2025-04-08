import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

interface Comment {
  id: number;
  content: string;
}

const Comment = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Giả sử API của bạn là /api/comments
    const getComments = async () => {
      const { data } = await axios.get("http://localhost:3000/comments");
      setComments(data); // Cập nhật danh sách bình luận từ API
    };
    getComments();
  }, []);

  const handleReply = (id: number) => {
    console.log(`Reply to comment with id: ${id}`);
    message.info(`Reply to comment with id: ${id}`);
    // Thêm logic xử lý reply ở đây
  };

  const handleDelete = (id: number) => {
    console.log(`Delete comment with id: ${id}`);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
    message.success(`Deleted comment with id: ${id}`);
    // Thêm logic xử lý xóa ở đây (ví dụ gọi API xóa)
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Comment) => (
        <>
          <Button type="link" onClick={() => handleReply(record.id)}>
            Reply
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Comments</h1>
      <Table
        dataSource={comments.map((comment) => ({
          ...comment,
          key: comment.id,
        }))}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Comment;
