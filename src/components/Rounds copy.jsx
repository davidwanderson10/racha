import React, { useState, useEffect } from "react";
import amarelo from "../assets/amarelo.png";
import vermelho from "../assets/verm.png";

// import vermelho from "../assets/vermelho.png";

const Tables = () => {
  // Estado para armazenar os dados da tabela
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Função para buscar os dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/rounds", {
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


  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="div-round">
      <div className="round-button">
      <button onClick={() => handleColumnChange()}>Nova Rodada</button>
      <div/>
    </div>
      <div className="div-round-table">
        <table className="round-table">
          <thead>
            <tr>
              <th>Rodada</th>
              <th>Data</th>
              <th><span>&#9917;</span></th>
              <th><span style={{backgroundColor: 'red', borderRadius: '3px'}}>‎ A ‎ </span></th>
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
      </div>
    </div>
  );
};

export default Tables;