import React from "react";
import { FaPhone, FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="mt-4 border-top">
      <section className="py-4" style={{ backgroundColor: "#D9D9D9" }}>
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4">
              <h5 className="fw-bold">CAM KẾT CHÍNH HÃNG</h5>
              <p className="text-muted">100% Authentic</p>
              <p>Cam kết chính hãng từ châu Âu sang châu Mỹ</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">GIAO HÀNG HỎA TỐC</h5>
              <p className="text-muted">Express delivery</p>
              <p>SHIP hỏa tốc: 1h nhận hàng trong nội thành HN</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">HỖ TRỢ 24/24</h5>
              <p className="text-muted">Supporting 24/24</p>
              <p>Gọi ngay</p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="bg-secondary text-white py-3 d-flex align-items-center"
        style={{ paddingLeft: "12px" }}
      >
        <FaPhone size={24} className="me-2" />
        <span>Hỗ trợ / Mua hàng</span>
        <span className="ms-2 text-danger fw-bold">0389225799</span>
      </div>
      <div className="container text-center py-4">
        <div className="row justify-content-start">
          <div className="col-md-4">
            <img src="images/f2.jpg" alt="" style={{ maxWidth: "80%" }} />
            <div className="d-flex justify-content-center gap-3 mt-2">
              <FaFacebookF size={24} />
              <FaGoogle size={24} />
              <FaTwitter size={24} />
            </div>
          </div>

          <div className="col-md-4">
            <h2 className="fw-bold" style={{ fontSize: "3rem" }}>
              M
            </h2>
            <h5 className="fw-bold">HỆ THỐNG CỬA HÀNG</h5>
            <p>Mỹ Đình 2, Nam Từ Liêm, Hà Nội</p>
            <p>133, Trịnh Văn Bô, Nam Từ Liêm, Hà Nội.</p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">FANPAGE</h5>
            <img
              src="images/f1.jpg"
              alt="Fanpage"
              className="img-fluid mt-1"
              style={{ maxWidth: "70%" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
