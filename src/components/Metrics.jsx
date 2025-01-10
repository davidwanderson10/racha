import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''
import "../../src/styles.css";

const Metrics = () => {

  // Estado para armazenar os dados da tabela
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url + "rounds-metrics", {
            method: "GET", // O método HTTP
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (!response.ok) {
            throw new Error("Erro ao buscar os dados.");
          }
          const result = await response.json();
          console.log(result);
          setData(result); // Atualiza o estado com os dados da API
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); // O array vazio faz com que a requisição seja feita apenas uma vez ao montar o componente
  
    if (error) return <p>Erro: {error}</p>;


  const metrics = [
    { label: "RODADAS", value: data.rodadas },
    { label: "JOGOS", value: data.jogos },
    { label: "GOLS", value: data.gols },
    { label: "ASSISTÊNCIAS", value: data.assistencias },
  ];

  return (
    <div className="metrics-div">
      <section className="metrics">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h2 className="metric-label">{loading ? "Carregando..." : metric.label}</h2>
            <h2 className="metric-value">{loading ? " " : metric.value}</h2>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Metrics;
