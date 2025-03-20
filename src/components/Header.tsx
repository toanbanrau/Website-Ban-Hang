
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
    return (
        <div className='container'>
            <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex flex-column">
                    <h1 className="fw-bold" style={{ color: "#008000", lineHeight: "1" }}>
                        MARBLE <br /> FEET
                    </h1>
                </div>
                <nav className="d-flex align-items-center">
                    <ul className="nav">
                        <li className="nav-item"><a href="#" className="nav-link text-dark">TRANG CHỦ</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">NIKE</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">ADIDAS</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">JORDAN</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">YEEZY</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">OTHER BRANDS</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">SALE</a></li>
                        <li className="nav-item"><a href="#" className="nav-link text-dark">DÂY GIÀY</a></li>
                    </ul>


                    <ul className="nav ms-3">
                        <li className="nav-item">
                            <a href="#" className="nav-link text-dark"><FaSearch size={20} /></a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link text-dark"><FaUser size={20} /></a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link text-dark"><FaShoppingCart size={20} /></a>
                        </li>
                    </ul>
                </nav>

            </header>


            <div className="container my-4">
                <img src="images/baner.jpg" width={"70%"} className="img-fluid w-100" alt="Sale Banner" />
            </div>


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

        </div>
    )
}

export default Header