import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import fs from 'fs';

// Configuração do Supabase
const SUPABASE_URL = 'https://wyorhicllbdoxxdnuefa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5b3JoaWNsbGJkb3h4ZG51ZWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTUyODksImV4cCI6MjA2NTMzMTI4OX0.LF-_XziJ399K0wgwbttDfKP7n-EvFkOA8hp5x5wNkBA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para processar o conteúdo do PDF e extrair artigos
function processarConteudoPDF(conteudo) {
    const linhas = conteudo.split('\n');
    const artigos = [];
    let artigoAtual = null;
    let linhaAtual = '';
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        
        // Detectar títulos (linhas com apenas letras maiúsculas)
        if (linha.match(/^[A-ZÁÊÔ][A-ZÁÊÔ\s]*$/) && linha.length > 3) {
            // Salvar artigo anterior se existir
            if (artigoAtual) {
                artigoAtual.conteudo = linhaAtual.trim();
                if (artigoAtual.conteudo && artigoAtual.titulo) {
                    artigos.push(artigoAtual);
                }
            }
            
            // Iniciar novo artigo
            artigoAtual = {
                titulo: linha,
                conteudo: '',
                autor: 'NAPJe - Núcleo de Apoio PJe',
                tags: extrairTags(linha),
                ativo: true
            };
            linhaAtual = '';
        } else if (artigoAtual && linha) {
            // Adicionar conteúdo ao artigo atual
            linhaAtual += linha + '\n';
        }
    }
    
    // Salvar último artigo
    if (artigoAtual && linhaAtual.trim()) {
        artigoAtual.conteudo = linhaAtual.trim();
        if (artigoAtual.conteudo && artigoAtual.titulo) {
            artigos.push(artigoAtual);
        }
    }
    
    return artigos;
}

// Função para extrair tags relevantes do título
function extrairTags(titulo) {
    const tags = [];
    
    // Tags baseadas em palavras-chave
    const palavrasChave = {
        'PROCESSO': ['processo', 'processual'],
        'ERRO': ['erro', 'falha', 'bug'],
        'ASSINATURA': ['assinatura', 'certificado'],
        'CHAMADO': ['chamado', 'ticket'],
        'USUÁRIO': ['usuário', 'user', 'perfil'],
        'SISTEMA': ['sistema', 'pje'],
        'CADASTRO': ['cadastro', 'cadastral'],
        'DOCUMENTO': ['documento', 'anexo'],
        'MAGISTRADO': ['magistrado', 'juiz'],
        'VARA': ['vara', 'tribunal'],
        'EXECUÇÃO': ['execução', 'execucao'],
        'DEPENDÊNCIA': ['dependência', 'dependencia'],
        'ARQUIVAMENTO': ['arquivamento', 'arquivo']
    };
    
    const tituloLower = titulo.toLowerCase();
    
    for (const [tag, palavras] of Object.entries(palavrasChave)) {
        if (palavras.some(palavra => tituloLower.includes(palavra))) {
            tags.push(tag);
        }
    }
    
    // Sempre adicionar tag do sistema
    tags.push('PJe');
    
    return [...new Set(tags)]; // Remover duplicatas
}

// Função principal para popular a base de conhecimento
async function popularBaseConhecimento() {
    try {
        console.log('📖 Lendo conteúdo do PDF...');
        const conteudo = fs.readFileSync('/tmp/kb-content.txt', 'utf-8');
        
        console.log('🔍 Processando conteúdo...');
        const artigos = processarConteudoPDF(conteudo);
        
        console.log(`📝 Encontrados ${artigos.length} artigos`);
        
        // Salvar artigos no Supabase
        let salvos = 0;
        for (const artigo of artigos) {
            try {
                const { data, error } = await supabase
                    .from('base_conhecimento')
                    .insert([artigo]);
                
                if (error) {
                    console.error(`❌ Erro ao salvar "${artigo.titulo}":`, error.message);
                } else {
                    salvos++;
                    console.log(`✅ Salvo: ${artigo.titulo}`);
                }
            } catch (err) {
                console.error(`❌ Erro inesperado ao salvar "${artigo.titulo}":`, err.message);
            }
        }
        
        console.log(`\n🎉 Processo concluído! ${salvos}/${artigos.length} artigos salvos na base de conhecimento.`);
        
    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

// Executar
popularBaseConhecimento();