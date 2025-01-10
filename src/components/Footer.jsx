import React from "react";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
import "../../src/styles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href="https://www.youtube.com/@rachaverde">
          <FaInstagram size={30} href="https://www.youtube.com/@rachaverde"/>
        </a>
        <a href="https://www.instagram.com/rachaverde">
          <FaYoutube size={30} />
        </a>
      </div>
      <p className="footer-text">
        © 2025  Racha Verde. Sempre a maior diversão.
      </p>
    </footer>
  );
};

export default Footer;
