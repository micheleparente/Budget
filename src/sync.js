const DEFAULT_URL='https://script.google.com/macros/s/AKfycbzmAef7RJdhtM9Dn0NoSxx6912wUaCX35xGAJ1U8Yl8ChiYU-QmF8G0JEFm39SzCC0_/exec';
// ---------- dati: Google Sheet tramite Apps Script, con copia locale e coda offline ----------
const LS={api:'budget-api',cache:'budget-cache',queue:'budget-queue'};
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const SYNC={api:lsGet(LS.api,null),raw:lsGet(LS.cache,null),queue:lsGet(LS.queue,[]),busy:false,last:null,err:null,online:navigator.onLine};
const MB_=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
const nz=v=>v===null||v===undefined||v===''?null:Number(v);
const st=v=>v===null||v===undefined?'':String(v);

function rawToD(raw){
  raw=raw||{};
  const catAll=(raw.categorie||[]).filter(c=>c.id);const entrate=catAll.filter(c=>st(c.tipo)==='entrata').map(c=>({id:st(c.id),nome:st(c.nome),ordine:nz(c.ordine)||0}));
  const categorie=catAll.filter(c=>st(c.tipo)!=='entrata').map(c=>({id:st(c.id),nome:st(c.nome),tipo:st(c.tipo)||'variabile',ordine:nz(c.ordine)||0,dal:nz(c.dal),al:nz(c.al),noprev:c.noprev===true||String(c.noprev).toUpperCase()==='TRUE'}));
  const metodi=(raw.metodi||[]).map(m=>st(m.nome)).filter(Boolean);
  const riporti={};(raw.riporti||[]).forEach(r=>{if(r.anno!=null)riporti[String(nz(r.anno))]=nz(r.importo)||0});
  const movimenti=(raw.movimenti||[]).filter(x=>x.id).map(x=>{const o={id:st(x.id),anno:nz(x.anno),mese:nz(x.mese),data:x.data?st(x.data):null,tipo:st(x.tipo),categoria:x.categoria?st(x.categoria):null,descrizione:st(x.descrizione),importo:nz(x.importo)||0,metodo:x.metodo?st(x.metodo):null};
    if(x.gruppo){o.gruppo=st(x.gruppo);o.quota=st(x.quota);o.totale=nz(x.totale)}return o});
  const previsioni=(raw.previsioni||[]).filter(x=>x.id).map(x=>{const eff={};MB_.forEach((m,i)=>{const v=nz(x['Eff '+m]);if(v!=null)eff[String(i+1)]=v});
    return {id:st(x.id),scadenza:x.scadenza===true||String(x.scadenza).toUpperCase()==='TRUE',anno:nz(x.anno),categoria:st(x.categoria),descrizione:st(x.descrizione),tipo:st(x.tipo)||'certo',giorno:nz(x.giorno),metodo:x.metodo?st(x.metodo):null,serie:x.serie?st(x.serie):null,freq:nz(x.freq),rate:x.rate===true||String(x.rate).toUpperCase()==='TRUE',origine:x.origine?st(x.origine):null,importi:MB_.map(m=>nz(x[m])),effettivi:eff}});
  const stipendi=(raw.stipendi||[]).filter(x=>x.id).map(x=>({id:st(x.id),anno:nz(x.anno),mese:nz(x.mese),netto:nz(x.netto),lordo:nz(x.lordo),stato:st(x.stato)||'confermato'}));
  return {config:{nome:'Michele Parente',categorie,entrate,metodi,riporti},movimenti,previsioni,stipendi};
}
function prevToRow(d){const r={anno:d.anno,categoria:d.categoria,descrizione:d.descrizione,tipo:d.tipo,giorno:d.giorno??null,metodo:d.metodo??null,scadenza:!!d.scadenza,serie:d.serie??null,freq:d.freq??null,rate:!!d.rate,origine:d.origine??null};
  MB_.forEach((m,i)=>{r[m]=d.importi?d.importi[i]:null;const e=d.effettivi&&d.effettivi[String(i+1)];r['Eff '+m]=e==null?null:e});return r}
function movToRow(d){return {anno:d.anno,mese:d.mese,data:d.data||null,tipo:d.tipo,categoria:d.categoria||null,descrizione:d.descrizione||'',importo:d.importo,metodo:d.metodo||null,gruppo:d.gruppo||null,quota:d.quota||null,totale:d.totale??null}}
function configOps(c){return [
  {op:'replace',col:'categorie',rows:(c.categorie||[]).map(x=>({id:x.id,nome:x.nome,tipo:x.tipo,ordine:x.ordine,dal:x.dal??null,al:x.al??null,noprev:!!x.noprev})).concat((c.entrate||[]).map(x=>({id:x.id,nome:x.nome,tipo:'entrata',ordine:x.ordine,dal:null,al:null})))},
  {op:'replace',col:'metodi',rows:(c.metodi&&c.metodi.length?c.metodi:METODI_DEF).map(n=>({nome:n}))},
  {op:'replace',col:'riporti',rows:Object.entries(c.riporti||{}).map(([a,v])=>({anno:+a,importo:v}))}]}

// applica le operazioni alla copia locale (subito, anche offline)
function applyLocal(raw,ops){
  raw=JSON.parse(JSON.stringify(raw||{movimenti:[],previsioni:[],stipendi:[],categorie:[],metodi:[],riporti:[]}));
  ops.forEach(o=>{raw[o.col]=raw[o.col]||[];
    if(o.op==='replace'){raw[o.col]=o.rows.slice();return}
    const i=raw[o.col].findIndex(r=>String(r.id)===String(o.id));
    if(o.op==='delete'){if(i>=0)raw[o.col].splice(i,1);return}
    const row=Object.assign({},o.data,{id:o.id});if(i>=0)raw[o.col][i]=row;else raw[o.col].push(row)});
  return raw;
}
function publish(){S.D=rawToD(SYNC.raw);S.ready=true;schedule()}
async function enqueue(ops){
  SYNC.raw=applyLocal(SYNC.raw,ops);lsSet(LS.cache,SYNC.raw);
  SYNC.queue=SYNC.queue.concat(ops);lsSet(LS.queue,SYNC.queue);
  publish();if(!SYNC.hold)flush();
}
// più scritture in un solo invio (tutto o niente)
async function batch(fn){SYNC.hold=(SYNC.hold||0)+1;try{return await fn()}finally{SYNC.hold--;if(!SYNC.hold)flush()}}
async function call(method,body){
  const u=SYNC.api.url;
  const r=method==='GET'?await fetch(u+(u.includes('?')?'&':'?')+'key='+encodeURIComponent(SYNC.api.key)+'&t='+Date.now(),{redirect:'follow'})
    :await fetch(u,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({key:SYNC.api.key},body))});
  if(!r.ok)throw new Error('http '+r.status);
  const j=await r.json();if(!j.ok)throw new Error(j.error||'errore');return j;
}
async function flush(){
  if(!SYNC.api)return;
  if(SYNC.busy)return new Promise(r=>setTimeout(()=>r(flush()),400));
  SYNC.busy=true;
  try{
    if(SYNC.queue.length){const sent=SYNC.queue.slice();const j=await call('POST',{ops:sent});
      SYNC.queue=SYNC.queue.slice(sent.length);lsSet(LS.queue,SYNC.queue);
      SYNC.raw=applyLocal(j.data,SYNC.queue);}
    else{const j=await call('GET');SYNC.raw=applyLocal(j.data,SYNC.queue)}
    lsSet(LS.cache,SYNC.raw);SYNC.last=new Date();SYNC.err=null;publish();
  }catch(e){SYNC.err=String(e.message||e);schedule()}
  finally{SYNC.busy=false;if(SYNC.queue.length&&!SYNC.err)setTimeout(flush,300)}
}
// API usata dall'app (stessa forma di prima)
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
async function put(path,data){
  const [col,id]=path.split('/');
  if(col==='config'){await enqueue(configOps(data));return}
  const row=col==='previsioni'?prevToRow(data):col==='movimenti'?movToRow(data):data;
  await enqueue([{op:'set',col,id,data:row}]);
  if(!navigator.onLine)toast('Salvato sul telefono: lo invio appena torni online');
}
async function del(path){const [col,id]=path.split('/');await enqueue([{op:'delete',col,id}])}
async function saveConfig(c){await put('config/main',c)}
let started=false;
function start(){
  if(SYNC.raw)publish();
  if(!started){started=true;splashStart()}
  if(!SYNC.api){S.ready=true;S.view='collega';schedule();splashEnd();return}
  flush().then(()=>splashEnd(SYNC.err?(SYNC.raw?'Non riesco a sincronizzare: ti mostro i dati salvati sul telefono':'Non riesco a raggiungere i dati'):null));
  setInterval(()=>{if(document.visibilityState==='visible')flush()},60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flush()});
  window.addEventListener('online',()=>{SYNC.online=true;flush();schedule()});
  window.addEventListener('offline',()=>{SYNC.online=false;schedule()});
}
async function collega(url,key){
  SYNC.api={url:url.trim(),key:key.trim()};
  try{const j=await call('GET');lsSet(LS.api,SYNC.api);SYNC.raw=applyLocal(j.data,SYNC.queue);lsSet(LS.cache,SYNC.raw);SYNC.last=new Date();SYNC.err=null;publish();setInterval(()=>{if(document.visibilityState==='visible')flush()},60000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flush()});checkRiporto();return true}
  catch(e){SYNC.api=lsGet(LS.api,null);throw e}
}
function syncLine(){
  if(!SYNC.api)return 'Non collegato';
  const q=SYNC.queue.length;
  if(!navigator.onLine)return `Offline · ${q?q+' modifiche da inviare':'dati salvati sul telefono'}`;
  if(SYNC.err)return `Sincronizzazione non riuscita (${SYNC.err}) · ${q} in attesa`;
  if(SYNC.busy||q)return 'Sincronizzo…';
  return SYNC.last?'Sincronizzato alle '+SYNC.last.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}):'Collegato';
}

// ---------- schermata di avvio ----------
const SPL={t0:Date.now(),done:false,timer:null};
function splashStep(pct,msg){const f=document.getElementById('splash-fill'),m=document.getElementById('splash-msg'),p=document.getElementById('splash-pct');if(f)f.style.width=pct+'%';if(p)p.textContent=Math.round(pct)+'%';if(m&&msg)m.textContent=msg}
function splashStart(){
  splashStep(15,SYNC.api?'Collego i tuoi dati…':'Avvio…');
  let p=15;SPL.timer=setInterval(()=>{p=Math.min(88,p+(88-p)*0.12);splashStep(p)},250);
  setTimeout(()=>{if(!SPL.done&&SYNC.raw)splashEnd(navigator.onLine?'Rete lenta: ti mostro i dati salvati sul telefono':'Offline: ti mostro i dati salvati sul telefono')},9000);
  setTimeout(()=>{if(!SPL.done)splashEnd()},15000);
}
function splashEnd(msg){
  if(SPL.done)return;SPL.done=true;clearInterval(SPL.timer);
  splashStep(100,msg||'Pronto');
  const wait=Math.max(0,1800-(Date.now()-SPL.t0));
  setTimeout(()=>{const el=document.getElementById('splash');if(!el)return;el.classList.add('out');setTimeout(()=>{el.remove();if(typeof applyTop==='function')applyTop()},400);checkRiporto()},wait+(msg?900:250));
}
// ---------- riporto: proposta al primo accesso del nuovo anno ----------
function checkRiporto(){
  return; // dal 10/11/2026 il riporto è automatico
  if(!SYNC.api||SYNC.err||!S.ready)return;
  const Yr=today().getFullYear(),key='budget-riporto-'+Yr;
  if(lsGet(key,null))return;
  const prev=Yr-1;
  const hasPrev=S.D.movimenti.some(x=>x.anno===prev)||S.D.previsioni.some(x=>x.anno===prev)||S.D.stipendi.some(x=>x.anno===prev);
  if(!hasPrev)return;
  const av=computeYear(S.D,prev,today()).mesi[11].avanzo;
  const cur=(cfg().riporti||{})[String(Yr)];
  if(cur!=null&&Math.abs(cur-av)<0.005){lsSet(key,'ok');return}
  openSheet('Riporto '+Yr,`<p style="margin:0">Il ${prev} si è chiuso con un avanzo di <strong class="num">${sgn(av)}</strong>.</p><p class="note">Riporto di Gennaio ${Yr} oggi: <strong class="num">${cur==null?'non impostato':eur(cur)}</strong>. Lo aggiorno con l'avanzo reale di Dicembre ${prev}?</p><div class="actions"><button class="pill-btn soft" data-r="no">Lascia così</button><button class="pill-btn" data-r="si">Aggiorna</button></div>`,(el,close)=>{
    el.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{lsSet(key,b.dataset.r);close();
      if(b.dataset.r==='si'){const c=JSON.parse(JSON.stringify(cfg()));c.riporti=c.riporti||{};c.riporti[String(Yr)]=r2(av);await saveConfig(c);toast('Riporto '+Yr+': '+eur(av))}});
  },{compact:true});
}

// ---------- aggiornamenti dell'app ----------
if('serviceWorker' in navigator&&location.protocol==='https:'){
  const hadSW=!!navigator.serviceWorker.controller;let reloaded=false;
  navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
    const chk=()=>reg.update().catch(()=>{});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chk()});
    setInterval(chk,30*60*1000);
  }).catch(()=>{});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadSW&&!reloaded&&!document.querySelector('.sheet')){reloaded=true;location.reload()}});
}

// ---------- niente zoom (come un'app) ----------
(function(){
  const stop=e=>e.preventDefault();
  ['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,stop,{passive:false}));
  document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
})();
