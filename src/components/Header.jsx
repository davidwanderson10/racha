import React from "react";
import { NavLink } from "react-router-dom";
import "../../src/styles.css";
import logo from "../assets/logo.png";


const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="nav">
        <NavLink to="/" className="nav-link" activeclassname="active-link" >Home</NavLink>
        <NavLink to="/rodadas" className="nav-link" activeclassname="active-link">Rodadas</NavLink>
        <NavLink to="/ranking" className="nav-link" activeclassname="active-link">Ranking</NavLink>
      </nav>
    </header>
  );
};

export default Header;
