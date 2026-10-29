import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''
import amarelo from "../assets/amarelo.png";
import vermelho from "../assets/verm.png";
import * as XLSX from 'xlsx';
import { FaPlus, FaFileExcel, FaPen, FaTimes } from "react-icons/fa";


// import vermelho from "../assets/vermelho.png";

const Tables = () => {
  // Estado para armazenar os dados da tabela
  const [data, setData] = useState([]);
  const [dataPlayer, setDataPlayer] = useState([]);
  const [dataGol, setDataGol] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState('');
  const [view, setView] = useState('cards');
  // Dados para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [roundData, setRoundData] = useState({
    rodada: "",
    data: "",
    totalGols: 0,
    totalAssistencias: 0,
    totalAmarelos: 0,
    totalVermelhos: 0,
    times: [
      { nome: "TIME 1", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 2", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 3", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 4", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
    ],
    confrontos: [{ timeA: "TIME 1", timeB: "TIME 2", golsA: 0, golsB: 0 },
                  {timeA: "TIME 3", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 1", timeB: "TIME 3", golsA: 0, golsB: 0 },
                  {timeA: "TIME 2", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 1", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 2", timeB: "TIME 3", golsA: 0, golsB: 0 },
                  {timeA: "", timeB: "", golsA: 0, golsB: 0 },
                  {timeA: "", timeB: "", golsA: 0, golsB: 0 }],
    artilheiros: {nomes: "", gols: 0},
    assistentes: {nomes: "", assistencias: 0},
    melhorGoleiro: {nomes: "", gols: 0},
    classificacao: []
  });

  const resetData = {
    rodada: "",
    data: "",
    totalGols: 0,
    totalAssistencias: 0,
    totalAmarelos: 0,
    totalVermelhos: 0,
    times: [
      { nome: "TIME 1", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 2", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 3", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 4", classificacao: '', jogadores: Array.from({ length: 9 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
    ],
    confrontos: [{ timeA: "TIME 1", timeB: "TIME 2", golsA: 0, golsB: 0 },
                  {timeA: "TIME 3", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 1", timeB: "TIME 3", golsA: 0, golsB: 0 },
                  {timeA: "TIME 2", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 1", timeB: "TIME 4", golsA: 0, golsB: 0 },
                  {timeA: "TIME 2", timeB: "TIME 3", golsA: 0, golsB: 0 },
                  {timeA: "", timeB: "", golsA: 0, golsB: 0 },
                  {timeA: "", timeB: "", golsA: 0, golsB: 0 }],
    artilheiros: {nomes: "", gols: 0},
    assistentes: {nomes: "", assistencias: 0},
    melhorGoleiro: {nomes: "", gols: 0},
    classificacao: []
  }
  
  // Função para buscar os dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + 'rounds', {
          method: "GET", // O método HTTP
          headers: {
            "Content-Type": "application/json",
          }
        });

        const responsePlayer = await fetch(url + 'player', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "order": "nome"
          },
        });

        const responseGol = await fetch(url + 'player-gol', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "order": "nome"
          },
        });


        if (!response.ok || !responsePlayer.ok || !responseGol.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        const result = await response.json();
        const resultPlayer = await responsePlayer.json();
        const resultGol = await responseGol.json();

        setData(result); 
        setDataPlayer(resultPlayer); 
        setDataGol(resultGol); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio faz com que a requisição seja feita apenas uma vez ao montar o componente


  if (loading) return <div className="skeleton" style={{ height: 320, margin: "24px 0" }} />;
  if (error) return <p className="empty-note">Erro: {error}</p>;


  const handleInputChange = (e, timeIndex, jogadorIndex, campo) => {
    const value = campo === 'nome' ? e.target.value : Number(e.target.value);
    const updatedTimes = [...roundData.times];
    updatedTimes[timeIndex].jogadores[jogadorIndex][campo] = value;
    setRoundData({ ...roundData, times: updatedTimes });
  };


  const handleClassificacaoChange = (timeNome, classificacao) => {
    setRoundData((prevState) => {
      // Atualizar classificação dos times
      const updatedTimes = prevState.times.map((time) => {
        // Remover classificação anterior
        if (time.classificacao === classificacao) {
          return { ...time, classificacao: "" };
        }
        // Adicionar nova classificação
        if (time.nome === timeNome) {
          return { ...time, classificacao };
        }
        return time;
      });
  
      return { ...prevState, times: updatedTimes };
    });
  };

  // FUNÇÃO PARA CALCULAR OS RESULTADOS DOS CONFRONTOS:
  const calcularEstatisticas = async (confrontos) => {
    const estatisticas = {};

  // Inicializar estatísticas para cada time
  confrontos.forEach(({ timeA, timeB }) => {
    if (!estatisticas[timeA]) {
      estatisticas[timeA] = { v: 0, e: 0, d: 0, gp: 0, gc: 0 };
    }
    if (!estatisticas[timeB]) {
      estatisticas[timeB] = { v: 0, e: 0, d: 0, gp: 0, gc: 0 };
    }
  });

  // Calcular estatísticas para cada confronto
  confrontos.forEach(({ timeA, timeB, golsA, golsB }) => {
    // Atualizar gols pró
    estatisticas[timeA].gp += golsA;
    estatisticas[timeB].gp += golsB;
    
    // Atualizar gols contra
    estatisticas[timeA].gc += golsB;
    estatisticas[timeB].gc += golsA;

    if (golsA > golsB) {
      // Time A venceu
      estatisticas[timeA].v += 1;
      estatisticas[timeB].d += 1;
    } else if (golsA < golsB) {
      // Time B venceu
      estatisticas[timeB].v += 1;
      estatisticas[timeA].d += 1;
    } else {
      // Empate
      estatisticas[timeA].e += 1;
      estatisticas[timeB].e += 1;
    }
  });

  // Atualizar o estado com as novas estatísticas e classificação
  setRoundData((prevData) => {
    // Atualizar times sem mudar a ordem
    const updatedTimes = prevData.times.map((time) => {
      const timeStats = estatisticas[time.nome] || { v: 0, e: 0, d: 0, gp: 0, gc: 0 };

      // Determinar os valores de p, s, t, q com base na classificação do time
      let p = 0,
        s = 0,
        t = 0,
        q = 0;

      if (time.classificacao === "Campeão") {
        p = 1;
      } else if (time.classificacao === "Vice") {
        s = 1;
      } else if (time.classificacao === "Terceiro") {
        t = 1;
      } else if (time.classificacao === "Quarto") {
        q = 1;
      }

      // Atualizar os jogadores do time com as estatísticas e classificação
      const updatedJogadores = time.jogadores.map((jogador) => ({
        ...jogador,
        v: timeStats.v,
        e: timeStats.e,
        d: timeStats.d,
        gp: timeStats.gp,
        gc: timeStats.gc,
        p,
        s,
        t,
        q,
      }));

      return {
        ...time,
        jogadores: updatedJogadores,
      };
    });

    // Calcular totais de assistências, amarelos e vermelhos
    let totalAssistencias = 0;
    let totalAmarelos = 0;
    let totalVermelhos = 0;

    updatedTimes.forEach((time) => {
      time.jogadores.forEach((jogador) => {
        totalAssistencias += jogador.assistencias;
        totalAmarelos += jogador.amarelos;
        totalVermelhos += jogador.vermelhos;
      });
    });

    // Calcular total de gols com base nos confrontos
    const totalGols = confrontos.reduce((acc, { golsA, golsB }) => acc + golsA + golsB, 0);

    // Criar array de classificação sem alterar a ordem dos times
    const classificacao = prevData.times
      .slice() // Copiar o array original para evitar alterações
      .sort((a, b) => {
        const ranks = { Campeão: 1, Vice: 2, Terceiro: 3, Quarto: 4 };
        return ranks[a.classificacao] - ranks[b.classificacao];
      })
      .map((time) => time.nome);

      return {
      ...prevData,
      totalGols,
      totalAssistencias,
      totalAmarelos,
      totalVermelhos,
      times: updatedTimes, // Manter a ordem original dos times
      classificacao, // Array com a ordem dos nomes classificados
    };
  });

    if (!roundData.rodada || !roundData.data || !roundData.totalGols || !roundData.artilheiros.nomes || 
        !roundData.artilheiros.gols || !roundData.assistentes.nomes || !roundData.assistentes.assistencias || 
        !roundData.classificacao[0] || !roundData.classificacao[1] ||
      !roundData.classificacao[2] || !roundData.classificacao[3]) {
      alert('Preencha todos os campos antes de salvar')
      
    } else {
      const codigo = prompt('Digite o código verde: ')
      const fetchCreateRound = async () => {
        try {
          const response = await fetch(url + 'rounds', {
            method: "POST", // O método HTTP
            headers: {
              "Content-Type": "application/json",
              "key": codigo
            },
            body: JSON.stringify({
              numero: roundData.rodada,
              gols: roundData.totalGols,
              assistencias: roundData.totalAssistencias,
              amarelos: roundData.totalAmarelos,
              vermelhos: roundData.totalVermelhos,
              artilheiro: {nome: roundData.artilheiros.nomes, gols: roundData.artilheiros.gols},
              assistente: {nome: roundData.assistentes.nomes, assistencias: roundData.assistentes.assistencias},
              data: roundData.data,
              primeiro: roundData.classificacao[0],
              segundo: roundData.classificacao[1],
              terceiro: roundData.classificacao[2],
              quarto: roundData.classificacao[3]          
            })
          })

          var data = await response.json()
          setAlerta(data.message)
          alert(data.message)
          return response.status === 201 ? 1 : 0;

        } catch (err) {
          setError(err.message);
        } finally {
          // alert(alerta)
        }
      };

      const resultRound = await fetchCreateRound()

      if (resultRound === 1) {
        const fetchPlayerUpdate = async () => {
          try {
            const time1 = roundData.times[0].jogadores
            const time2 = roundData.times[1].jogadores
            const time3 = roundData.times[2].jogadores
            const time4 = roundData.times[3].jogadores

            const times = [...time1, ...time2, ...time3, ...time4]

            const response = await fetch(url + 'player-all', {
              method: "PUT", // O método HTTP
              headers: {
                "Content-Type": "application/json",
                "key": codigo
              },
              body: JSON.stringify(times)
              })
            
  
            var data = await response.json()
            setAlerta(data.message)
            alert(data.message)
  
          } catch (err) {
            setError(err.message);
          } finally {
            setRoundData(resetData);
            setIsModalOpen(false);
          }
        };

        fetchPlayerUpdate()
      } 
    }
  }

  const updateRound = async (id) => {
    setModalUpdate(true)

    const fetchRound = async () => {
      try {
        const response = await fetch(url + 'rounds/' + id, {
          method: "GET", // O método HTTP
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        const result = await response.json();
        setTextValue(JSON.stringify(result))
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    await fetchRound()
    

  }

  const saveUpdate = async (body) => {
    const bodyUpdate = JSON.parse(body)
    const id = bodyUpdate.id
    delete bodyUpdate.id;
    console.log(bodyUpdate)

    const codigo = prompt('Digite o código verde: ')
    const fetchRound = async () => {
      try {
        const response = await fetch(url + 'rounds/' + id, {
          method: "PUT", // O método HTTP
          headers: {
            "Content-Type": "application/json",
            "key": codigo
          },
          body: JSON.stringify(bodyUpdate)
        });

        const result = await response.json();
        setAlerta(result.message)
        alert(result.message)

        const responseRound = await fetch(url + 'rounds', {
          method: "GET", // O método HTTP
          headers: {
            "Content-Type": "application/json",
          }
        });
        const resultRound = await responseRound.json();
        setData(resultRound);
        setModalUpdate(false)

        return response.status === 201 ? 1 : 0;
      } catch (err) {
        setError(err.message);
        setModalUpdate(false)
      } finally {
        setModalUpdate(false)
        setLoading(false);
      }
    }

    await fetchRound()

  }
  

  // ---- Apoio da interface (não altera dados enviados à API) ----
  const formatDate = (d) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || '');
    return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
  };

  const downloadExcel = () => {
    const rows = data.map((r) => ({
      rodada: r.numero,
      data: r.data,
      gols: r.gols,
      assistencias: r.assistencias,
      amarelos: r.amarelos,
      vermelhos: r.vermelhos,
      artilheiro: r.artilheiro?.nome,
      artilheiro_gols: r.artilheiro?.gols,
      assistente: r.assistente?.nome,
      assistente_assistencias: r.assistente?.assistencias,
      primeiro: r.primeiro,
      segundo: r.segundo,
      terceiro: r.terceiro,
      quarto: r.quarto,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rodadas");
    XLSX.writeFile(wb, "rodadas.xlsx");
  };

  const closeNewRound = () => {
    setRoundData(resetData);
    setIsModalOpen(false);
  };

  const setConfronto = (index, campo, valor) =>
    setRoundData((prev) => {
      const updated = [...prev.confrontos];
      updated[index][campo] = valor;
      return { ...prev, confrontos: updated };
    });

  // Mata-mata (3º lugar = 6, final = 7): um time não pode aparecer duas vezes
  const knockoutSelect = (index, campo) => {
    const taken = [6, 7].flatMap((i) => [['timeA', i], ['timeB', i]])
      .filter(([c, i]) => !(i === index && c === campo))
      .map(([c, i]) => roundData.confrontos[i][c]);
    return (
      <select
        className="inp"
        value={roundData.confrontos[index][campo]}
        onChange={(e) => setConfronto(index, campo, e.target.value)}
      >
        <option value="">Selecione...</option>
        {roundData.times.filter((t) => !taken.includes(t.nome)).map((t, i) => (
          <option key={i} value={t.nome}>{t.nome}</option>
        ))}
      </select>
    );
  };

  const scoreInput = (index, campo) => (
    <input
      className="inp score"
      type="number"
      min={0}
      value={roundData.confrontos[index][campo]}
      onChange={(e) => setConfronto(index, campo, Number(e.target.value))}
    />
  );

  const classificacaoSelect = (label) => (
    <label className="field" key={label}>
      <span>{label}</span>
      <select
        className="inp"
        value={roundData.times.find((time) => time.classificacao === label)?.nome || ""}
        onChange={(e) => handleClassificacaoChange(e.target.value, label)}
      >
        <option value="">Selecione...</option>
        {roundData.times
          .filter((time) => !["Campeão", "Vice", "Terceiro", "Quarto"].filter((c) => c !== label).includes(time.classificacao))
          .map((time, i) => (
            <option key={i} value={time.nome}>{time.nome}</option>
          ))}
      </select>
    </label>
  );

  const setStat = (grupo, campo, valor) =>
    setRoundData((prev) => ({ ...prev, [grupo]: { ...prev[grupo], [campo]: valor } }));

  const medals = ["🥇", "🥈", "🥉", "4º"];

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Rodadas</h1>
        <div className="page-actions">
          <div className="segmented" role="group" aria-label="Visualização">
            <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>Cards</button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Tabela</button>
          </div>
          <button className="btn btn-ghost" onClick={downloadExcel}><FaFileExcel /> Exportar Excel</button>
          <button className="btn" onClick={() => setIsModalOpen(true)}><FaPlus /> Nova rodada</button>
        </div>
      </div>

      {data.length === 0 && <p className="empty-note">Nenhuma rodada cadastrada.</p>}

      {view === 'cards' ? (
        <div className="round-grid">
          {data.map((row, index) => (
            <article key={index} className="card round-card">
              <header>
                <div>
                  <span className="round-num">Rodada {row.numero}</span>
                  <span className="round-date">{formatDate(row.data)}</span>
                </div>
                <button className="icon-btn" onClick={() => updateRound(row.numero)} aria-label={`Editar rodada ${row.numero}`}><FaPen /></button>
              </header>
              <ol className="round-podium">
                {[row.primeiro, row.segundo, row.terceiro, row.quarto].map((time, i) => (
                  <li key={i} className={i === 0 ? "champ" : ""}><span>{medals[i]}</span>{time}</li>
                ))}
              </ol>
              <div className="round-stats">
                <div><b>{row.gols}</b><span>⚽ Gols</span></div>
                <div><b>{row.assistencias}</b><span>Assist.</span></div>
                <div><b>{row.amarelos}</b><span><img src={amarelo} alt="amarelos" /></span></div>
                <div><b>{row.vermelhos}</b><span><img src={vermelho} alt="vermelhos" /></span></div>
              </div>
              <footer>
                <div><span>Artilheiro</span>{row.artilheiro.nome} <b>{row.artilheiro.gols}</b></div>
                <div><span>Assistente</span>{row.assistente.nome} <b>{row.assistente.assistencias}</b></div>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rodada</th>
                <th>Data</th>
                <th title="Gols">⚽</th>
                <th title="Assistências">A</th>
                <th><img src={amarelo} alt="amarelo" style={{ width: 12, height: 15 }} /></th>
                <th><img src={vermelho} alt="vermelhos" style={{ width: 12, height: 15 }} /></th>
                <th>Artilheiros</th>
                <th>Assistentes</th>
                <th title="Campeão">🏆</th>
                <th>🥈</th>
                <th>🥉</th>
                <th>4º</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="pos">{row.numero}</td>
                  <td>{formatDate(row.data)}</td>
                  <td>{row.gols}</td>
                  <td>{row.assistencias}</td>
                  <td>{row.amarelos}</td>
                  <td>{row.vermelhos}</td>
                  <td>{row.artilheiro.nome + ' - ' + row.artilheiro.gols} Gols</td>
                  <td>{row.assistente.nome + ' - ' + row.assistente.assistencias} Ass.</td>
                  <td>{row.primeiro}</td>
                  <td>{row.segundo}</td>
                  <td>{row.terceiro}</td>
                  <td>{row.quarto}</td>
                  <td><button className="icon-btn" onClick={() => updateRound(row.numero)} aria-label={`Editar rodada ${row.numero}`}><FaPen /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="card modal modal-wide">
            <div className="modal-top">
              <h2 className="section-title">Nova rodada</h2>
              <button className="icon-btn" onClick={closeNewRound} aria-label="Fechar"><FaTimes /></button>
            </div>

            <div className="form-row">
              <label className="field">
                <span>Rodada</span>
                <input className="inp" type="number" value={roundData.rodada}
                  onChange={(e) => setRoundData({ ...roundData, rodada: Number(e.target.value) })} />
              </label>
              <label className="field">
                <span>Data</span>
                <input className="inp" type="date" value={roundData.data}
                  onChange={(e) => setRoundData({ ...roundData, data: e.target.value })} />
              </label>
            </div>

            <div className="teams-grid">
              {roundData.times.map((time, timeIndex) => (
                <section key={timeIndex} className="team-box">
                  <h3>{time.nome}</h3>
                  <div className="player-head">
                    <span>Jogador</span><span>⚽</span><span>A</span>
                    <span><img src={amarelo} alt="amarelos" /></span>
                    <span><img src={vermelho} alt="vermelhos" /></span>
                  </div>
                  {time.jogadores.map((jogador, jogadorIndex) => (
                    <div key={jogadorIndex} className="player-row">
                      <select className="inp"
                        value={jogador.nome}
                        onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "nome")}
                      >
                        <option value="">{jogadorIndex === 0 ? "Goleiro" : "Selecione"}</option>
                        {jogadorIndex === 0
                          ? dataGol.map((gol) => <option key={gol.id} value={gol.nome}>{gol.nome}</option>)
                          : dataPlayer.map((player) => <option key={player.id} value={player.nome}>{player.nome}</option>)}
                      </select>
                      {[["gols", "Gols"], ["assistencias", "Assistências"], ["amarelos", "Amarelos"], ["vermelhos", "Vermelhos"]].map(([campo, label]) => (
                        <input key={campo} className="inp score" type="number" min={0}
                          aria-label={label} placeholder={label}
                          value={jogador[campo]}
                          onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, campo)} />
                      ))}
                    </div>
                  ))}
                </section>
              ))}
            </div>

            <div className="form-cols">
              <section className="team-box">
                <h3>Confrontos</h3>
                {roundData.confrontos.slice(0, 6).map((confronto, index) => (
                  <div key={index} className="match-row">
                    <span className="team-name">{confronto.timeA}</span>
                    {scoreInput(index, 'golsA')}
                    <b>X</b>
                    {scoreInput(index, 'golsB')}
                    <span className="team-name">{confronto.timeB}</span>
                  </div>
                ))}
                <h4>Terceiro lugar</h4>
                <div className="match-row">
                  {knockoutSelect(6, 'timeA')}
                  {scoreInput(6, 'golsA')}
                  <b>X</b>
                  {scoreInput(6, 'golsB')}
                  {knockoutSelect(6, 'timeB')}
                </div>
                <h4>Final</h4>
                <div className="match-row">
                  {knockoutSelect(7, 'timeA')}
                  {scoreInput(7, 'golsA')}
                  <b>X</b>
                  {scoreInput(7, 'golsB')}
                  {knockoutSelect(7, 'timeB')}
                </div>
              </section>

              <section className="team-box">
                <h3>Classificação</h3>
                {["Campeão", "Vice", "Terceiro", "Quarto"].map(classificacaoSelect)}
              </section>

              <section className="team-box">
                <h3>Estatísticas</h3>
                <label className="field">
                  <span>Artilheiro(s)</span>
                  <div className="pair">
                    <input className="inp" type="text" placeholder="Artilheiro" value={roundData.artilheiros.nomes}
                      onChange={(e) => setStat('artilheiros', 'nomes', e.target.value)} />
                    <input className="inp score" type="number" min={0} placeholder="Gols" value={roundData.artilheiros.gols}
                      onChange={(e) => setStat('artilheiros', 'gols', Number(e.target.value))} />
                  </div>
                </label>
                <label className="field">
                  <span>Assistente(s)</span>
                  <div className="pair">
                    <input className="inp" type="text" placeholder="Maiores assistentes" value={roundData.assistentes.nomes}
                      onChange={(e) => setStat('assistentes', 'nomes', e.target.value)} />
                    <input className="inp score" type="number" min={0} placeholder="Assist." value={roundData.assistentes.assistencias}
                      onChange={(e) => setStat('assistentes', 'assistencias', Number(e.target.value))} />
                  </div>
                </label>
              </section>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeNewRound}>Cancelar</button>
              <button className="btn" onClick={() => calcularEstatisticas(roundData.confrontos)}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {modalUpdate && (
        <div className="modal-backdrop" onClick={() => setModalUpdate(false)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="section-title">Editar rodada</h2>
            <textarea className="modal-text" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModalUpdate(false)}>Voltar</button>
              <button className="btn" onClick={() => saveUpdate(textValue)}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
