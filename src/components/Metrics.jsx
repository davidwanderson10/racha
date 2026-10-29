import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''

const Metrics = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + "rounds-metrics", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        setData(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="empty-note">Erro: {error}</p>;

  const metrics = [
    { label: "RODADAS", value: data.rodadas },
    { label: "JOGOS", value: data.jogos },
    { label: "GOLS", value: data.gols },
    { label: "ASSISTÊNCIAS", value: data.assistencias },
  ];

  return (
    <section className="metrics">
      {metrics.map((metric) => (
        <div key={metric.label} className="card metric-card">
          {loading ? (
            <div className="skeleton" style={{ height: 52 }} />
          ) : (
            <p className="metric-value">{metric.value}</p>
          )}
          <p className="metric-label">{metric.label}</p>
        </div>
      ))}
    </section>
  );
};

export default Metrics;
