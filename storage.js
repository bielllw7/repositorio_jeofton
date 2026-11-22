// Camada de dados: guarda tudo no localStorage do navegador
const DB = {
  ler(chave) { return JSON.parse(localStorage.getItem(chave) || '[]'); },
  salvar(chave, dados) { localStorage.setItem(chave, JSON.stringify(dados)); },
  id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
};
