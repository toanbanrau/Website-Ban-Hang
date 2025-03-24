import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.2ZjEEB6TGRkKdVYheBw8HQHaEo&pid=Api&P=0&h=220"
          alt="Slide 1"
          style={{ height: "100vh", width: "100%" }}
        />
      </div>
      <div>
        <img
          src="https://tse4.mm.bing.net/th?id=OIP.77nLZT5NFdQorrs5CZvzrQHaDe&pid=Api&P=0&h=220"
          alt="Slide 2"
          style={{ height: "100vh", objectFit: "cover" }}
        />
      </div>
      <div>
        <img
          src="https://tse2.mm.bing.net/th?id=OIP.onzVGdQVNX1d5h3CTcc7PwHaDO&pid=Api&P=0&h=220"
          alt="Slide 3"
          style={{ height: "100vh", objectFit: "cover" }}
        />
      </div>
      <div>
        <img
          src="https://tse4.mm.bing.net/th?id=OIP.Dy66CbtP7rb3oYDBhOpwEQHaEK&pid=Api&P=0&h=220"
          alt="Slide 4"
          style={{ height: "100vh", width: "100%" }}
        />
      </div>
    </Slider>
  );
};

export default MySlider;
