import React from "react";
import Carousel from "./Carousel";
import { FaInstagram, FaYoutube, FaFilePdf } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
      <Carousel />
      <div className="social-icons">
        <a href="https://www.instagram.com/rachaverde" aria-label="Instagram">
          <FaInstagram size={20} />
        </a>
        <a href="https://www.youtube.com/@rachaverde" aria-label="YouTube">
          <FaYoutube size={20} />
        </a>
        <a aria-label="Documento (PDF)" href="https://docs.google.com/document/d/1JjXGGsJPU9vrEe-mI8H0DolknaC7la1FK-DyswdhaPY/edit?tab=t.0">
          <FaFilePdf size={20} />
        </a>
      </div>
      <p className="footer-text">
        © 2026  Racha Verde. Sempre a maior diversão.
      </p>
      </div>
    </footer>
  );
};

export default Footer;
