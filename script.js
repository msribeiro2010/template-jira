import { assuntosPadronizados, assuntosPadronizadosTabela } from './data.js';
import { saveJiraTicket } from './supabase.js';

const CAMPOS_FIXOS = {
  status: 'Aberto',
  resolucaoAte: 'Em Branco',
  usuarioAfetado: 'Nucleo Apoiopje',
  telefone: '(19) 32362100',
  ramal: '2007',
  email: 'nucleoapoiopje@trt15.jus.br'
};

function gerarJiraTemplate(dados) {
  return `Status\n${CAMPOS_FIXOS.status}\nResolução até\n${CAMPOS_FIXOS.resolucaoAte}\nUsuário Afetado\n${CAMPOS_FIXOS.usuarioAfetado}\nTelefone\n${CAMPOS_FIXOS.telefone}\nRamal\n${CAMPOS_FIXOS.ramal}\nEmail\n${CAMPOS_FIXOS.email}\nNotas\n\n${dados.notas}\nData do Registro\n${dados.dataRegistro}\nChamado do NAPJe que originou a issue\n\n${dados.chamadoNapje}\n\n* Servidor responsável pela abertura da Issue\n\n${dados.servidorResponsavel}\n\n*Tipo de Pendência\n${dados.tipoPendencia}\n*Resumo\n\n${dados.resumo}\n\n*Versão\n\n${dados.versao}\n\n*Urgência\n\n${dados.urgencia}\n\n*Subsistema\n${dados.subsistema}\n*Ambiente\n${dados.ambiente}\n*Perfil/CPF/Nome completo do usuário\n\n${dados.nomeCompleto}/${dados.perfil}/${dados.cpf}/${dados.ojSelect || ''}\n\nNúmero dos processos\n\n${dados.numeroProcessos || ''}\n\nAnexos\n${dados.anexos || ''}`;
}

// Preencher o select de assuntos (Resumo) - agora agrupado por categoria
function preencherResumoAgrupado() {
  const resumoSelect = document.getElementById('resumo');
  if (!resumoSelect) return;
  resumoSelect.innerHTML = '<option value="">Selecione um assunto...</option>';
  assuntosPadronizadosTabela.forEach(grupo => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = grupo.categoria;
    grupo.assuntos.forEach(assunto => {
      const opt = document.createElement('option');
      opt.value = assunto;
      opt.textContent = assunto;
      optgroup.appendChild(opt);
    });
    resumoSelect.appendChild(optgroup);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  preencherResumoAgrupado();

  // Ao clicar no botão de busca, mostrar painel agrupado
  const toggleBuscaBtn = document.getElementById('toggleBuscaBtn');
  const resumoSelect = document.getElementById('resumo');
  const resumoInput = document.getElementById('resumoInput');
  let painelResumo = null;

  if (toggleBuscaBtn) {
    toggleBuscaBtn.addEventListener('click', function() {
      if (painelResumo && painelResumo.parentNode) {
        painelResumo.remove();
        painelResumo = null;
        return;
      }
      painelResumo = document.createElement('div');
      painelResumo.className = 'painel-resumo-categorias';
      painelResumo.style.position = 'absolute';
      painelResumo.style.background = '#fff';
      painelResumo.style.border = '1px solid #ccc';
      painelResumo.style.zIndex = 1000;
      painelResumo.style.maxHeight = '300px';
      painelResumo.style.overflowY = 'auto';
      painelResumo.style.width = '400px';
      painelResumo.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      painelResumo.style.padding = '10px';

      assuntosPadronizadosTabela.forEach(grupo => {
        const cat = document.createElement('div');
        cat.style.marginBottom = '10px';
        const catTitle = document.createElement('div');
        catTitle.textContent = grupo.categoria;
        catTitle.style.fontWeight = 'bold';
        catTitle.style.marginBottom = '4px';
        cat.appendChild(catTitle);
        grupo.assuntos.forEach(assunto => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = assunto;
          btn.style.display = 'block';
          btn.style.width = '100%';
          btn.style.textAlign = 'left';
          btn.style.marginBottom = '2px';
          btn.style.background = '#f8f9fa';
          btn.style.border = '1px solid #eee';
          btn.style.borderRadius = '4px';
          btn.style.padding = '4px 8px';
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', function() {
            resumoSelect.value = assunto;
            if (resumoInput) resumoInput.value = assunto;
            painelResumo.remove();
            painelResumo = null;
          });
          cat.appendChild(btn);
        });
        painelResumo.appendChild(cat);
      });
      // Posicionar painel abaixo do botão
      const rect = toggleBuscaBtn.getBoundingClientRect();
      painelResumo.style.left = rect.left + 'px';
      painelResumo.style.top = (rect.bottom + window.scrollY) + 'px';
      document.body.appendChild(painelResumo);
    });
    // Fechar painel ao clicar fora
    document.addEventListener('click', function(e) {
      if (painelResumo && !painelResumo.contains(e.target) && e.target !== toggleBuscaBtn) {
        painelResumo.remove();
        painelResumo = null;
      }
    });
  }

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
        resumo: document.getElementById('resumo').value,
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