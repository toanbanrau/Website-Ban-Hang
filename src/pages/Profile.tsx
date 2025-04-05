import "../assets/styles/Profile.css"; // File CSS riêng
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  // Dữ liệu mẫu của người dùng

  interface User {
    fullname: string;
    email: string;
    password: string;
  }

  const [user, setUser] = useState<User>({
    fullname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        // Gọi API để lấy dữ liệu user
        const { data } = await axios(`http://localhost:3000/users/${userId}`);
        console.log(data);

        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>

      <div className="profile-content">
        <div className="avatar-section">
          <img src="" alt="Avatar" className="avatar" />
          <button className="edit-avatar-btn">Đổi ảnh đại diện</button>
        </div>

        <div className="info-section">
          <div className="info-item">
            <label>Họ và tên:</label>
            <span> {user.fullname}</span>
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className="action-buttons">
            <button className="edit-btn">Chỉnh sửa thông tin</button>
            <button className="change-password-btn">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
