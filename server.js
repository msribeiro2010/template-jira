// Servidor HTTP simples para o Gerador de JIRA do NAPJe
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Tipos MIME para diferentes extensões de arquivo
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Criar o servidor HTTP
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Tratar a URL raiz
  let filePath = req.url === '/' 
    ? path.join(__dirname, 'index.html') 
    : path.join(__dirname, req.url);
  
  // Obter a extensão do arquivo
  const extname = path.extname(filePath);
  
  // Tipo de conteúdo padrão
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Ler o arquivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Página não encontrada
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        });
      } else {
        // Erro do servidor
        res.writeHead(500);
        res.end(`Erro do Servidor: ${err.code}`);
      }
    } else {
      // Sucesso
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
  console.log('Pressione Ctrl+C para parar o servidor');
}); 