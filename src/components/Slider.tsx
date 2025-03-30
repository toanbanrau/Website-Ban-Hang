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

  const slides = [
    {
      id: 1,
      src: "https://tse1.mm.bing.net/th?id=OIP.2ZjEEB6TGRkKdVYheBw8HQHaEo&pid=Api&P=0&h=220",
      alt: "Slide 1",
    },
    {
      id: 2,
      src: "https://tse4.mm.bing.net/th?id=OIP.77nLZT5NFdQorrs5CZvzrQHaDe&pid=Api&P=0&h=220",
      alt: "Slide 2",
    },
    {
      id: 3,
      src: "https://tse2.mm.bing.net/th?id=OIP.onzVGdQVNX1d5h3CTcc7PwHaDO&pid=Api&P=0&h=220",
      alt: "Slide 3",
    },
    {
      id: 4,
      src: "https://tse4.mm.bing.net/th?id=OIP.Dy66CbtP7rb3oYDBhOpwEQHaEK&pid=Api&P=0&h=220",
      alt: "Slide 4",
    },
  ];

  return (
    <Slider {...settings}>
      {slides.map((slide) => (
        <div key={slide.id}>
          <img
            src={slide.src}
            alt={slide.alt}
            style={{
              height: "300px", // Chiều cao 50% viewport
              width: "100%", // Chiều rộng 80% slider
              // Giữ nguyên tỷ lệ hình ảnh
              margin: "0 auto", // Căn giữa hình ảnh
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default MySlider;
