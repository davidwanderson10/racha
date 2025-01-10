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
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Home
        </NavLink>
        <NavLink
          to="/rodadas"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Rodadas
        </NavLink>
        <NavLink
          to="/ranking"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Ranking
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
