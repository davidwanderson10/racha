import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rodadas from "./pages/Rodadas";
import Ranking from "./pages/Ranking";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.css";

const App = () => {
  return (
    <div className="app" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rodadas" element={<Rodadas />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
