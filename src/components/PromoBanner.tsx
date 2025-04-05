import "../assets/styles/PromoBanner.css"; // Giả sử bạn có file CSS riêng cho PromoBanner

const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <h2>Khuyến Mãi Đặc Biệt</h2>
      <p>Mua 2 tặng 1 - Chỉ trong tuần này!</p>
      <button className="promo-btn">Mua ngay</button>
    </div>
  );
};

export default PromoBanner;
