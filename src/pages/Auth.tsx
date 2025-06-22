import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserService } from "@/services/userService";
import { AuthService } from "@/services/authService";
import { sessionService } from "@/services/sessionService";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  useEffect(() => {
    // Verificar se o usuário já está logado via sessionService
    const user = sessionService.getUser();
    if (user) {
      if (user.role === "proprietario") {
        navigate("/conferencia", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login local usando AuthService
        const user = await AuthService.login(username, password);
        if (!user) {
          toast({
            title: "Erro no login",
            description: "Usuário ou senha inválidos.",
            variant: "destructive",
          });
        } else {
          loginContext(user); // Atualiza o contexto imediatamente!
          console.log("[Auth] Usuário logado:", user);
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo, ${user.name}`,
          });
          if (user.role === "proprietario") {
            navigate("/conferencia", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        // Verifica se username já existe
        const exists = await UserService.checkUsernameExists(username);
        if (exists) {
          toast({
            title: "Erro",
            description: "Nome de usuário já existe",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        // Cria usuário na tabela users
        await UserService.createUser({
          name,
          username,
          phone,
          role: "usuario",
          password,
        });
        toast({
          title: "Cadastro realizado!",
          description: "Você já pode fazer login.",
        });
        setIsLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Login" : "Cadastro"}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth}>
            {!isLogin && (
              <>
                <Label htmlFor="name" className="mb-1">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mb-4"
                />
                <Label htmlFor="phone" className="mb-1">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mb-4"
                />
              </>
            )}
            <Label htmlFor="username" className="mb-1">
              Nome de usuário
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mb-4"
            />
            <Label htmlFor="password" className="mb-1">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-6"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mb-2"
              disabled={loading}
            >
              {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
