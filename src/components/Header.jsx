import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFutbol, FaTrophy, FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useTheme } from "../hooks";

const links = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/rodadas", label: "Rodadas", icon: <FaFutbol /> },
  { to: "/ranking", label: "Ranking", icon: <FaTrophy /> },
];

const Header = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          <img src={logo} alt="Racha Verde" />
          <span>Racha Verde</span>
        </NavLink>
        <nav className="nav">
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema claro/escuro" title="Alternar tema">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
