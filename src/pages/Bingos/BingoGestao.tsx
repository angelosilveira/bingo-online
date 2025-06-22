import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBingoById,
  getConferenciaByBingoId,
  getCompradoresByBingoId,
} from "../../services/bingoGestaoService";
import { useAuth } from "../../hooks/useAuth";
import { Bingo, ConferenciaItem, Comprador } from "../../models/BingoGestao";

const BingoGestao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bingo, setBingo] = useState<Bingo | null>(null);
  const [conferencia, setConferencia] = useState<ConferenciaItem[]>([]);
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const bingoData = await getBingoById(id!);
      const conferenciaData = await getConferenciaByBingoId(id!);
      const compradoresData = await getCompradoresByBingoId(id!);
      setBingo(bingoData);
      setConferencia(conferenciaData);
      setCompradores(compradoresData);
      setLoading(false);
    };
    fetchData();
  }, [id, user, navigate]);

  if (loading) return <div>Carregando...</div>;
  if (!bingo) return <div>Bingo não encontrado.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestão do Bingo: {bingo.nome}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Informações Gerais</h2>
        <p>
          <b>Responsável:</b> {bingo.responsavel_nome}
        </p>
        <p>
          <b>Data:</b> {new Date(bingo.data).toLocaleString()}
        </p>
        <p>
          <b>Total de Cartelas:</b> {bingo.total_cartelas}
        </p>
        <p>
          <b>Status:</b> {bingo.status}
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tabela de Conferência</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Número</th>
              <th className="border px-2 py-1">Data/Hora Sorteio</th>
            </tr>
          </thead>
          <tbody>
            {conferencia.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.numero}</td>
                <td className="border px-2 py-1">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Compradores</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Qtd. Cartelas</th>
            </tr>
          </thead>
          <tbody>
            {compradores.map((c) => (
              <tr key={c.id}>
                <td className="border px-2 py-1">{c.nome}</td>
                <td className="border px-2 py-1">{c.email}</td>
                <td className="border px-2 py-1">{c.qtd_cartelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BingoGestao;
