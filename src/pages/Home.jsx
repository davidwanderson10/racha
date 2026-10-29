import React from "react";
import { Link } from "react-router-dom";
import Metrics from "../components/Metrics";
import TopPlayers from "../components/TopPlayers";
import Carousel from "../components/Carousel";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">Palmeirenses toda semana</span>
          <h1>Racha Verde</h1>
          <p>Gols, assistências, rodadas e o ranking de quem manda no gramado. Tudo em um só lugar.</p>
          <div className="hero-actions">
            <Link to="/ranking" className="btn">Ver ranking</Link>
            <Link to="/rodadas" className="btn btn-ghost">Ver rodadas</Link>
          </div>
        </div>
        <img className="hero-logo" src={logo} alt="" />
      </section>

      <Metrics />
      <TopPlayers />
      <Carousel />
    </div>
  );
};

export default Home;
