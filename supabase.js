// Configuração do Supabase para o Gerador de JIRA do NAPJe
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Credenciais do Supabase - já configuradas com seu projeto
const SUPABASE_URL = 'https://wyorhicllbdoxxdnuefa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5b3JoaWNsbGJkb3h4ZG51ZWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTUyODksImV4cCI6MjA2NTMzMTI4OX0.LF-_XziJ399K0wgwbttDfKP7n-EvFkOA8hp5x5wNkBA';

// Inicializar o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções para manipulação de dados da aplicação
export async function saveJiraTicket(ticketData) {
  const { data, error } = await supabase
    .from('jira_tickets')
    .insert([ticketData]);
  
  if (error) {
    console.error('Erro ao salvar ticket JIRA:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

export async function getJiraTickets() {
  const { data, error } = await supabase
    .from('jira_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar tickets JIRA:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

export async function getJiraTicketById(id) {
  const { data, error } = await supabase
    .from('jira_tickets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Erro ao buscar ticket JIRA:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

// Funções para Órgãos Julgadores
export async function saveCustomOJ(ojData) {
  const { data, error } = await supabase
    .from('orgaos_julgadores')
    .insert([ojData]);
  
  if (error) {
    console.error('Erro ao salvar OJ personalizado:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

export async function getCustomOJs() {
  const { data, error } = await supabase
    .from('orgaos_julgadores')
    .select('*')
    .eq('custom', true);
  
  if (error) {
    console.error('Erro ao buscar OJs personalizados:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

// Funções para Base de Conhecimento
export async function salvarArtigoBaseConhecimento(artigo) {
  const { data, error } = await supabase
    .from('base_conhecimento')
    .insert([artigo]);
  if (error) {
    console.error('Erro ao salvar artigo:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function buscarArtigosRecentesBaseConhecimento(limit = 5) {
  const { data, error } = await supabase
    .from('base_conhecimento')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Erro ao buscar artigos recentes:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function pesquisarArtigosBaseConhecimento(termo) {
  const { data, error } = await supabase
    .from('base_conhecimento')
    .select('*')
    .ilike('titulo', `%${termo}%`)
    .eq('ativo', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Erro ao pesquisar artigos:', error);
    return { success: false, error };
  }
  return { success: true, data };
} 