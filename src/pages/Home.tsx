import MySlider from "../components/Slider";
import "../assets/styles/Home.css";
import Brands from "../components/Brands";
import PromoBanner from "../components/PromoBanner";
import ShoeStore from "../components/ShoeStore";
const Home = () => {
  return (
    <div className="container">
      <MySlider></MySlider>
      <ShoeStore></ShoeStore>
      <Brands></Brands>
      <PromoBanner></PromoBanner>
    </div>
  );
};

export default Home;
