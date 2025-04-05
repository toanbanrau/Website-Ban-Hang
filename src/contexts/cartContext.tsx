import axios from "axios";
import { useState, createContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "./userContext";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { userId } = useUser(); // Lấy userId từ context người dùng
  useEffect(() => {
    if (!userId) setCartItems([]); // Nếu không có userId, đặt giỏ hàng trống
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) {
      console.warn("Người dùng chưa đăng nhập!");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );

      if (data.length > 0) {
        const cart = data[0].products;
        const products = await Promise.all(
          cart.map(async (item) => {
            const res = await axios.get(
              `http://localhost:3000/products/${item.productId}`
            );
            return { ...item, ...res.data }; // Gộp thông tin giỏ hàng và sản phẩm
          })
        );
        setCartItems(products); // Cập nhật giỏ hàng vào state
      } else {
        setCartItems([]); // Nếu không có giỏ hàng, đặt giỏ hàng trống
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return console.warn("Người dùng chưa đăng nhập!");

    try {
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      if (data.length === 0) return;

      const cart = data[0];
      const updatedProducts = cart.products.filter(
        (item: any) => item.productId !== productId
      );

      await axios.put(`http://localhost:3000/cart/${cart.id}`, {
        ...cart,
        products: updatedProducts,
      });

      const updatedCartItems = await Promise.all(
        updatedProducts.map(async (item) => {
          const productRes = await axios.get(
            `http://localhost:3000/products/${item.productId}`
          );
          return { ...item, ...productRes.data }; // Gộp thông tin sản phẩm
        })
      );

      setCartItems(updatedCartItems); // Cập nhật lại giỏ hàng trên UI
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Xóa sản phẩm thất bại!");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return console.warn("Người dùng chưa đăng nhập!");

    try {
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );
      if (data.length === 0) return;

      const cart = data[0];
      const updatedProducts = cart.products.map((item: any) => {
        if (item.productId === productId) {
          item.quantity = quantity;
          item.totalPrice = quantity * item.price; // Cập nhật lại giá trị tổng tiền của sản phẩm
        }
        return item;
      });

      // Cập nhật giỏ hàng lên server
      await axios.put(`http://localhost:3000/cart/${cart.id}`, {
        ...cart,
        products: updatedProducts,
      });

      // Cập nhật lại giỏ hàng trên UI với thông tin đầy đủ sản phẩm (bao gồm hình ảnh)
      const updatedCartItems = await Promise.all(
        updatedProducts.map(async (item) => {
          const productRes = await axios.get(
            `http://localhost:3000/products/${item.productId}`
          );
          // Gộp thông tin giỏ hàng và sản phẩm, bao gồm cả hình ảnh
          return { ...item, ...productRes.data };
        })
      );

      setCartItems(updatedCartItems); // Cập nhật lại giỏ hàng trên UI
      toast.success("Số lượng sản phẩm đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Cập nhật số lượng thất bại!");
    }
  };

  const addToCart = async (product: any) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:3000/cart?userId=${userId}`
      );

      let cart;
      if (!data || data.length === 0) {
        // Nếu không có giỏ hàng, tạo giỏ hàng mới
        const newCart = {
          userId,
          products: [
            {
              productId: product.id,
              quantity: 1,
              totalPrice: product.price,
            },
          ],
        };

        const response = await axios.post(
          "http://localhost:3000/cart",
          newCart
        );
        cart = response.data; // Lấy giỏ hàng mới
        toast.success("Giỏ hàng mới đã được tạo và sản phẩm đã được thêm!");
      } else {
        // Cập nhật giỏ hàng hiện tại
        cart = data[0];
        const existingProductIndex = cart.products.findIndex(
          (p: any) => p.productId === product.id
        );

        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã có, tăng số lượng và cập nhật tổng giá
          cart.products[existingProductIndex].quantity += 1;
          cart.products[existingProductIndex].totalPrice =
            cart.products[existingProductIndex].quantity * product.price;
        } else {
          // Nếu sản phẩm chưa có, thêm mới vào danh sách
          cart.products.push({
            productId: product.id,
            quantity: 1,
            totalPrice: product.price,
          });
        }

        await axios.put(`http://localhost:3000/cart/${cart.id}`, {
          ...cart,
          products: cart.products,
        });

        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }

      // Đồng bộ lại giỏ hàng và hiển thị đầy đủ thông tin sản phẩm (bao gồm hình ảnh)
      const updatedCartItems = await Promise.all(
        cart.products.map(async (item) => {
          const productRes = await axios.get(
            `http://localhost:3000/products/${item.productId}`
          );
          // Gộp thông tin giỏ hàng và sản phẩm, bao gồm cả hình ảnh
          return { ...item, ...productRes.data };
        })
      );

      setCartItems(updatedCartItems); // Cập nhật lại giỏ hàng trên UI
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        removeFromCart,
        fetchCart,
        updateQuantity,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
