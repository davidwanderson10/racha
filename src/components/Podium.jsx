import React from "react";

const medals = ["🥇", "🥈", "🥉"];

// items: jogadores já ordenados; mostra os 3 primeiros em ordem visual 2º, 1º, 3º
const Podium = ({ items, stat, unit, tabKey }) => {
  const top = items.slice(0, 3);
  const order = [1, 0, 2].filter((i) => top[i]);

  if (top.length === 0) return <p className="empty-note">Sem dados para esta lista.</p>;

  return (
    <div className="podium">
      {order.map((i) => (
        <div key={`${tabKey}-${top[i].id ?? i}`} className={`card podium-item p${i + 1}`}>
          <div className="podium-medal">{medals[i]}</div>
          <div className="podium-name">{top[i].nome}</div>
          <div className="podium-points">{top[i][stat]}</div>
          <div className="podium-sub">{unit} · {top[i].cotas} cotas</div>
        </div>
      ))}
    </div>
  );
};

export default Podium;
