import React from "react";
import { FaInstagram, FaYoutube, FaFilePdf } from "react-icons/fa";
import "../../src/styles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href="https://www.instagram.com/rachaverde">
          <FaInstagram size={30} />
        </a>
        <a href="https://www.youtube.com/@rachaverde">
          <FaYoutube size={30} />
        </a>
        <a href="https://docs.google.com/document/d/1JjXGGsJPU9vrEe-mI8H0DolknaC7la1FK-DyswdhaPY/edit?tab=t.0">
          <FaFilePdf size={30} />
        </a>
      </div>
      <p className="footer-text">
        © 2026  Racha Verde. Sempre a maior diversão.
      </p>
    </footer>
  );
};

export default Footer;
