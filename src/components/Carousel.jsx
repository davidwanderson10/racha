import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import patrocicio1 from "../assets/apoio1.png";
import patrocicio2 from "../assets/apoio2.png";
import patrocicio3 from "../assets/apoio3.png";
import patrocicio4 from "../assets/apoio4.png";
import patrocicio5 from "../assets/apoio5.png";
import patrocicio6 from "../assets/apoio6.png";
import patrocicio7 from "../assets/apoio7.png";
import patrocicio8 from "../assets/apoio8.png";
import patrocicio9 from "../assets/apoio9.png";
import patrocicio10 from "../assets/apoio10.png";
import patrocicio11 from "../assets/apoio11.png";
import patrocicio12 from "../assets/apoio12.png";


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
    { id: 1, src: patrocicio1, alt: "Logo 1", link: "https://www.instagram.com/yessodonto" },
    { id: 2, src: patrocicio2, alt: "Logo 2", link: "https://www.instagram.com/regilabenigno" },
    { id: 3, src: patrocicio3, alt: "Logo 3", link: "https://www.instagram.com/nogueirasexecutive" },
    { id: 4, src: patrocicio4, alt: "Logo 4", link: "https://www.instagram.com/gustavosimaofotografo" },
    { id: 5, src: patrocicio5, alt: "Logo 5", link: "https://www.instagram.com/yessacai" },
    { id: 6, src: patrocicio6, alt: "Logo 6", link: "https://www.instagram.com/greenvidros" },
    { id: 7, src: patrocicio7, alt: "Logo 7", link: "https://www.instagram.com/clinicapsicmed"},
    { id: 8, src: patrocicio8, alt: "Logo 8", link: "https://www.instagram.com/_jmcarestetica"},
    { id: 9, src: patrocicio9, alt: "Logo 9", link: "https://www.instagram.com/vibratomotos"},
    { id: 10, src: patrocicio10, alt: "Logo 10", link: "https://www.instagram.com/svoiceoficial"},
    { id: 11, src: patrocicio11, alt: "Logo 11", link: "https://www.instagram.com/schatoficial"},
    { id: 12, src: patrocicio12, alt: "Logo 12", link: "https://www.instagram.com/use.smartwatch"}
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
