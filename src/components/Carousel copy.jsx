import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import patrocicio1 from "../assets/patrocinio1.png";
import patrocicio2 from "../assets/patrocinio2.png";
import patrocicio3 from "../assets/patrocinio3.png";
import patrocicio4 from "../assets/patrocinio4.png";
import patrocicio5 from "../assets/patrocinio5.png";
import patrocicio6 from "../assets/patrocinio6.png";
import patrocicio7 from "../assets/patrocinio7.png";


const Carousels = () => {
  const settings = {
    dots: true, // Exibe os pontos abaixo do carrossel
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 4, // Quantidade de logos visíveis
    slidesToScroll: 1, // Quantos slides mover ao clicar
    nextArrow: <SampleNextArrow />, // Personalizar seta para próximo
    prevArrow: <SamplePrevArrow />, // Personalizar seta para anterior
  };

  const logosInput = [
    { id: 1, src: {patrocicio1}, alt: "Logo 1", link: "https://www.instagram.com/yessacai" },
    { id: 2, src: {patrocicio2}, alt: "Logo 2", link: "https://www.instagram.com/yessodonto" },
    { id: 3, src: {patrocicio3}, alt: "Logo 3", link: "https://www.instagram.com/regilabenigno" },
    { id: 4, src: {patrocicio4}, alt: "Logo 4", link: "https://www.instagram.com/clinicapsicmed" },
    { id: 5, src: {patrocicio5}, alt: "Logo 5", link: "https://www.instagram.com/nogueirasexecutive" },
    { id: 6, src: {patrocicio6}, alt: "Logo 6", link: "https://www.instagram.com/greenvidros" },
    { id: 7, src: {patrocicio7}, alt: "Logo 7", link: "https://www.instagram.com/gustavosimaofotografo" }
  ];

    let logos = logosInput.reduce(([a,b])=>
    (b.push(...a.splice(Math.random()*a.length|0, 1)), [a,b]),[[...logosInput],[]])[1]



  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Slider {...settings}>
        {logos.map((logo) => (
          <div key={logo.id} style={{ padding: "10px", textAlign: "center" }}>
            <a href={logo.link} target="_blank" rel="noopener noreferrer">
              <img
                src={logo.src}
                alt={logo.alt}
                style={{ width: "100%", height: "auto", maxHeight: "100px" }}
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Personalizando seta "Próximo"
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

// Personalizando seta "Anterior"
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

export default Carousels;
