import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''

const medals = ["🥇", "🥈", "🥉"];

// Mesmo critério do Ranking: maior valor primeiro, desempate por menos cotas
const byStat = (key) => (a, b) => b[key] - a[key] || a.cotas - b.cotas;

// Mesmas listas da página de Ranking; "source" define de onde vêm os jogadores
const tabs = [
  { key: "rkg_jog", label: "Rkg Jog.", title: "Ranking jogadores", source: "jog", stat: "pontos", unit: "pontos" },
  { key: "rkg_gol", label: "Rkg Gol.", title: "Ranking goleiros", source: "gol", stat: "pontos", unit: "pontos" },
  { key: "tit_jog", label: "🏆 Jog.", title: "Títulos jogadores", source: "jog", stat: "primeiro", unit: "títulos" },
  { key: "tit_gol", label: "🏆 Gol.", title: "Títulos goleiros", source: "gol", stat: "primeiro", unit: "títulos" },
  { key: "gols", label: "Artilharia", title: "Artilharia", source: "all", stat: "gols", unit: "gols" },
  { key: "ass", label: "Assistências", title: "Assistências", source: "all", stat: "ass", unit: "assistências" },
];

const TopPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [keepers, setKeepers] = useState([]);
  const [active, setActive] = useState(tabs[0].key);
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

  const everyone = players.concat(keepers);
  const tab = tabs.find((t) => t.key === active);
  const pool = { jog: players, gol: keepers, all: everyone }[tab.source];
  const podium = [...pool].sort(byStat(tab.stat)).slice(0, 3);
  const topScorer = [...everyone].sort(byStat("gols"))[0];
  const topAssist = [...everyone].sort(byStat("ass"))[0];

  // Ordem visual do pódio: 2º, 1º, 3º
  const order = [1, 0, 2].filter((i) => podium[i]);

  return (
    <>
      <section className="home-section">
        <h2 className="section-title">Top 3 · {tab.title}</h2>
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={t.key === active}
              className={t.key === active ? "tab active" : "tab"}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {podium.length === 0 && <p className="empty-note">Sem dados para esta lista.</p>}
        <div className="podium">
          {order.map((i) => (
            <div key={`${tab.key}-${podium[i].id ?? i}`} className={`card podium-item p${i + 1}`}>
              <div className="podium-medal">{medals[i]}</div>
              <div className="podium-name">{podium[i].nome}</div>
              <div className="podium-points">{podium[i][tab.stat]}</div>
              <div className="podium-sub">{tab.unit} · {podium[i].cotas} cotas</div>
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
