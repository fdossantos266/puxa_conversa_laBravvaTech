// Nome do cache. Mude o "v1" sempre que alterar o site,
// senão os usuários continuam vendo a versão antiga guardada.
const CACHE = 'puxa-conversa-v4';

// Arquivos guardados na instalação
const ARQUIVOS = [
    '/index.html','/manifest.json','/','/icon-512.png','/icon-192.png','/apple-touch-icon.png'
];

// 1. INSTALL: abre o cache e guarda todos os arquivos da lista
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS))
  );
});

// 2. ACTIVATE: apaga qualquer cache com nome diferente do atual
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      )
    )
  );
});

// 3. FETCH: procura no cache primeiro; se não achar, busca na
// internet e guarda uma cópia para a próxima vez
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((salvo) => {
      if (salvo) return salvo;

      return fetch(event.request).then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copia));
        return resposta;
      });
    })
  );
});

// 4. MESSAGE: quando a página pedir, pula a espera e assume o controle
self.addEventListener('message', (event) => {
  if (event.data === 'ATUALIZAR') self.skipWaiting();
});
