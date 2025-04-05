import "../assets/styles/ShoeStore.css"; // Giả sử bạn có file CSS riêng cho ShoeStore

const ShoeStore = () => {
  const shoes = [
    {
      id: 1,
      name: "Nike Air Max 90",
      price: 2500000,
      image: "https://via.placeholder.com/200x200?text=Nike+Air+Max",
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 3200000,
      image: "https://via.placeholder.com/200x200?text=Adidas+Ultraboost",
    },
    {
      id: 3,
      name: "Puma RS-X",
      price: 1800000,
      image: "https://via.placeholder.com/200x200?text=Puma+RS-X",
    },
    {
      id: 4,
      name: "Converse Chuck 70",
      price: 1500000,
      image: "https://via.placeholder.com/200x200?text=Converse+Chuck",
    },
  ];

  return (
    <div className="shoe-store">
      <h2>Sản Phẩm Nổi Bật</h2>
      <div className="shoe-list">
        {shoes.map((shoe) => (
          <div key={shoe.id} className="shoe-item">
            <img src={shoe.image} alt={shoe.name} />
            <h3>{shoe.name}</h3>
            <p>{shoe.price.toLocaleString("vi-VN")} ₫</p>
            <button className="buy-btn">Thêm vào giỏ</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoeStore;
