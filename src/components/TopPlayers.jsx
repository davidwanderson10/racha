import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''

const medals = ["🥇", "🥈", "🥉"];

// Mesmo critério do Ranking: mais pontos primeiro, desempate por menos cotas
const byPoints = (a, b) => b.pontos - a.pontos || a.cotas - b.cotas;
const byStat = (key) => (a, b) => b[key] - a[key] || a.cotas - b.cotas;

const TopPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [keepers, setKeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        const [resP, resG] = await Promise.all([
          fetch(url + "player", { method: "GET", headers }),
          fetch(url + "player-gol", { method: "GET", headers }),
        ]);
        if (!resP.ok || !resG.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        setPlayers(await resP.json());
        setKeepers(await resG.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return null;

  if (loading) {
    return <div className="skeleton" style={{ height: 180, marginTop: 38 }} />;
  }

  const podium = [...players].sort(byPoints).slice(0, 3);
  const everyone = players.concat(keepers);
  const topScorer = [...everyone].sort(byStat("gols"))[0];
  const topAssist = [...everyone].sort(byStat("ass"))[0];

  // Ordem visual do pódio: 2º, 1º, 3º
  const order = [1, 0, 2].filter((i) => podium[i]);

  return (
    <>
      <section className="home-section">
        <h2 className="section-title">Top 3 do Ranking</h2>
        <div className="podium">
          {order.map((i) => (
            <div key={podium[i].id ?? i} className={`card podium-item p${i + 1}`}>
              <div className="podium-medal">{medals[i]}</div>
              <div className="podium-name">{podium[i].nome}</div>
              <div className="podium-points">{podium[i].pontos}</div>
              <div className="podium-sub">pontos · {podium[i].cotas} cotas</div>
            </div>
          ))}
        </div>
      </section>

      {topScorer && topAssist && (
        <div className="highlights">
          <div className="card highlight">
            <span className="highlight-icon">⚽</span>
            <div>
              <div className="highlight-label">Artilheiro</div>
              <div className="highlight-name">{topScorer.nome}</div>
            </div>
            <span className="highlight-value">{topScorer.gols}</span>
          </div>
          <div className="card highlight">
            <span className="highlight-icon">🅰️</span>
            <div>
              <div className="highlight-label">Líder de assistências</div>
              <div className="highlight-name">{topAssist.nome}</div>
            </div>
            <span className="highlight-value">{topAssist.ass}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TopPlayers;
