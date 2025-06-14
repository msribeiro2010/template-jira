import { assuntosPadronizados } from './data.js';

// Dados inline para teste
const assuntosPadronizadosTabela = [
  {
    categoria: "Acesso e Autenticação",
    assuntos: [
      "Acesso ao Sistema – Erro ao Carregar Painel",
      "Autenticação: Erro ao Consultar Dados",
      "Autenticação: Não foi Possível Realizar",
      "Usuário – Acesso Bloqueado – Solicita Desbloqueio",
      "Usuário – Erro de Acesso ao Sistema"
    ]
  },
  {
    categoria: "Assinatura e Certificação",
    assuntos: [
      "Assinador não Carrega – Não ativa o botão Entrar",
      "Assinatura de Acórdão – Erro",
      "Assinatura de Ata – Erro",
      "Ata de Audiência – Erro de Assinatura"
    ]
  },
  {
    categoria: "Documentos e Processos",
    assuntos: [
      "Documento – Sem Conteúdo",
      "Documento do Processo – Erro ao Abrir",
      "Documento do Processo – Erro ao Salvar"
    ]
  }
];

// Importar função do supabase (comentado para teste)
// import { saveJiraTicket } from './supabase.js';

// Função mock para teste
async function saveJiraTicket(dados) {
  console.log('Dados do ticket:', dados);
  return { success: true };
}

// Função global para selecionar assunto
window.selecionarAssunto = function(assunto) {
  const resumoInput = document.getElementById('resumoInput');
  const painel = document.getElementById('painelAssuntos');
  const toggleBtn = document.getElementById('toggleBuscaBtn');

  if (resumoInput) {
    resumoInput.value = assunto;
  }
  if (painel) {
    painel.remove();
  }
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
  }
};

const CAMPOS_FIXOS = {
  status: 'Aberto',
  resolucaoAte: 'Em Branco',
  usuarioAfetado: 'Nucleo Apoiopje',
  telefone: '(19) 32362100',
  ramal: '2007',
  email: 'nucleoapoiopje@trt15.jus.br'
};

function gerarJiraTemplate(dados) {
  return `─────────────────────────────\nNOTAS\n─────────────────────────────\n${dados.notas}\n\n─────────────────────────────\nDATA DO REGISTRO\n─────────────────────────────\n${dados.dataRegistro}\n\n─────────────────────────────\nCHAMADO DO NAPJe\n─────────────────────────────\n${dados.chamadoNapje}\n\n─────────────────────────────\nSERVIDOR RESPONSÁVEL\n─────────────────────────────\n${dados.servidorResponsavel}\n\n─────────────────────────────\nTIPO DE PENDÊNCIA\n─────────────────────────────\n${dados.tipoPendencia}\n\n─────────────────────────────\nRESUMO\n─────────────────────────────\n${dados.resumo}\n\n─────────────────────────────\nVERSÃO\n─────────────────────────────\n${dados.versao}\n\n─────────────────────────────\nURGÊNCIA\n─────────────────────────────\n${dados.urgencia}\n\n─────────────────────────────\nSUBSISTEMA\n─────────────────────────────\n${dados.subsistema}\n\n─────────────────────────────\nAMBIENTE\n─────────────────────────────\n${dados.ambiente}\n\n─────────────────────────────\nPERFIL/CPF/NOME COMPLETO DO USUÁRIO\n─────────────────────────────\n${dados.nomeCompleto} / ${dados.perfil} / ${dados.cpf} / ${dados.ojSelect || ''}\n\n─────────────────────────────\nÓRGÃO JULGADOR\n─────────────────────────────\n${dados.ojSelect || ''}\n\n─────────────────────────────\nNÚMEROS DOS PROCESSOS\n─────────────────────────────\n${dados.numeroProcessos || ''}\n\n─────────────────────────────`;
}

// Substituir o select de resumo por um autocomplete customizado
function criarAutocompleteResumo() {
  const resumoContainer = document.querySelector('.resumo-container');
  if (!resumoContainer) return;

  // Remover select antigo se existir
  const oldSelect = document.getElementById('resumo');
  if (oldSelect) oldSelect.remove();

  // Obter input de texto existente
  let resumoInput = document.getElementById('resumoInput');
  if (!resumoInput) return;

  // Painel de sugestões
  let painelResumo = null;

  function mostrarPainel(filtro = '') {
    if (painelResumo && painelResumo.parentNode) painelResumo.remove();
    painelResumo = document.createElement('div');
    painelResumo.className = 'painel-resumo-categorias';
    painelResumo.style.position = 'absolute';
    painelResumo.style.background = '#fff';
    painelResumo.style.zIndex = 1000;
    painelResumo.style.maxHeight = '80vh';
    painelResumo.style.overflowY = 'auto';
    painelResumo.style.minWidth = '340px';
    painelResumo.style.maxWidth = '420px';
    painelResumo.style.boxShadow = '0 4px 24px rgba(44,90,160,0.13)';
    painelResumo.style.border = '1.5px solid #2c5aa0';
    painelResumo.style.padding = '18px 18px 10px 18px';

    // Usar a lista completa de assuntos
    if (!assuntosPadronizados || !Array.isArray(assuntosPadronizados)) {
      painelResumo.innerHTML = '<div style="color:#888">Dados não carregados. Recarregue a página.</div>';
      document.body.appendChild(painelResumo);
      return;
    }

    // Filtrar assuntos por texto digitado
    const assuntosFiltrados = assuntosPadronizados.filter(a => a.toLowerCase().includes(filtro.toLowerCase()));
    if (assuntosFiltrados.length > 0) {
      assuntosFiltrados.forEach(assunto => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = assunto;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';
        btn.style.marginBottom = '2px';
        btn.style.background = '#f4f7fb';
        btn.style.border = '1px solid #e0e6ed';
        btn.style.borderRadius = '6px';
        btn.style.padding = '6px 10px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '0.98rem';
        btn.style.color = '#2c5aa0';
        btn.addEventListener('click', function() {
          resumoInput.value = assunto;
          painelResumo.remove();
          painelResumo = null;
          // Remover classe active do botão da lupa
          const toggleBtn = document.getElementById('toggleBuscaBtn');
          if (toggleBtn) toggleBtn.classList.remove('active');
        });
        btn.addEventListener('mousedown', e => e.preventDefault());
        painelResumo.appendChild(btn);
      });
    } else {
      painelResumo.innerHTML = '<div style="color:#888">Nenhum assunto encontrado.</div>';
    }
    // Posicionar painel abaixo do input
    const rect = resumoInput.getBoundingClientRect();
    painelResumo.style.left = rect.left + 'px';
    painelResumo.style.top = (rect.bottom + window.scrollY) + 'px';
    document.body.appendChild(painelResumo);
  }

  resumoInput.addEventListener('focus', function() {
    mostrarPainel(resumoInput.value);
    const toggleBtn = document.getElementById('toggleBuscaBtn');
    if (toggleBtn) toggleBtn.classList.add('active');
  });
  resumoInput.addEventListener('input', function() {
    mostrarPainel(resumoInput.value);
    const toggleBtn = document.getElementById('toggleBuscaBtn');
    if (toggleBtn) toggleBtn.classList.add('active');
  });
  // Fechar painel ao clicar fora
  document.addEventListener('click', function(e) {
    if (painelResumo && !painelResumo.contains(e.target) && e.target !== resumoInput) {
      painelResumo.remove();
      painelResumo = null;
      // Remover classe active do botão da lupa
      const toggleBtn = document.getElementById('toggleBuscaBtn');
      if (toggleBtn) toggleBtn.classList.remove('active');
    }
  });

  // Funcionalidade do botão da lupa
  const toggleBuscaBtn = document.getElementById('toggleBuscaBtn');
  if (toggleBuscaBtn) {
    toggleBuscaBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (painelResumo && painelResumo.parentNode) {
        // Se o painel está aberto, fechar
        painelResumo.remove();
        painelResumo = null;
        toggleBuscaBtn.classList.remove('active');
      } else {
        // Se o painel está fechado, abrir
        mostrarPainel(resumoInput.value);
        toggleBuscaBtn.classList.add('active');
        resumoInput.focus();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Implementação simples e direta do botão da lupa
  const toggleBtn = document.getElementById('toggleBuscaBtn');
  const resumoInput = document.getElementById('resumoInput');

  if (toggleBtn && resumoInput) {
    console.log('Elementos encontrados, configurando eventos...');

    // Evento do botão da lupa
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Botão da lupa clicado!');
      alert('Botão da lupa funcionando!');

      // Criar painel simples
      let painel = document.getElementById('painelAssuntos');
      if (painel) {
        painel.remove();
        toggleBtn.classList.remove('active');
        return;
      }

      // Criar novo painel
      painel = document.createElement('div');
      painel.id = 'painelAssuntos';
      painel.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #2c5aa0;
        border-radius: 8px;
        padding: 15px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
      `;

      // Adicionar conteúdo
      painel.innerHTML = `
        <div style="font-weight: bold; color: #2c5aa0; margin-bottom: 10px;">Acesso e Autenticação</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Acesso ao Sistema – Erro ao Carregar Painel')">Acesso ao Sistema – Erro ao Carregar Painel</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Usuário – Erro de Acesso ao Sistema')">Usuário – Erro de Acesso ao Sistema</div>

        <div style="font-weight: bold; color: #2c5aa0; margin: 15px 0 10px 0;">Documentos e Processos</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Documento – Sem Conteúdo')">Documento – Sem Conteúdo</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Documento do Processo – Erro ao Abrir')">Documento do Processo – Erro ao Abrir</div>

        <div style="font-weight: bold; color: #2c5aa0; margin: 15px 0 10px 0;">Assinatura e Certificação</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Assinador não Carrega – Não ativa o botão Entrar')">Assinador não Carrega – Não ativa o botão Entrar</div>
        <div style="margin-bottom: 5px; padding: 5px; background: #f4f7fb; border-radius: 4px; cursor: pointer;" onclick="selecionarAssunto('Assinatura de Acórdão – Erro')">Assinatura de Acórdão – Erro</div>
      `;

      // Posicionar painel
      const rect = resumoInput.getBoundingClientRect();
      painel.style.left = rect.left + 'px';
      painel.style.top = (rect.bottom + window.scrollY + 5) + 'px';

      document.body.appendChild(painel);
      toggleBtn.classList.add('active');
    });

    // Evento do input
    resumoInput.addEventListener('focus', function() {
      console.log('Input focado');
    });

    // Fechar painel ao clicar fora
    document.addEventListener('click', function(e) {
      const painel = document.getElementById('painelAssuntos');
      if (painel && !painel.contains(e.target) && e.target !== toggleBtn && e.target !== resumoInput) {
        painel.remove();
        toggleBtn.classList.remove('active');
      }
    });
  } else {
    console.error('Elementos não encontrados:', { toggleBtn, resumoInput });
  }

  criarAutocompleteResumo();

  // Formulário principal
  const form = document.getElementById('jiraForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const dados = {
        notas: document.getElementById('notas').value.trim(),
        chamadoNapje: document.getElementById('chamadoNapje').value.trim(),
        servidorResponsavel: document.getElementById('servidorResponsavel').value.trim(),
        tipoPendencia: document.getElementById('tipoPendencia').value,
        resumo: document.getElementById('resumoInput').value,
        versao: document.getElementById('versao') ? document.getElementById('versao').value : '2.13.6',
        urgencia: document.getElementById('urgencia') ? document.getElementById('urgencia').value : '4',
        subsistema: document.getElementById('subsistema') ? document.getElementById('subsistema').value : '',
        ambiente: document.getElementById('ambiente').value,
        perfil: document.getElementById('perfil').value,
        nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        ojSelect: document.getElementById('ojSelect') ? document.getElementById('ojSelect').value : '',
        numeroProcessos: document.getElementById('numeroProcessos').value.trim(),
        anexos: '',
        dataRegistro: new Date().toLocaleString('pt-BR')
      };
      await saveJiraTicket(dados);
      const jiraTexto = gerarJiraTemplate(dados);
      const resultadoContent = document.getElementById('resultadoContent');
      if (resultadoContent) {
        resultadoContent.textContent = jiraTexto;
        resultadoContent.style.display = 'block';
      }
      const resultadoModal = document.getElementById('resultadoModal');
      if (resultadoModal) resultadoModal.style.display = 'block';
    });
  }

  const copiarBtn = document.getElementById('copiarJira');
  if (copiarBtn) {
    copiarBtn.addEventListener('click', function() {
      const resultadoContent = document.getElementById('resultadoContent');
      if (resultadoContent) {
        navigator.clipboard.writeText(resultadoContent.textContent)
          .then(() => alert('JIRA copiado para a área de transferência!'));
      }
    });
  }

  const fecharBtn = document.getElementById('fecharResultado');
  if (fecharBtn) {
    fecharBtn.addEventListener('click', function() {
      const resultadoModal = document.getElementById('resultadoModal');
      if (resultadoModal) resultadoModal.style.display = 'none';
    });
  }
}); 