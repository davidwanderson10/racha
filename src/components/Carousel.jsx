import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import patrocinio1 from "../assets/patrocinio1.png";
import patrocinio2 from "../assets/patrocinio2.png";
import patrocinio3 from "../assets/patrocinio3.png";
import patrocinio4 from "../assets/patrocinio4.png";
import patrocinio5 from "../assets/patrocinio5.png";
import patrocinio6 from "../assets/patrocinio6.png";
import patrocinio7 from "../assets/patrocinio7.png";
import patrocinio8 from "../assets/patrocinio8.png";
import patrocinio9 from "../assets/patrocinio9.png";
import patrocinio10 from "../assets/patrocinio10.png";
import patrocinio11 from "../assets/patrocinio11.png";
import patrocinio12 from "../assets/patrocinio12.png";
import patrocinio13 from "../assets/patrocinio13.png";
import patrocinio14 from "../assets/patrocinio14.png";


const Carousels = () => {

  const settings = {
    dots: true, // Exibe os pontos abaixo do carrossel
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 3, // Quantidade de logos visíveis
    slidesToScroll: 1, // Quantos slides mover ao clicar
    nextArrow: <SampleNextArrow />, // Personalizar seta para próximo
    prevArrow: <SamplePrevArrow />, // Personalizar seta para anterior
  };

const logosInput = [
    { id: 1, src: patrocinio1, alt: "Logo 1", link: "https://www.instagram.com/jnpneusprime" },
    { id: 2, src: patrocinio2, alt: "Logo 2", link: "https://www.instagram.com/regilabenigno" },
    { id: 3, src: patrocinio3, alt: "Logo 3", link: "https://www.instagram.com/nogueirasexecutive" },
    { id: 4, src: patrocinio4, alt: "Logo 4", link: "https://www.instagram.com/gustavosimaofotografo" },
    { id: 5, src: patrocinio5, alt: "Logo 5", link: "https://www.instagram.com/kiacai.heroisdoacre" },
    { id: 6, src: patrocinio6, alt: "Logo 6", link: "https://www.instagram.com/greenvidros" },
    { id: 7, src: patrocinio7, alt: "Logo 7", link: "https://www.instagram.com/rolforiginal"},
    { id: 8, src: patrocinio8, alt: "Logo 8", link: "https://www.wa.link/zn34pk"},
    { id: 9, src: patrocinio9, alt: "Logo 9", link: "https://www.instagram.com/vibratomotos"},
    { id: 10, src: patrocinio10, alt: "Logo 10", link: "https://www.instagram.com/svoiceoficial"},
    { id: 11, src: patrocinio11, alt: "Logo 11", link: "https://www.instagram.com/schatoficial"},
    { id: 12, src: patrocinio12, alt: "Logo 12", link: "https://www.instagram.com/use.smartwatch"},
    { id: 13, src: patrocinio13, alt: "Logo 13", link: "https://www.instagram.com/jonathanvieira.ads"},
    { id: 14, src: patrocinio14, alt: "Logo 14", link: "https://www.instagram.com/arenamesafarta"}
  ];


    let logos = logosInput.reduce(([a,b])=>
    (b.push(...a.splice(Math.random()*a.length|0, 1)), [a,b]),[[...logosInput],[]])[1]



  return (
    <div className='div-carousel'>
        <p>Patrocinadores:</p>
      <Slider {...settings}>
        {logos.map((logo) => (
          <div className='carousel-img' key={logo.id}>
            <a href={logo.link} target="_blank" rel="noopener noreferrer">
              <img
                src={logo.src}
                alt={logo.alt}
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
