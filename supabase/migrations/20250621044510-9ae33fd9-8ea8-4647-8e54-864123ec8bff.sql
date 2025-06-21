
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando um usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS nas tabelas existentes e criar políticas básicas
ALTER TABLE public.bingos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartelas_vendidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ganhadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numeros_sorteados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso total por enquanto (depois podemos refinar)
CREATE POLICY "Allow all for authenticated users" ON public.bingos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.cartelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.cartelas_vendidas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.ganhadores FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.numeros_sorteados FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.premios FOR ALL USING (auth.role() = 'authenticated');

-- Ajustar a tabela cartelas para remover a dependência do campo numero
-- e fazer com que seja sequencial baseado na quantidade existente
ALTER TABLE public.cartelas ADD COLUMN IF NOT EXISTS numero INTEGER;

-- Função para gerar número sequencial para cartelas
CREATE OR REPLACE FUNCTION public.generate_cartela_numero()
RETURNS INTEGER AS $$
DECLARE
  next_numero INTEGER;
BEGIN
  SELECT COALESCE(MAX(numero), 0) + 1 INTO next_numero FROM public.cartelas;
  RETURN next_numero;
END;
$$ LANGUAGE plpgsql;
