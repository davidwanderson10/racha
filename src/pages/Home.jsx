import React from "react";
import { Link } from "react-router-dom";
import Metrics from "../components/Metrics";
import TopPlayers from "../components/TopPlayers";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <h1>Racha Verde</h1>
          <p>Sempre a maior diversão.</p>
          <div className="hero-actions">
            <Link to="/ranking" className="btn">Ver ranking</Link>
            <Link to="/rodadas" className="btn btn-ghost">Ver rodadas</Link>
          </div>
        </div>
        <img className="hero-logo" src={logo} alt="" />
      </section>

      <Metrics />
      <TopPlayers />
    </div>
  );
};

export default Home;
