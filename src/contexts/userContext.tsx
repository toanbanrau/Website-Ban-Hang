import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: number;
  email: string;
  role?: string;
};

interface UserContextType {
  user: User | null; // sửa từ userID thành userId cho đồng nhất
  userId: string | null;
  login: (userID: any, user: User) => void;
  logout: () => void;
}

// B1: Tạo Context để quản lý dữ liệu người dùng
export const UserContext = createContext<UserContextType | null>(null);

// B2: Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // useEffect: lấy dữ liệu người dùng từ localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    if (user && userId) {
      setUser(JSON.parse(user));
      setUserId(userId); // Cập nhật ngay userId từ localStorage
    }
  }, []);

  // login: Cập nhật thông tin người dùng và userId
  const login = (userId: any, user: User) => {
    setUser(user);
    setUserId(userId);
  };

  // logout: Xóa thông tin người dùng và userId
  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
