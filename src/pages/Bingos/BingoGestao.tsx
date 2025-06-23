
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBingoById,
  getConferenciaByBingoId,
  getCompradoresByBingoId,
} from "../../services/bingoGestaoService";
import { useAuth } from "../../hooks/useAuth";
import { Bingo, ConferenciaItem, Comprador } from "../../models/BingoGestao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BingoGestaoSidebar from "@/components/bingo/BingoGestaoSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, DollarSign, Ticket, Users } from "lucide-react";

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
      try {
        setLoading(true);
        const bingoData = await getBingoById(id!);
        const conferenciaData = await getConferenciaByBingoId(id!);
        const compradoresData = await getCompradoresByBingoId(id!);
        setBingo(bingoData);
        setConferencia(conferenciaData);
        setCompradores(compradoresData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  if (!bingo) return <div className="flex items-center justify-center min-h-screen">Bingo não encontrado.</div>;

  // Cálculos para o dashboard
  const cartelasVendidas = compradores.reduce((total, comprador) => total + comprador.qtd_cartelas, 0);
  const cartelasRestantes = bingo.quantity_of_cartelas - cartelasVendidas;
  const percentualVendido = (cartelasVendidas / bingo.quantity_of_cartelas) * 100;

  const getLetraDoNumero = (numero: number): string => {
    if (numero <= 15) return "B";
    if (numero <= 30) return "I";
    if (numero <= 45) return "N";
    if (numero <= 60) return "G";
    return "O";
  };

  return (
    <div className="flex min-h-screen">
      <BingoGestaoSidebar bingoId={id!} />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestão do Bingo: {bingo.name}
            </h1>
            <p className="text-gray-600">
              Responsável: {bingo.responsavel_nome} • Data: {new Date(bingo.date).toLocaleDateString()}
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="conferencia">Conferência</TabsTrigger>
              <TabsTrigger value="compradores">Compradores</TabsTrigger>
              <TabsTrigger value="cartelas">Gestão de Cartelas</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Cartelas</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bingo.quantity_of_cartelas}</div>
                    <p className="text-xs text-muted-foreground">
                      Cadastradas no sistema
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cartelas Vendidas</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{cartelasVendidas}</div>
                    <p className="text-xs text-muted-foreground">
                      {percentualVendido.toFixed(1)}% do total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Restam Vender</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{cartelasRestantes}</div>
                    <p className="text-xs text-muted-foreground">
                      {(100 - percentualVendido).toFixed(1)}% disponíveis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compradores</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{compradores.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Pessoas participando
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status do Bingo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant={bingo.status === 'ativo' ? 'default' : 'secondary'}>
                        {bingo.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Números Sorteados:</span>
                      <span className="font-semibold">{conferencia.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Progresso de Vendas:</span>
                      <span className="font-semibold">{percentualVendido.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Últimos Números Sorteados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {conferencia.length > 0 ? (
                      <div className="grid grid-cols-5 gap-2">
                        {conferencia
                          .slice(-10)
                          .reverse()
                          .map((item, index) => (
                            <div
                              key={item.id}
                              className={`rounded p-2 text-center text-sm font-semibold ${
                                index === 0
                                  ? "bg-yellow-200 text-yellow-800 border-2 border-yellow-400"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              <div className="text-xs">
                                {getLetraDoNumero(item.numero)}
                              </div>
                              <div className="font-bold">{item.numero}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhum número sorteado ainda
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Conferência Tab */}
            <TabsContent value="conferencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tabela de Conferência</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sequência</TableHead>
                        <TableHead>Letra</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Data/Hora Sorteio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conferencia.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}º</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getLetraDoNumero(item.numero)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">{item.numero}</TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {conferencia.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum número foi sorteado ainda
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compradores Tab */}
            <TabsContent value="compradores" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Compradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Qtd. Cartelas</TableHead>
                        <TableHead>Status Pagamento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compradores.map((comprador) => (
                        <TableRow key={comprador.id}>
                          <TableCell className="font-medium">{comprador.nome}</TableCell>
                          <TableCell>{comprador.email || "Não informado"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {comprador.qtd_cartelas} cartela{comprador.qtd_cartelas > 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              Pendente
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {compradores.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma cartela foi vendida ainda
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gestão de Cartelas Tab */}
            <TabsContent value="cartelas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Cartelas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-green-600">Vendidas</h3>
                        <p className="text-2xl font-bold">{cartelasVendidas}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-orange-600">Disponíveis</h3>
                        <p className="text-2xl font-bold">{cartelasRestantes}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-blue-600">Total</h3>
                        <p className="text-2xl font-bold">{bingo.quantity_of_cartelas}</p>
                      </div>
                    </div>
                    
                    <div className="text-center py-8 text-gray-500">
                      <p>Funcionalidade de gestão detalhada de cartelas em desenvolvimento</p>
                      <Button className="mt-4" variant="outline">
                        Gerenciar Cartelas Individualmente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BingoGestao;
