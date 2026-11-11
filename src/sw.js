// Copia offline dell'app. Cambia VERSIONE a ogni aggiornamento.
const VERSIONE='budget-v65';
const FILES=['./','./index.html','./manifest.webmanifest','./manifest-scura.webmanifest','./apple-touch-icon-b2.png','./apple-touch-icon-b2-scura.png','./icon-192-b2.png','./icon-512-b2.png','./icon-192-b2-scura.png','./icon-512-b2-scura.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSIONE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSIONE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('script.google'))return; // i dati vanno sempre in rete
  if(u.origin===location.origin){
    // app: prima la rete (per avere gli aggiornamenti), se offline la copia salvata
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(VERSIONE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else{
    // font e libreria Excel: copia salvata se c'è
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(VERSIONE).then(x=>x.put(e.request,c));return res})));
  }
});
