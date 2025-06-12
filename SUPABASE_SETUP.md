# Configuração do Supabase para o Sistema NAPJe

Este guia explica como configurar o Supabase como banco de dados para o Sistema NAPJe de geração de chamados JIRA.

## 1. Criar uma conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e clique em "Start your project"
2. Crie uma conta ou faça login com GitHub, GitLab ou Google
3. Após o login, clique em "New Project"

## 2. Configurar um novo projeto

1. Escolha uma organização ou crie uma nova
2. Defina um nome para o projeto (ex: "napje-jira")
3. Defina uma senha forte para o banco de dados
4. Escolha a região mais próxima do seu local
5. Mantenha o plano gratuito (Free tier)
6. Clique em "Create new project"

## 3. Criar as tabelas necessárias

Após a criação do projeto, acesse o SQL Editor e execute os seguintes comandos SQL:

```sql
-- Tabela para armazenar os chamados JIRA
CREATE TABLE jira_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notas TEXT NOT NULL,
  chamadoNapje TEXT NOT NULL,
  servidorResponsavel TEXT NOT NULL,
  tipoPendencia TEXT NOT NULL,
  resumo TEXT NOT NULL,
  versao TEXT NOT NULL,
  urgencia TEXT NOT NULL,
  subsistema TEXT NOT NULL,
  ambiente TEXT NOT NULL,
  perfil TEXT NOT NULL,
  nomeCompleto TEXT NOT NULL,
  cpf TEXT NOT NULL,
  ojSelect TEXT,
  numeroProcessos TEXT
);

-- Tabela para armazenar órgãos julgadores personalizados
CREATE TABLE orgaos_julgadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  custom BOOLEAN DEFAULT TRUE
);

-- Índices para melhorar a performance das consultas
CREATE INDEX idx_jira_tickets_created_at ON jira_tickets(created_at DESC);
CREATE INDEX idx_orgaos_julgadores_codigo ON orgaos_julgadores(codigo);
```

## 4. Configurar políticas de acesso (RLS)

Para permitir acesso anônimo aos dados, configure as políticas de Row Level Security:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE jira_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orgaos_julgadores ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo
CREATE POLICY "Permitir acesso anônimo para leitura de tickets" 
ON jira_tickets FOR SELECT TO anon USING (true);

CREATE POLICY "Permitir acesso anônimo para inserção de tickets" 
ON jira_tickets FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Permitir acesso anônimo para leitura de OJs" 
ON orgaos_julgadores FOR SELECT TO anon USING (true);

CREATE POLICY "Permitir acesso anônimo para inserção de OJs" 
ON orgaos_julgadores FOR INSERT TO anon WITH CHECK (true);
```

## 5. Obter as credenciais de API

1. No painel do Supabase, vá para "Settings" (Configurações) no menu lateral
2. Clique em "API"
3. Copie os valores de:
   - URL: `https://[seu-projeto-id].supabase.co`
   - anon/public key: `sua-chave-anônima`

## 6. Configurar o arquivo supabase.js

Abra o arquivo `supabase.js` no seu projeto e substitua as credenciais:

```javascript
// Credenciais do Supabase - substitua com as suas próprias do projeto Supabase
const SUPABASE_URL = 'https://[seu-projeto-id].supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anônima';
```

## 7. Executando o servidor local

O projeto inclui um servidor Node.js simples para facilitar o desenvolvimento local. Para executá-lo:

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Passos para executar
1. Abra o terminal na pasta do projeto
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm start
   ```
   Ou, para desenvolvimento com reinicialização automática:
   ```
   npm run dev
   ```
4. Acesse a aplicação em seu navegador: `http://localhost:3000`

## 8. Testar a conexão

1. Acesse a aplicação no navegador (usando o servidor local ou outro servidor web)
2. Preencha o formulário e clique em "Gerar JIRA"
3. Verifique no painel do Supabase se os dados foram salvos na tabela `jira_tickets`
4. Clique no botão "Histórico" para ver os chamados salvos

## Solução de problemas

### CORS (Cross-Origin Resource Sharing)

Se você estiver tendo problemas de CORS ao acessar o Supabase, você pode:

1. Usar o servidor Node.js incluído no projeto
2. Adicionar seu domínio local à lista de origens permitidas no Supabase:
   - Vá para "Settings" > "API" > "Configuration"
   - Adicione `http://localhost:3000` (ou a porta que estiver usando) à lista de "Additional allowed origins"

### Erros de autenticação

Se você estiver vendo erros como "JWT must be provided", verifique:

1. Se as credenciais (URL e chave anônima) estão corretas
2. Se as políticas RLS foram configuradas corretamente

## Recursos adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Referência da API JavaScript](https://supabase.com/docs/reference/javascript/introduction)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 