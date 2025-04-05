import React from "react";
import "../assets/styles/Brands.css"; // Giả sử bạn có file CSS riêng cho Brands

const Brands = () => {
  const brands = [
    {
      id: 1,
      name: "Nike",
      logo: "https://tse1.mm.bing.net/th?id=OIP.OFAJjiEH5qsHo77r9dY64gHaEK&pid=Api&P=0&h=220",
    },
    {
      id: 2,
      name: "Adidas",
      logo: "https://tse2.mm.bing.net/th?id=OIP.jda-jGq1luFgO1x1v1Y4bAHaFC&pid=Api&P=0&h=220",
    },
    {
      id: 3,
      name: "Puma",
      logo: "https://tse2.mm.bing.net/th?id=OIP.0z2kSI_ehJizOeLLUL77dQHaEK&pid=Api&P=0&h=220",
    },
    {
      id: 4,
      name: "Converse",
      logo: "https://tse4.mm.bing.net/th?id=OIP.5VAKSDJ9_38Jfg2MNJO35QAAAA&pid=Api&P=0&h=220",
    },
  ];

  return (
    <div className="brands">
      <h2>Thương Hiệu Hàng Đầu</h2>
      <div className="brand-list">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-item">
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
