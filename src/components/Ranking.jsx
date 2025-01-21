import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_URL || ''
import amarelo from "../assets/amarelo.png";
import vermelho from "../assets/verm.png";
import * as XLSX from 'xlsx';

const Tables = () => {
  const [data, setData] = useState([]);
  const [dataJog, setDataJog] = useState([]);
  const [dataGol, setDataGol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(data, 'data')
  console.log(dataGol, 'dataGol')

  // Estado para a coluna e direção de classificação
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  // Estado para as colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState([
    "pos",
    "jogador",
    "pontos",
    "cotas",
    "jogos",
    "vitorias",
    "empates",
    "derrotas",
    "gols_pro",
    "gols_contra",
    "saldo_gols",
    "primeiro",
    "segundo",
    "terceiro",
    "quarto",
    "amarelo",
    "vermelho",
    "gols",
    "mediaG",
    "ass",
    "mediaA"
  ]);

  // Função para buscar os dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + 'player', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseGol = await fetch(url + 'player-gol', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok || !responseGol.ok) {
          throw new Error("Erro ao buscar os dados.");
        }
        const result = await response.json();
        const resultGol = await responseGol.json();

        setData(result)
        setDataJog(result)
        setDataGol(resultGol)

        setVisibleColumns(["pos", "jogador", "pontos", "cotas", "jogos", "vitorias", "empates", "derrotas", 
          'gols_pro', 'gols_contra', 'saldo_gols', 'primeiro', 'segundo', 'terceiro', 'quarto', 'amarelo', 'vermelho'
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para mudar as colunas visíveis e ordenar os dados
  const handleColumnChange = (key) => {
    let sortedDataJog = '';
    let sortedDatagol = '';
  
    if (key === "ranking") {
      // Ordena por pontos (descendente), depois por cotas (ascendente)
      sortedDataJog = [...dataJog].sort((a, b) => {
        if (b.pontos !== a.pontos) {
          return b.pontos - a.pontos; // Maior número de pontos primeiro
        }
        return a.cotas - b.cotas; // Menor número de cotas primeiro
      });
  
      setVisibleColumns(["pos", "jogador", "pontos", "cotas", "jogos", "vitorias", "empates", "derrotas", 
        'gols_pro', 'gols_contra', 'saldo_gols', 'primeiro', 'segundo', 'terceiro', 'quarto', 'amarelo', 'vermelho'
      ]);
    } else if (key === "gols") {
      // Ordena por gols (descendente), depois por cotas (ascendente)
      sortedDataJog = [...dataJog].sort((a, b) => {
        if (b.gols !== a.gols) {
          return b.gols - a.gols; // Maior número de gols primeiro
        }
        return a.cotas - b.cotas; // Menor número de cotas primeiro
      });
  
      setVisibleColumns(["pos", "jogador", "gols", "cotas", 'mediaG']);
    } else if (key === "ass") {
      // Ordena por assistências (descendente), depois por cotas (ascendente)
      sortedDataJog = [...dataJog].sort((a, b) => {
        if (b.ass !== a.ass) {
          return b.ass - a.ass; // Maior número de gols primeiro
        }
        return a.cotas - b.cotas; // Menor número de cotas primeiro
      });
  
      setVisibleColumns(["pos", "jogador", "ass", "cotas", 'mediaA']);
    } else if (key === "goleiros") {
        // Ordena por pontos (descendente), depois por cotas (ascendente)
        sortedDatagol = [...dataGol].sort((a, b) => {
          if (b.pontos !== a.pontos) {
            return b.pontos - a.pontos; // Maior número de pontos primeiro
          }
          return a.cotas - b.cotas; // Menor número de cotas primeiro
        });
    
        setVisibleColumns(["pos", "jogador", "pontos", "cotas", "jogos", "vitorias", "empates", "derrotas", 
          'gols_pro', 'gols_contra', 'saldo_gols', 'primeiro', 'segundo', 'terceiro', 'quarto', 'amarelo', 'vermelho'
        ]);
    } else {
      // Ordenação genérica para outras colunas
      sortedDataJog = [...data].sort((a, b) => {
        if (b[key] < a[key]) return -1;
        if (b[key] > a[key]) return 1;
        return 0;
      });
    }
  
    setData(key === "goleiros" ? sortedDatagol : sortedDataJog);
    setSortConfig({ key, direction: "desc" }); // Mantém sempre descendente
  };

  const newPlayer = () => {
    const nome = prompt('Digite o nome do Jodagor: ')
    const codigo = prompt('Digite o código verde: ')
    if (nome && codigo) {
      const fetchCreatePlayer = async () => {
        try {
          const response = await fetch(url + 'player', {
            method: "POST", // O método HTTP
            headers: {
              "Content-Type": "application/json",
              "key": codigo
            },
            body: JSON.stringify({nome: nome ? nome.toUpperCase() : ''})
          })

          var data = await response.json()
          alert(data.message)
          return response.status === 201 ? 1 : 0;

        } catch (err) {
          setError(err.message);
        }
      }
      fetchCreatePlayer()
    }
  }

  const downloadExcel = () => {
    // Seus dados
    const data = [...dataJog, ...dataGol];
  
    // Criar uma nova planilha
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planilha1");
  
    // Gerar o arquivo e fazer download
    XLSX.writeFile(wb, "ranking.xlsx");
  };


  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;


  return (
    <div className="div-ranking">
        <button className="button-new-player" onClick={() => newPlayer()}>Novo jogador</button>
      <div className="button-ranking">
        <button onClick={() => handleColumnChange("ranking")}>Ranking</button>
        <button onClick={() => handleColumnChange("gols")}>Gols</button>
        <button onClick={() => handleColumnChange("ass")}>Assistências</button>
        <button onClick={() => handleColumnChange("goleiros")}>Goleiros</button>
      </div>
      <div className="div-table">
        <table className="ranking-table">
          <thead>
            <tr>
              {visibleColumns.includes("pos") && <th>Pos.</th>}
              {visibleColumns.includes("jogador") && <th>Jogador</th>}
              {visibleColumns.includes("pontos") && <th>P</th>}
              {visibleColumns.includes("cotas") && <th>C</th>}
              {visibleColumns.includes("jogos") && <th>J</th>}
              {visibleColumns.includes("vitorias") && <th>V</th>}
              {visibleColumns.includes("empates") && <th>E</th>}
              {visibleColumns.includes("derrotas") && <th>D</th>}
              {visibleColumns.includes("gols_pro") && <th>GP</th>}
              {visibleColumns.includes("gols_contra") && <th>GC</th>}
              {visibleColumns.includes("saldo_gols") && <th>SG</th>}
              {visibleColumns.includes("primeiro") && <th>1º</th>}
              {visibleColumns.includes("segundo") && <th>2º</th>}
              {visibleColumns.includes("terceiro") && <th>3º</th>}
              {visibleColumns.includes("quarto") && <th>4º</th>}
              {visibleColumns.includes("amarelo") && (
                <th>
                  <img
                    src={amarelo}
                    alt="amarelo"
                    style={{ width: "15px", height: "20px" }}
                  />
                </th>
              )}
              {visibleColumns.includes("vermelho") && (
                <th>
                  <img
                    src={vermelho}
                    alt="vermelho"
                    style={{ width: "15px", height: "20px" }}
                  />
                </th>
              )}
              {visibleColumns.includes("gols") && <th>Gols</th>}
              {visibleColumns.includes("mediaG") && <th>Média</th>}
              {visibleColumns.includes("ass") && <th>Assistências</th>}
              {visibleColumns.includes("mediaA") && <th>Média</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {visibleColumns.includes("pos") && <td>{index + 1}</td>}
                {visibleColumns.includes("jogador") && <td>{row.nome}</td>}
                {visibleColumns.includes("pontos") && <td>{row.pontos}</td>}
                {visibleColumns.includes("cotas") && <td>{row.cotas}</td>}
                {visibleColumns.includes("jogos") && <td>{row.jogos}</td>}
                {visibleColumns.includes("vitorias") && (
                  <td>{row.vitorias}</td>
                )}
                {visibleColumns.includes("empates") && <td>{row.empates}</td>}
                {visibleColumns.includes("derrotas") && (
                  <td>{row.derrotas}</td>
                )}
                {visibleColumns.includes("gols_pro") && (
                  <td>{row.gols_pro}</td>
                )}
                {visibleColumns.includes("gols_contra") && (
                  <td>{row.gols_contra}</td>
                )}
                {visibleColumns.includes("saldo_gols") && (
                  <td>{row.gols_pro - row.gols_contra}</td>
                )}
                {visibleColumns.includes("primeiro") && (
                  <td>{row.primeiro}</td>
                )}
                {visibleColumns.includes("segundo") && (
                  <td>{row.segundo}</td>
                )}
                {visibleColumns.includes("terceiro") && (
                  <td>{row.terceiro}</td>
                )}
                {visibleColumns.includes("quarto") && <td>{row.quarto}</td>}
                {visibleColumns.includes("amarelo") && <td>{row.amarelo}</td>}
                {visibleColumns.includes("vermelho") && <td>{row.vermelho}</td>}
                {visibleColumns.includes("gols") && <td>{row.gols}</td>}
                {visibleColumns.includes("mediaG") && <td>{(row.gols / row.cotas).toFixed(2)}</td>}
                {visibleColumns.includes("ass") && <td>{row.ass}</td>}
                {visibleColumns.includes("mediaA") && <td>{(row.ass / row.cotas).toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <button className="download" onClick={() => downloadExcel()}>⇓ Download</button>
    </div>
  );
};

export default Tables;
