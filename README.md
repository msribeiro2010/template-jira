# Sistema NAPJe - Gerador de JIRA para Sustentação PJe

Sistema web para automatizar a criação de chamados JIRA para a Sustentação do PJe do TRT15.

## 🚀 Funcionalidades

### ✅ Formulário Completo
- **Descrição do Problema**: Campo de notas para descrição detalhada
- **Informações do Chamado**: Número do chamado interno, servidor responsável
- **Classificação**: Tipo de pendência (Incidente, Defeito, Melhoria, Dúvida)
- **Configurações**: Versão do sistema, urgência, subsistema, ambiente
- **Dados do Usuário**: Perfil, nome completo e CPF

### 🔍 Sistema de Busca de OJs
- **1º Grau**: Lista de Varas do Trabalho
- **2º Grau**: Gabinetes e órgãos baseados no arquivo fornecido
- **Busca Inteligente**: Por código ou nome do órgão
- **Detecção Automática**: Extrai OJ do número do processo
- **Criação de Novos OJs**: Permite adicionar órgãos não listados

### 📋 Assuntos Padronizados
- Lista de 31 assuntos mais comuns
- Baseado em sistemas similares de TRT
- Facilita a categorização dos chamados

### ✨ Recursos Avançados
- **Validação em Tempo Real**: CPF, telefone e campos obrigatórios
- **Formatação Automática**: CPF e telefone
- **Interface Responsiva**: Funciona em desktop e mobile
- **Cópia Automática**: JIRA formatado para área de transferência
- **Histórico de Chamados**: Armazenamento de todos os chamados gerados
- **Banco de Dados Supabase**: Persistência de dados na nuvem

## 🎯 Como Usar

1. **Configure o Supabase** seguindo as instruções em [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. **Abra o arquivo `index.html`** no navegador usando um servidor local (como Live Server)
3. **Preencha os dados** do usuário afetado
4. **Descreva o problema** no campo de notas
5. **Selecione o subsistema** (1º Grau, 2º Grau ou ambos)
6. **Busque o OJ** digitando código ou nome
7. **Complete os campos** obrigatórios
8. **Clique em "Gerar JIRA"**
9. **Copie o resultado** para o sistema de chamados
10. **Acesse o histórico** clicando no botão "Histórico"

## 📁 Estrutura do Projeto

```
template-jira/
├── index.html          # Página principal
├── historico.html      # Página de histórico de chamados
├── styles.css          # Estilos da interface
├── script.js           # Lógica principal do sistema
├── data.js             # Dados dos OJs e assuntos
├── supabase.js         # Configuração e funções do Supabase
├── SUPABASE_SETUP.md   # Instruções para configuração do Supabase
└── README.md           # Este arquivo
```

## 🔧 Configurações

### Versão do Sistema
- **Padrão**: 2.13.6
- **Editável**: Pode ser alterada conforme necessário

### Urgência
- **4**: Prioridade normal
- **5**: Prioridade alta

### Subsistemas
- **1º Grau**: Varas do Trabalho
- **2º Grau**: Gabinetes e Câmaras
- **1º e 2º Graus**: Ambos os subsistemas

### Ambientes
- **Produção**: Ambiente de produção
- **Incidentes**: Ambiente de incidentes
- **Homologação**: Ambiente de testes/homologação

## 👥 Perfis de Usuário
- Diretor
- Assessor  
- Servidor
- Estagiário
- Perito
- Procurador
- Magistrado

## 🏛️ Órgãos Julgadores

### 2º Grau (430 órgãos)
Baseado no arquivo `2o_grau.csv` fornecido, incluindo:
- Gabinetes de Desembargadores
- Câmaras (1ª a 11ª)
- SDI (Seções de Dissídios Individuais)
- SDC (Seção de Dissídios Coletivos)
- Órgão Especial
- Tribunal Pleno

### 1º Grau (50 órgãos simulados)
Varas do Trabalho das principais cidades:
- Campinas (20 varas)
- Sorocaba (10 varas)
- Santos (10 varas)
- Ribeirão Preto (10 varas)

## 🔍 Recursos de Busca

### Busca por Texto
- Digite código ou nome do órgão
- Busca parcial (mínimo 2 caracteres)
- Resultados filtrados em tempo real

### Detecção por Processo
- Cole números de processo no campo correspondente
- Sistema extrai automaticamente o código do OJ dos últimos 4 dígitos
- Formato 1º grau: 0010726-04.2025.5.15.0070 (OJ = 70)
- Formato 2º grau: NNNNNNN-DD.AAAA.J.TR.OOOO

### Criação de Novos OJs
- Botão "+ Criar Novo OJ"
- Modal com campos código e nome
- Validação de duplicatas
- Adição à lista de busca
- Armazenamento no Supabase para uso futuro

## 📱 Interface Responsiva

O sistema adapta-se a diferentes tamanhos de tela:
- **Desktop**: Layout em duas colunas
- **Tablet**: Campos reorganizados
- **Mobile**: Layout em coluna única

## ⚡ Validações

### Campos Obrigatórios
- Notas (Descrição)
- Chamado do NAPJe
- Servidor Responsável
- Tipo de Pendência
- Resumo
- Versão
- Urgência
- Subsistema
- Ambiente
- Perfil
- Nome Completo
- CPF

### Validações Especiais
- **CPF**: Algoritmo completo de validação
- **Feedback Visual**: Cores indicam status de validação

## 🎨 Design

### Cores
- **Primária**: Azul corporativo (#2c5aa0)
- **Secundária**: Cinza claro (#f8f9fa)
- **Sucesso**: Verde (#28a745)
- **Erro**: Vermelho (#dc3545)

### Logo NAPJe
- Ícone de engrenagem
- Nome "NAPJe" em destaque
- Subtítulo "Núcleo de Apoio PJe"

## 📄 Formato do JIRA Gerado

```
=== JIRA GERADO PELO SISTEMA NAPJe ===
Data/Hora: [timestamp]

DESCRIÇÃO DO PROBLEMA:
[descrição detalhada]

CHAMADO DO NAPJe: [número]
SERVIDOR RESPONSÁVEL: [nome]

TIPO DE PENDÊNCIA: [tipo]
RESUMO: [assunto padronizado]
VERSÃO: [versão]
URGÊNCIA: [4 ou 5]

SUBSISTEMA: [1º/2º/ambos]
AMBIENTE: [Produção/Incidentes/Homologação]

PERFIL DO USUÁRIO: [nome]/[perfil]/[cpf]/[nome_oj]

ÓRGÃO JULGADOR: [código - nome]

NÚMEROS DOS PROCESSOS:
[lista de processos]

=== FIM DO JIRA ===
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, Animations
- **JavaScript ES6+**: Funcionalidades modernas
- **Font Awesome**: Ícones
- **Responsive Design**: Mobile-first
- **Supabase**: Banco de dados PostgreSQL na nuvem
- **ES Modules**: Importação e exportação de módulos JavaScript

## 📦 Banco de Dados Supabase

O sistema utiliza o Supabase como banco de dados para:

- **Armazenamento de Chamados**: Todos os JIRAs gerados são salvos
- **Histórico Completo**: Visualização de chamados anteriores
- **Órgãos Personalizados**: Persistência de OJs criados pelos usuários
- **Acesso Anônimo**: Não requer autenticação para uso básico

Para configurar o Supabase, siga as instruções detalhadas em [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## 📞 Suporte

Sistema desenvolvido para o TRT15 - Tribunal Regional do Trabalho da 15ª Região.

---

**NAPJe - Núcleo de Apoio PJe** | *Automatizando a criação de chamados para a Sustentação do PJe*