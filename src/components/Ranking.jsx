import React, { useState, useEffect } from "react";
import { FaFileExcel, FaPlus, FaPen } from "react-icons/fa";
import * as XLSX from 'xlsx';
import Podium from "./Podium";
import amarelo from "../assets/amarelo.png";
import vermelho from "../assets/verm.png";
const url = import.meta.env.VITE_API_URL || ''

const cardImg = (src, alt) => <img src={src} alt={alt} style={{ width: 15, height: 20 }} />;
const media = (num) => (row) => (row[num] / row.cotas).toFixed(2);

// Colunas disponíveis (mesmos campos exibidos na tabela anterior)
const col = {
  pontos: { label: "P", title: "Pontos", get: (r) => r.pontos },
  cotas: { label: "C", title: "Cotas", get: (r) => r.cotas },
  jogos: { label: "J", title: "Jogos", get: (r) => r.jogos },
  vitorias: { label: "V", title: "Vitórias", get: (r) => r.vitorias },
  empates: { label: "E", title: "Empates", get: (r) => r.empates },
  derrotas: { label: "D", title: "Derrotas", get: (r) => r.derrotas },
  gols_pro: { label: "GP", title: "Gols pró", get: (r) => r.gols_pro },
  gols_contra: { label: "GC", title: "Gols contra", get: (r) => r.gols_contra },
  saldo: { label: "SG", title: "Saldo de gols", get: (r) => r.gols_pro - r.gols_contra },
  primeiro: { label: "🏆", title: "Títulos (1º)", get: (r) => r.primeiro },
  segundo: { label: "2º", title: "2º lugar", get: (r) => r.segundo },
  terceiro: { label: "3º", title: "3º lugar", get: (r) => r.terceiro },
  quarto: { label: "4º", title: "4º lugar", get: (r) => r.quarto },
  amarelo: { label: cardImg(amarelo, "amarelo"), title: "Cartões amarelos", get: (r) => r.amarelo },
  vermelho: { label: cardImg(vermelho, "vermelho"), title: "Cartões vermelhos", get: (r) => r.vermelho },
  gols: { label: "Gols", title: "Gols", get: (r) => r.gols },
  ass: { label: "Assistências", title: "Assistências", get: (r) => r.ass },
  mediaG: { label: "Média", title: "Gols por cota", get: media("gols") },
  mediaA: { label: "Média", title: "Assistências por cota", get: media("ass") },
  mediaT: { label: "Média", title: "Títulos por cota", get: media("primeiro") },
};

const fullTable = ["pontos", "cotas", "jogos", "vitorias", "empates", "derrotas", "gols_pro", "gols_contra", "saldo",
  "primeiro", "segundo", "terceiro", "quarto", "amarelo", "vermelho"];

// Mesmas listas de antes; "source" diz de onde vêm os jogadores, "stat" é o critério principal
const tabs = [
  { key: "ranking", label: "RKG JOG.", source: "jog", stat: "pontos", unit: "pontos", columns: fullTable },
  { key: "goleiros", label: "RKG GOL.", source: "gol", stat: "pontos", unit: "pontos", columns: fullTable },
  { key: "campeao_jog", label: "🏆 JOG.", source: "jog", stat: "primeiro", unit: "títulos", columns: ["primeiro", "cotas", "mediaT"] },
  { key: "campeao_gol", label: "🏆 GOL.", source: "gol", stat: "primeiro", unit: "títulos", columns: ["primeiro", "cotas", "mediaT"] },
  { key: "gols", label: "Artilharia", source: "all", stat: "gols", unit: "gols", columns: ["gols", "cotas", "mediaG"] },
  { key: "ass", label: "Assistências", source: "all", stat: "ass", unit: "assistências", columns: ["ass", "cotas", "mediaA"] },
];

// Desempate sempre por menos cotas
const sortBy = (stat) => (a, b) => b[stat] - a[stat] || a.cotas - b.cotas;
const posIcon = (i) => ["🥇", "🥈", "🥉"][i] || i + 1;

const Tables = () => {
  const [dataJog, setDataJog] = useState([]);
  const [dataGol, setDataGol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(tabs[0].key);
  const [editing, setEditing] = useState(false);
  const [textValue, setTextValue] = useState('');

  const fetchData = async () => {
    try {
      const headers = { "Content-Type": "application/json" };
      const response = await fetch(url + 'player', { method: "GET", headers });
      const responseGol = await fetch(url + 'player-gol', { method: "GET", headers });
      if (!response.ok || !responseGol.ok) {
        throw new Error("Erro ao buscar os dados.");
      }
      setDataJog(await response.json());
      setDataGol(await responseGol.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const newPlayer = async () => {
    const nome = prompt('Digite o nome do Jogador: ')
    const codigo = prompt('Digite o código verde: ')
    if (nome && codigo) {
      try {
        const response = await fetch(url + 'player', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "key": codigo
          },
          body: JSON.stringify({ nome: nome.toUpperCase() })
        })
        const data = await response.json()
        alert(data.message)
        if (response.status === 201) await fetchData()
      } catch (err) {
        setError(err.message);
      }
    }
  }

  const updatePlayer = (id) => {
    const player = dataJog.concat(dataGol).find((p) => p.id == id);
    setTextValue(JSON.stringify(player, null, 2));
    setEditing(true);
  }

  const saveUpdate = async () => {
    let body;
    try {
      body = JSON.parse(textValue)
    } catch {
      alert("JSON inválido. Revise os dados.");
      return;
    }

    const bodyUpdate = {
      nome: body.nome,
      pontos: body.pontos,
      cotas: body.cotas,
      jogos: body.jogos,
      vitorias: body.vitorias,
      empates: body.empates,
      derrotas: body.derrotas,
      gols_pro: body.gols_pro,
      gols_contra: body.gols_contra,
      primeiro: body.primeiro,
      segundo: body.segundo,
      terceiro: body.terceiro,
      quarto: body.quarto,
      amarelo: body.amarelo,
      vermelho: body.vermelho,
      gols: body.gols,
      ass: body.ass
    }

    const codigo = prompt('Digite o código verde: ')
    try {
      const response = await fetch(url + 'player/' + body.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "key": codigo
        },
        body: JSON.stringify(bodyUpdate)
      });
      await response.json();
      alert(response.status === 200 ? "Atualizado com sucesso!" : "Erro ao atualizar.");
      await fetchData()
    } catch (err) {
      setError(err.message);
    } finally {
      setEditing(false)
    }
  }

  const downloadExcel = () => {
    const data = [...dataJog, ...dataGol];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planilha1");
    XLSX.writeFile(wb, "ranking.xlsx");
  };

  if (loading) return <div className="skeleton" style={{ height: 320, margin: "24px 0" }} />;
  if (error) return <p className="empty-note">Erro: {error}</p>;

  const tab = tabs.find((t) => t.key === active);
  const pool = { jog: dataJog, gol: dataGol, all: dataJog.concat(dataGol) }[tab.source];
  const rows = [...pool].sort(sortBy(tab.stat));
  const columns = tab.columns.map((k) => ({ key: k, ...col[k] }));
  const main = columns.find((c) => c.key === tab.stat) || columns[0];
  const details = columns.filter((c) => c.key !== main.key);

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Ranking</h1>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={newPlayer}><FaPlus /> Novo jogador</button>
          <button className="btn" onClick={downloadExcel}><FaFileExcel /> Exportar Excel</button>
        </div>
      </div>

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

      <Podium items={rows} stat={tab.stat} unit={tab.unit} tabKey={tab.key} />

      {/* Desktop: tabela completa */}
      <div className="card table-wrap rk-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Jogador</th>
              {columns.map((c) => <th key={c.key} title={c.title}>{c.label}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i}>
                <td className="pos">{posIcon(i)}</td>
                <td className="name">{row.nome}</td>
                {columns.map((c) => <td key={c.key}>{c.get(row)}</td>)}
                <td><button className="icon-btn" onClick={() => updatePlayer(row.id)} aria-label={`Editar ${row.nome}`}><FaPen /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Celular: cards com detalhes expansíveis */}
      <div className="rk-cards">
        {rows.map((row, i) => (
          <details key={row.id ?? i} className="card rk-card">
            <summary>
              <span className="pos">{posIcon(i)}</span>
              <span className="name">{row.nome}</span>
              <span className="main">{main.get(row)}<small>{main.title}</small></span>
            </summary>
            {details.length > 0 && (
              <div className="rk-details">
                {details.map((c) => (
                  <div key={c.key}><span>{c.title}</span><b>{c.get(row)}</b></div>
                ))}
              </div>
            )}
            <button className="btn btn-ghost rk-edit" onClick={() => updatePlayer(row.id)}><FaPen /> Editar</button>
          </details>
        ))}
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(false)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="section-title">Editar jogador</h2>
            <textarea className="modal-text" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Voltar</button>
              <button className="btn" onClick={saveUpdate}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
