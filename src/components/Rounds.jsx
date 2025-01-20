import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''
import amarelo from "../assets/amarelo.png";
import vermelho from "../assets/verm.png";
import * as XLSX from 'xlsx';


// import vermelho from "../assets/vermelho.png";

const Tables = () => {
  // Estado para armazenar os dados da tabela
  const [data, setData] = useState([]);
  const [dataPlayer, setDataPlayer] = useState([]);
  const [dataGol, setDataGol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState('');
  // Dados para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roundData, setRoundData] = useState({
    rodada: "",
    data: "",
    totalGols: 0,
    totalAssistencias: 0,
    totalAmarelos: 0,
    totalVermelhos: 0,
    times: [
      { nome: "TIME 1", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 2", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 3", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 4", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
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
      { nome: "TIME 1", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 2", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 3", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
      { nome: "TIME 4", classificacao: '', jogadores: Array.from({ length: 7 }, () => ({ nome: "", gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, p: 0, s: 0, t: 0, q: 0 })) },
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


  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;


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
  

  return (
    <div className="div-round">
      <div className="round-button">
      {isModalOpen ? " ": <button onClick={() => setIsModalOpen(true)}>Nova Rodada</button>}
      <div/>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{display: 'flex', justifyContent: 'center'}}>Nova Rodada</h2>
            <div className="modal-field" style={{display: 'flex', justifyItems: 'center', flexDirection: 'column' }}>
            <button onClick={() => {setRoundData(resetData);setIsModalOpen(false);}} 
              style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold', 
                      backgroundColor: '#a81a1a',  
                      color: "whitesmoke",
                      marginLeft: '90%',
                      width: '35px',
                      height: '35px',
                      borderRadius: '50px',
                      boxShadow: 'none'
            }}>X</button>
              <label>Rodada:</label>
              <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                type="number"
                value={roundData.rodada}
                onChange={(e) => setRoundData({ ...roundData, rodada: Number(e.target.value) })}
              />
              <label>Data:</label>
              <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                type="date"
                value={roundData.data}
                onChange={(e) => setRoundData({ ...roundData, data: e.target.value })}
              />
            </div>

            {roundData.times.map((time, timeIndex) => (
              <div key={timeIndex} className="time-section">
                <h3 style={{textAlign: 'center', margin: '50px 0px -10px 0px', backgroundColor: '#004d00b1'}}>{time.nome}</h3>
                <div style={{display: 'flex', justifyContent: 'left'}}>
                  <p style={{marginLeft: '7%'}}>Nome</p>
                  <p style={{marginLeft: '15%'}}>Gols</p>
                  <p style={{marginLeft: '13%'}}>Assistências</p>
                  <p style={{marginLeft: '11%'}}>Amarelos</p>
                  <p style={{marginLeft: '12%'}}>Vermelhos</p>
                <div/>
                </div>
                {time.jogadores.map((jogador, jogadorIndex) => (
                  <div key={jogadorIndex} className="player-row">
                    <select style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                      value={jogador.nome}
                      onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "nome")}
                    >
                      <option value="">Selecione</option>
                      {jogadorIndex === 0
                        ? dataGol.map((gol) => <option key={gol.id} value={gol.nome}>{gol.nome}</option>)
                        : dataPlayer.map((player) => <option key={player.id} value={player.nome}>{player.nome}</option>)}
                    </select>
                    <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                      type="number"
                      min={0}
                      placeholder="Gols"
                      value={jogador.gols}
                      onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "gols")}
                    />
                    <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                      type="number"
                      min={0}
                      placeholder="Assistências"
                      value={jogador.assistencias}
                      onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "assistencias")}
                    />
                    <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                      type="number"
                      min={0}
                      placeholder="Amarelos"
                      value={jogador.amarelos}
                      onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "amarelos")}
                    />
                    <input style={{width: '18%', height: '25px', margin: '5px', borderRadius: '8px'}}
                      type="number"
                      min={0}
                      placeholder="Vermelhos"
                      value={jogador.vermelhos}
                      onChange={(e) => handleInputChange(e, timeIndex, jogadorIndex, "vermelhos")}
                    />
                  </div>
                ))}
              </div>
            ))}
            
            <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
              {/* Confrontos */}
              <div className="confrontos">
                <h3>Confrontos</h3>
                {roundData.confrontos.slice(0, 6).map((confronto, index) => (
                  <div key={index} style={{ marginBottom: "10px", borderRadius: '8px'}}>
                    <input
                      type="text"
                      value={roundData.confrontos[index].timeA}
                      readOnly
                      style={{ width: "100px", textAlign: "center" }}
                    />
                    <input
                      type="number"
                      min={0}
                      value={confronto.golsA}
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[index].golsA = Number(e.target.value);
                          return { ...prev, confrontos: updated };
                        })
                      }
                      style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                    />
                    X
                    <input
                      type="number"
                      min={0}
                      value={confronto.golsB}
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[index].golsB = Number(e.target.value);
                          return { ...prev, confrontos: updated };
                        })
                      }
                      style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                    />
                    <input
                      type="text"
                      value={roundData.confrontos[index].timeB}
                      readOnly
                      style={{ width: "100px", textAlign: "center" }}
                    />
                  </div>
                ))}

                <h4>Terceiro Lugar</h4>
                <div style={{ marginBottom: "10px" }}>
                    <select
                      style={{ width: "100px", textAlign: "center" }}
                      value={roundData.confrontos[6].timeA}
                      required
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[6].timeA = e.target.value;
                          return { ...prev, confrontos: updated };
                        })
                      }
                    ><option value="">Selecione...</option>
                    {roundData.times
                    .filter((time) => time.nome !== roundData.confrontos[6].timeB && time.nome !== roundData.confrontos[7].timeA && time.nome !== roundData.confrontos[7].timeB)
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                    </select>
                  <input
                    type="number"
                    min={0}
                    value={roundData.confrontos[6].golsA}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = [...prev.confrontos];
                        updated[6].golsA = Number(e.target.value);
                        return { ...prev, confrontos: updated };
                      })
                    }
                    style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                  />
                  X
                  <input
                    type="number"
                    min={0}
                    value={roundData.confrontos[6].golsB}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = [...prev.confrontos];
                        updated[6].golsB = Number(e.target.value);
                        return { ...prev, confrontos: updated };
                      })
                    }
                    style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                  />
                  <select
                      style={{ width: "100px", textAlign: "center" }}
                      value={roundData.confrontos[6].timeB}
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[6].timeB = e.target.value;
                          return { ...prev, confrontos: updated };
                        })
                      }
                    ><option value="">Selecione...</option>
                      {roundData.times
                    .filter((time) => time.nome !== roundData.confrontos[6].timeA && time.nome !== roundData.confrontos[7].timeA && time.nome !== roundData.confrontos[7].timeB)
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                    </select>
                </div>

                <h4>Final</h4>
                <div style={{ marginBottom: "10px" }}>
                <select style={{ width: "100px", textAlign: "center" }}
                      value={roundData.confrontos[7].timeA}
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[7].timeA = e.target.value;
                          return { ...prev, confrontos: updated };
                        })
                      }
                    ><option value="">Selecione...</option>
                      {roundData.times
                    .filter((time) => time.nome !== roundData.confrontos[6].timeA && time.nome !== roundData.confrontos[6].timeB && time.nome !== roundData.confrontos[7].timeB)
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                    </select>
                  <input
                    type="number"
                    min={0}
                    value={roundData.confrontos[7].golsA}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = [...prev.confrontos];
                        updated[7].golsA = Number(e.target.value);
                        return { ...prev, confrontos: updated };
                      })
                    }
                    style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                  />
                  X
                  <input
                    type="number"
                    min={0}
                    value={roundData.confrontos[7].golsB}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = [...prev.confrontos];
                        updated[7].golsB = Number(e.target.value);
                        return { ...prev, confrontos: updated };
                      })
                    }
                    style={{ width: "40px", margin: "0 5px", textAlign: "center" }}
                  />
                  <select style={{ width: "100px", textAlign: "center" }}
                      value={roundData.confrontos[7].timeB}
                      onChange={(e) =>
                        setRoundData((prev) => {
                          const updated = [...prev.confrontos];
                          updated[7].timeB = e.target.value;
                          return { ...prev, confrontos: updated };
                        })
                      }
                    ><option value="">Selecione...</option>
                      {roundData.times
                    .filter((time) => time.nome !== roundData.confrontos[6].timeA && time.nome !== roundData.confrontos[6].timeB && time.nome !== roundData.confrontos[7].timeA)
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                    </select>
                </div>
              </div>

              {/* Classificação */}
              <div>
              <h3>Classificação</h3>
              <div style={{ marginBottom: "10px", gap: '20px' }}>
                <label>Campeão: </label>
                <select style={{ width: "100px", margin: "0 5px", textAlign: "center" }}
                  value={roundData.times.find(time => time.classificacao === "Campeão")?.nome || ""}
                  onChange={(e) => handleClassificacaoChange(e.target.value, "Campeão")}
                >
                  <option value="">Selecione...</option>
                  {roundData.times
                    .filter((time) => time.classificacao !== "Vice" && time.classificacao !== "Terceiro" && time.classificacao !== "Quarto")
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vice: </label>
                <select style={{ width: "100px", margin: "0 50px", textAlign: "center" }}
                  value={roundData.times.find(time => time.classificacao === "Vice")?.nome || ""}
                  onChange={(e) => handleClassificacaoChange(e.target.value, "Vice")}
                >
                  <option value="">Selecione...</option>
                  {roundData.times
                    .filter((time) => time.classificacao !== "Campeão" && time.classificacao !== "Terceiro" && time.classificacao !== "Quarto")
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Terceiro: </label>
                <select style={{ width: "100px", margin: "0 20px", textAlign: "center" }}
                  value={roundData.times.find(time => time.classificacao === "Terceiro")?.nome || ""}
                  onChange={(e) => handleClassificacaoChange(e.target.value, "Terceiro")}
                >
                  <option value="">Selecione...</option>
                  {roundData.times
                    .filter((time) => time.classificacao !== "Campeão" && time.classificacao !== "Vice" && time.classificacao !== "Quarto")
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px"}}>
                <label>Quarto: </label>
                <select style={{ width: "100px", margin: "0 30px", textAlign: "center" }}
                  value={roundData.times.find(time => time.classificacao === "Quarto")?.nome || ""}
                  onChange={(e) => handleClassificacaoChange(e.target.value, "Quarto")}
                >
                  <option value="">Selecione...</option>
                  {roundData.times
                    .filter((time) => time.classificacao !== "Campeão" && time.classificacao !== "Vice" && time.classificacao !== "Terceiro")
                    .map((time, i) => (
                      <option key={i} value={time.nome}>
                        {time.nome}
                      </option>
                    ))}
                </select>
              </div>
              </div>

              {/* Estatísticas */}
              <div >
                <h3>Estatísticas</h3>
                <div >
                <label style={{ marginBottom: "0px", display: 'flex', flexDirection: 'column'}}>Artilheiros: </label>
                <input
                    type="text"
                    placeholder="Artilheiro"
                    value={roundData.artilheiros.nomes}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = { ...prev.artilheiros };
                        updated.nomes = e.target.value;
                        return { ...prev, artilheiros: updated };
                      })
                    }
                    style={{ width: '120px', margin: "0 5px", textAlign: "center" }}
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Gols"
                    value={roundData.artilheiros.gols}
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = { ...prev.artilheiros };
                        updated.gols = Number(e.target.value);
                        return { ...prev, artilheiros: updated };
                      })
                    }
                    style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                  />
                  <label style={{ marginBottom: "0px", marginTop: "10px", display: 'flex', flexDirection: 'column'}} >Assistênte(s): </label>
                <input
                    type="text"
                    value={roundData.assistentes.nomes}
                    placeholder="Maiores Assistentes"
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = { ...prev.assistentes };
                        updated.nomes = e.target.value;
                        return { ...prev, assistentes: updated };
                      })
                    }
                    style={{ width: '120px', margin: "0 5px", textAlign: "center" }}
                  />
                  <input
                    type="number"
                    min={0}
                    value={roundData.assistentes.assistencias}
                    placeholder="Assist."
                    onChange={(e) =>
                      setRoundData((prev) => {
                        const updated = { ...prev.assistentes };
                        updated.assistencias = Number(e.target.value);
                        return { ...prev, assistentes: updated };
                      })
                    }
                    style={{ width: '40px', margin: "0 5px", textAlign: "center" }}
                  />
              </div>
              </div>
              </div>
    
            <button onClick={() => calcularEstatisticas(roundData.confrontos)} style={{margin: '25px 44%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Salvar</button>
          </div>
        </div>
      )}
      </div>
      {isModalOpen ? "" : <div className="div-round-table">
        <table className="round-table">
          <thead>
            <tr>
              <th>Rodada</th>
              <th>Data</th>
              <th><span>&#9917;</span></th>
              <th><span style={{backgroundColor: 'red', borderRadius: '3px'}}>A</span></th>
              <th> 
                  <img
                  src={amarelo}
                  alt="amarelo"
                  style={{ width: "12px", height: "15px" }}/>
              </th>
              <th> 
                  <img
                  src={vermelho}
                  alt="vermelhos"
                  style={{ width: "12px", height: "15px" }}/>
              </th>
              <th>Artilheiros</th>
              <th>Assistêntes</th>
              <th><span>&#127942;</span></th>
              <th><span>&#129352;</span></th>
              <th><span>&#129353;</span></th>
              <th>4º</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.numero}</td>
                <td>{row.data}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default Tables;
