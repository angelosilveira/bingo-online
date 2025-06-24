import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Home from "./pages/Home";
import Bingos from "./pages/Bingos";
import NovoBingo from "./pages/NovoBingo";
import Cartelas from "./pages/Cartelas";
import Conferencia from "./pages/Conferencia";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Usuarios from "./pages/Users/index";
import PublicConferencia from "./pages/PublicConferencia";
import BingoGestao from "./pages/Bingos/BingoGestao";
import BingoGestaoConferencia from "./pages/Bingos/BingoGestaoConferencia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            {/* Envolver as rotas protegidas com o componente Layout */}
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bingos"
                element={
                  <ProtectedRoute>
                    <Bingos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bingos/novo"
                element={
                  <ProtectedRoute>
                    <NovoBingo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cartelas"
                element={
                  <ProtectedRoute>
                    <Cartelas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conferencia"
                element={
                  <ProtectedRoute>
                    <Conferencia />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute>
                    <Usuarios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bingo/:id"
                element={
                  <ProtectedRoute>
                    <BingoGestao />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bingo/:id/conferencia"
                element={
                  <ProtectedRoute>
                    <BingoGestaoConferencia />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/* Rota pública FORA do Layout para não ter sidebar nem header */}
            <Route
              path="/public/bingo/:bingoId"
              element={<PublicConferencia />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
