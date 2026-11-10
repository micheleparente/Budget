// ---------- utilità ----------
const MESI=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const MB=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
const NF=new Intl.NumberFormat('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2});
const eur=v=>(v<0?'−':'')+NF.format(Math.abs(v))+' €';
const sgn=v=>(v>0?'+':v<0?'−':'')+NF.format(Math.abs(v))+' €';
const n2=v=>(v<0?'−':'')+NF.format(Math.abs(v));
const inp=v=>v==null||v===''?'':NF.format(+v).replace(/\./g,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=s=>{if(s==null)return NaN;const t=String(s).trim().replace(/\s|€/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');return t===''?NaN:Number(t)};
const pad=n=>String(n).padStart(2,'0');
const today=()=>new Date();
const isoToday=()=>{const d=today();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const fmtDate=d=>{if(!d)return '';const [y,m,g]=d.split('-');return +g+' '+MB[+m-1]+(+y!==S.anno?' '+y:'')};
const nomeStip=m=>m<=12?MESI[m-1]:m===13?'13ª':'14ª';
const meseStip=m=>m<=12?m:m===13?12:7;
const ICON={
  prev:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  next:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  moon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  auto:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
  home:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  list:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
  in:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M12 2v8M9 7l3 3 3-3"/><circle cx="12" cy="14.5" r="1.6"/></svg>',
  dash:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V11M10 20V4M16 20v-7M22 20H2"/></svg>',
  more:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  plus:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};

// ---------- stato ----------
const S={
  D:{config:null,previsioni:[],movimenti:[],stipendi:[]},
  loaded:{},ready:false,err:null,
  anno:today().getFullYear(),mese:today().getMonth()+1,
  view:'home',kpi:'mese',regF:'tutti',regCat:'tutte',regMet:'tutti',regQ:'',catAll:false,dueAll:false,
  sim:{extra:[],netti:{}},
  priv:(()=>{try{return localStorage.getItem('budget-priv')==='1'}catch(e){return false}})(),
  mode:(()=>{try{return localStorage.getItem('budget-mode')||'auto'}catch(e){return 'auto'}})()
};
function applyPriv(){document.documentElement.classList.toggle('priv',!!S.priv)}
function applyMode(){const r=document.documentElement;if(S.mode==='auto')r.removeAttribute('data-mode');else r.setAttribute('data-mode',S.mode)}
applyMode();applyPriv();
function cfg(){return S.D.config||{categorie:[],riporti:{}}}
const METODI_DEF=['C/C Fineco','Fineco Debit','Fineco Credit','Revolut','AMEX','BBVA'];
function metodi(){const m=cfg().metodi;return Array.isArray(m)&&m.length?m:METODI_DEF}
function lastMet(){try{return localStorage.getItem('budget-metodo')||''}catch(e){return ''}}
function setLastMet(v){try{localStorage.setItem('budget-metodo',v)}catch(e){}}
function metPick(sel,name='met'){return `<div class="catpick" role="group" aria-label="Metodo di pagamento">${metodi().map(m=>`<button type="button" data-${name}="${esc(m)}" aria-pressed="${m===sel}">${esc(m)}</button>`).join('')}</div>`}
function metOptions(sel){return '<option value="">—</option>'+metodi().map(m=>`<option value="${esc(m)}" ${m===sel?'selected':''}>${esc(m)}</option>`).join('')}
function cats(){return (cfg().categorie||[]).slice().sort((a,b)=>a.ordine-b.ordine)}
function catAttiva(c,anno){return (!c.dal||anno>=c.dal)&&(!c.al||anno<=c.al)}
function catHaDati(id,anno){return S.D.movimenti.some(x=>x.anno===anno&&x.categoria===id)||S.D.previsioni.some(p=>p.anno===anno&&p.categoria===id)}
function catsAnno(anno=S.anno){return cats().filter(c=>catAttiva(c,anno)||catHaDati(c.id,anno))}
function catEnt(){return (cfg().entrate||[]).slice().sort((a,b)=>a.ordine-b.ordine)}
function entName(id){const c=catEnt().find(c=>c.id===id);return c?c.nome:''}
function ecatOptions(sel){return '<option value="">Nessuna</option>'+catEnt().map(c=>`<option value="${esc(c.id)}" ${c.id===sel?'selected':''}>${esc(c.nome)}</option>`).join('')}
function catName(id){const c=cats().find(c=>c.id===id);return c?c.nome:(id||'')}
function Y(anno=S.anno,D=S.D){return computeYear(D,anno,today())}
function anni(){const t=today().getFullYear();const s=new Set([t,t+1,S.anno]);S.D.stipendi.forEach(x=>s.add(x.anno));S.D.previsioni.forEach(x=>s.add(x.anno));S.D.movimenti.forEach(x=>s.add(x.anno));return [...s].sort()}
function previsionaleCreato(a){return S.D.previsioni.some(p=>p.anno===a&&(p.origine==='previsionale'||/^Stima da /.test(p.descrizione||'')))||S.D.movimenti.some(p=>p.anno===a&&!p.gruppo)}
function haDati(a){return S.D.previsioni.some(p=>p.anno===a)||S.D.movimenti.some(p=>p.anno===a)}

function clean(o){const d=Object.assign({},o);delete d.id;return d}

// ---------- render ----------
let raf=0;function schedule(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})}
const VIEWS=['collega','home','dashboard','dettaglio','registro','entrate','altro','prospetto','previsioni','categorie','simula','dati'];
function tabOf(v){return v==='dettaglio'?'dashboard':['home','dashboard','registro'].includes(v)?v:'altro'}
function viewFn(){return {collega:vCollega,home:vHome,dashboard:vDashboard,dettaglio:vDettaglio,registro:vRegistro,entrate:vEntrate,altro:vAltro,dati:vDati,prospetto:vProspetto,previsioni:vPrevisioni,categorie:vCategorie,simula:vSimula}[S.view]||vHome}
// pagina di un altro mese, senza toccare lo stato (per lo swipe)
function htmlMese(m){const o=S.mese;S.mese=m;try{return viewFn()()}finally{S.mese=o}}
function render(){
  const v=document.getElementById('view');
  document.querySelectorAll('.tabs a').forEach(a=>a.setAttribute('aria-current',a.dataset.v===tabOf(S.view)?'page':'false'));
  if(!S.ready){v.innerHTML=stateScreen();return}
  if(!SYNC.api&&S.view!=='collega'){S.view='collega'}
  v.classList.toggle('fit',S.view==='home'&&!!cats().length);
  v.innerHTML=viewFn()();
  if(SYNC.api&&!S.chAsk&&chiusurePendenti().length){S.chAsk=true;let done=false;try{done=sessionStorage.getItem('budget-chask')==='1';sessionStorage.setItem('budget-chask','1')}catch(e){}if(!done)setTimeout(()=>{if(!document.querySelector('.sheet'))sheetChiusura()},900)}
}
function stateScreen(){
  if(S.err==='nodb')return '<div class="card"><h2>Dati non raggiungibili</h2><p class="note">Apri l\'app dal link claude.ai con il tuo account: i dati sono salvati lì.</p></div>';
  if(S.err&&S.err!=='slow')return '<div class="card"><h2>Dati non raggiungibili</h2><p class="note">La connessione all\'archivio si è interrotta. Ricarica la pagina.</p></div>';
  if(S.err==='slow')return '<div class="card"><h2>Caricamento lento</h2><p class="note">I dati non arrivano ancora. Controlla la connessione: la pagina si aggiorna da sola appena rispondono.</p></div>';
  return '<div class="card"><p class="note">Caricamento dati…</p></div>';
}
function header(title,opts={}){
  const nav=opts.month!==false;
  const modeIcon=S.mode==='dark'?ICON.moon:S.mode==='light'?ICON.sun:ICON.auto;
  const modeLbl=S.mode==='dark'?'Tema scuro, tocca per automatico':S.mode==='light'?'Tema chiaro, tocca per scuro':'Tema automatico, tocca per chiaro';
  const nDc=S.ready&&cats().length?Y().ist.filter(i=>i.stato==='daconfermare').length:0;const badge=nDc&&opts.badge!==false?`<button class="dc-badge" data-act="godaconf" aria-label="${nDc} ${nDc===1?'voce':'voci'} da confermare">${nDc} da confermare</button>`:'';
  return `<div class="hd"><div style="min-width:0"><p class="eyebrow">${esc(title)} · <button class="yr-btn" data-act="pickyear" aria-label="Anno ${S.anno}, tocca per cambiare">${S.anno}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>${badge}</p>${nav?`<div class="monthnav"><button class="ghost" data-act="mprev" aria-label="Mese precedente" ${S.mese<=1?'disabled':''}>${ICON.prev}</button><h1>${MESI[S.mese-1]}</h1><button class="ghost" data-act="mnext" aria-label="Mese successivo" ${S.mese>=12?'disabled':''}>${ICON.next}</button></div>`:`<h1 style="font-size:26px;font-weight:800;letter-spacing:-.5px">${esc(opts.h||title)}</h1>`}</div><div style="display:flex;gap:8px;align-items:center">${opts.eye?`<button class="icon-btn" data-act="priv" aria-pressed="${S.priv}" aria-label="${S.priv?'Mostra gli importi':'Nascondi gli importi'}">${S.priv?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.9 9.9 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>':'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'}</button>`:''}<button class="icon-btn" data-act="mode" aria-label="${modeLbl}">${modeIcon}</button></div></div>`;
}
function media(c,anno){const idx=[...Array(12).keys()].filter(i=>monthState(anno,i+1,today())==='chiuso');const use=idx.length?idx:[...Array(12).keys()];return r2(use.reduce((a,i)=>a+c.mesi[i],0)/use.length)}
function statoChip(s){return s==='effettivo'?'<span class="chip ok">PAGATA</span>':s==='daconfermare'?'<span class="chip warn">DA CONFERMARE</span>':'<span class="chip sim">PREVISTA</span>'}
function onboarding(){
  return `<section class="card"><h2>Si parte da zero</h2><p class="note">L'archivio è vuoto. Crea le categorie, poi le previsioni di inizio anno (affitto, abbonamenti, rate, budget benzina) e registra stipendi e movimenti. Se preferisci, mandami l'Excel in chat e lo importo io.</p><div class="actions"><a class="pill-btn" href="#categorie" style="text-decoration:none;justify-content:center">Crea le categorie</a></div></section>`;
}

// ---------- HOME ----------
function anelloCard(y,m,mi){
  const st=m.stato,used=m.disp>0?m.spese/m.disp:(m.spese>0?1:0),pct=Math.max(0,Math.min(1,used));
  const C=2*Math.PI*84;const over=m.saldo<0;let lbl,rate;
  if(st==='corrente'){const t=today();const dim=new Date(S.anno,S.mese,0).getDate();const left=dim-t.getDate()+1;lbl=over?'Sei oltre di':'Ti restano';rate=over?'Spese sopra la disponibilità':`${eur(m.saldo/left)} al giorno · ${left} ${left===1?'giorno':'giorni'}`}
  else if(st==='chiuso'){lbl='Saldo del mese';rate='Mese chiuso'}else{lbl='Saldo previsto';rate='Previsione'}
  return `<section class="card ring-card" aria-label="Il mese"><div class="ring-wrap"><svg viewBox="0 0 208 208" role="img" aria-label="Usato il ${Math.round(used*100)}% della disponibilità"><circle cx="104" cy="104" r="84" fill="none" stroke="var(--soft)" stroke-width="18"/><circle cx="104" cy="104" r="84" fill="none" stroke="${over?'var(--neg)':'var(--accent)'}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${(pct*C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 104 104)"/></svg><div class="ring-center"><span class="lbl">${lbl}</span><span class="big num ${over?'neg':''}" style="--len:${Math.max(7,eur(Math.abs(m.saldo)).length)}">${eur(Math.abs(m.saldo))}</span></div></div><p class="rate-line">${rate}</p><p class="note" style="text-align:center">Spese <strong class="num" style="color:var(--ink)">${eur(m.spese)}</strong> su <strong class="num" style="color:var(--ink)">${eur(m.disp)}</strong> disponibili<br><span class="pct-line"><strong class="num ${used>1?'neg':''}">${Math.round(used*100)}%</strong> della disponibilità ${st==='chiuso'?'spesa':'già impegnata'}</span></p></section>`;
}
function proiezione(y,mi){const m=y.mesi[mi],t=today(),dim=new Date(S.anno,mi+1,0).getDate(),g=t.getDate();
  const varIds=new Set(cats().filter(c=>c.tipo!=='fissa').map(c=>c.id));
  const varReale=r2(S.D.movimenti.filter(x=>x.anno===S.anno&&x.mese===mi+1&&varIds.has(x.categoria)).reduce((a,x)=>a+(x.tipo==='reso'?-1:x.tipo==='spesa'?1:0)*(+x.importo),0));
  const ritmoG=g>0?varReale/g:0,stimaVar=r2(ritmoG*dim),extra=Math.max(0,r2(stimaVar-m.variabili));
  return {g,dim,left:dim-g+1,varReale,ritmoG,stimaVar,extra,fine:r2(m.saldo-extra)}}
function panoramicaCard(y,m,mi){
  const st=m.stato,lastClosed=y.mesi.filter(x=>x.stato==='chiuso').pop(),fine=y.mesi[11].avanzo;
  const tiles=S.kpi==='mese'?[
    {l:'Disponibilità',v:eur(m.disp),n:m.spot?'Standard + spot':(S.mese===1&&y.riporto?'Standard + riporto':'Stipendio standard'),hero:true},
    {l:'Spese del mese',v:eur(m.spese),n:st==='chiuso'?'Effettive':'Effettive + previste'},
    {l:'Avanzo cumulato',v:sgn(m.avanzo),n:`Gen – ${MB[mi]}`,c:m.avanzo<0?'neg':'pos'},
    {l:'Fine anno',v:sgn(fine),n:'Previsione',c:fine<0?'neg':'pos'}
  ]:[
    {l:'Entrate',sim:Object.values(y.netti).some(x=>x.stato!=='confermato'),v:eur(y.mesi.reduce((a,x)=>a+x.disp,0)),n:'Netti + spot + riporto',hero:true},
    {l:'Spese',v:eur(y.mesi.reduce((a,x)=>a+x.spese,0)),n:'Effettive + previste'},
    {l:'Avanzo a oggi',v:lastClosed?sgn(lastClosed.avanzo):'—',n:lastClosed?`Gen – ${MB[lastClosed.m-1]}`:'Nessun mese chiuso',c:lastClosed&&lastClosed.avanzo<0?'neg':'pos'},
    {l:'Fine anno',v:sgn(fine),n:'Previsione',c:fine<0?'neg':'pos'}
  ];
  let rl,rs,rv,rc,rinv=false;
  if(st==='corrente'){const P=proiezione(y,mi);rl='Se continui così';rs=`Spese variabili ${eur(r2(P.ritmoG))} al giorno · `+(P.extra>0?`${eur(P.extra)} oltre il previsto`:'nel previsto');rv=P.fine;rc='saldo a fine mese'}
  else{const ch=y.mesi.filter(x=>x.stato==='chiuso'&&x.m!==m.m);const med=ch.length?r2(ch.reduce((a,x)=>a+x.spese,0)/ch.length):null;
    rl=st==='chiuso'?'Spese rispetto alla media':'Spese previste vs media';
    if(med){const d=r2(m.spese-med);rv=d;rinv=true;rs=`Media mesi chiusi ${eur(med)} · ${Math.abs(Math.round(d/med*100))}% ${d>0?'in più':'in meno'}`}else{rv=null;rs='Nessun mese chiuso da confrontare'}rc=''}
  const netRow=`<a class="netrow" href="#dashboard" style="color:inherit;text-decoration:none"><div style="min-width:0"><strong>${rl}</strong><span class="small muted nr-s">${rs}</span></div><strong class="num ${rv==null?'':(rinv?rv>0:rv<0)?'neg':'pos'}" style="white-space:nowrap">${rv==null?'—':sgn(rv)}</strong></a>`;
  return `<section class="card pano-card" aria-label="Panoramica"><div class="seg" role="group" aria-label="Periodo"><button data-act="kpi" data-k="mese" aria-pressed="${S.kpi==='mese'}">${MESI[mi]}</button><button data-act="kpi" data-k="anno" aria-pressed="${S.kpi==='anno'}">Anno ${S.anno}</button></div><div class="tiles">${tiles.map(t=>`<div class="tile ${t.hero?'hero':''}"><span class="t-l">${t.l}</span>${t.sim?'<span class="chip t-sim">SIMULATE</span>':''}<span class="t-v num ${t.c||''}">${t.v}</span><span class="t-n">${t.n}</span></div>`).join('')}</div>${netRow}</section>`;
}
function vHome(){
  if(!cats().length)return header('Budget')+onboarding();
  const y=Y(),mi=S.mese-1,m=y.mesi[mi];
  return header('Budget',{eye:true})+syncBanner()+anelloCard(y,m,mi)+panoramicaCard(y,m,mi);
}

// ---------- DASHBOARD ----------
const n0=v=>(v>0?'+':v<0?'−':'')+Math.round(Math.abs(v)).toLocaleString('it-IT');
function saldiChart(y){
  const W=344,H=196,top=22,bot=40,pl=4,step=(W-pl*2)/12,bw=Math.min(20,step-6);
  const vals=y.mesi.map(m=>m.saldo);const mx=Math.max(1,...vals),mn=Math.min(0,...vals);const span=mx-mn||1;
  const Yv=v=>top+(mx-v)/span*(H-top-bot);const z=Yv(0);
  const g=y.mesi.map((m,i)=>{const v=m.saldo,x=pl+i*step+(step-bw)/2,yy=Math.min(Yv(v),z),h=Math.max(1.5,Math.abs(Yv(v)-z));const fut=m.stato==='futuro',sel=i===S.mese-1;
    const col=v>=0?'var(--pos)':'var(--neg)';const ty=v>=0?yy-5:yy+h+11;
    return `<g data-act="setmese" data-k="${i+1}" style="cursor:pointer"><rect x="${(pl+i*step).toFixed(1)}" y="0" width="${step.toFixed(1)}" height="${H}" fill="transparent"/>${sel?`<rect x="${(pl+i*step+1).toFixed(1)}" y="2" width="${(step-2).toFixed(1)}" height="${H-4}" rx="8" fill="var(--soft)"/>`:''}<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="4" fill="${col}" opacity="${fut?.4:1}"/><text x="${(x+bw/2).toFixed(1)}" y="${ty.toFixed(1)}" font-size="9" font-weight="700" fill="${col}" text-anchor="middle">${n0(v)}</text><text x="${(x+bw/2).toFixed(1)}" y="${H-8}" font-size="10" font-weight="${sel?800:500}" fill="${sel?'var(--ink)':'var(--sub)'}" text-anchor="middle">${MB[i].charAt(0)}</text></g>`}).join('');
  const chiusi=y.mesi.filter(m=>m.stato!=='futuro');const best=chiusi.length?chiusi.reduce((a,b)=>b.saldo>a.saldo?b:a):null,worst=chiusi.length?chiusi.reduce((a,b)=>b.saldo<a.saldo?b:a):null;
  const pos=y.mesi.filter(m=>m.saldo>=0).length;
  return `<section class="card" aria-label="Saldo mese per mese"><div class="row-head"><h2>Saldo mese per mese</h2><span class="small muted">${pos} sopra, ${12-pos} sotto lo zero</span></div><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Saldo di ogni mese: barre verdi sopra lo zero, arancioni sotto; tocca un mese per aprirlo"><line x1="0" x2="${W}" y1="${z.toFixed(1)}" y2="${z.toFixed(1)}" stroke="var(--line)" stroke-width="1.5"/>${g}</svg><div class="legend"><span>${best?`Migliore <strong class="pos">${MB[best.m-1]} ${n0(best.saldo)}</strong>`:''}</span><span>${worst?`Peggiore <strong class="neg">${MB[worst.m-1]} ${n0(worst.saldo)}</strong>`:''}</span></div><p class="note">Barre chiare: mesi futuri (previsione). Tocca un mese per aprirlo.</p></section>`;
}
function prossimeScadenze(){
  const t=today(),t0=new Date(t.getFullYear(),t.getMonth(),t.getDate()),lim=new Date(t0.getTime()+31*864e5);
  const out=[];[t.getFullYear(),t.getFullYear()+1].forEach(a=>istanze(S.D,a,t).forEach(i=>{if(!i.p.scadenza||i.stato==='effettivo'&&!i.auto)return;const d=dataAddebito(a,i.m,i.p.giorno||28);if(d<t0&&(i.stato!=='daconfermare'||t0-d>31*864e5))return;if(d>lim)return;out.push({i,d,a})}));
  return out.sort((a,b)=>a.d-b.d);
}
function vDashboard(){
  if(!cats().length)return header('Dashboard')+onboarding();
  const y=Y(),mi=S.mese-1,m=y.mesi[mi];
  const nDc=y.ist.filter(i=>i.stato==='daconfermare').length;
  const banner=chiusuraBanner()+(nDc?`<button class="banner" data-act="godaconf"><span><strong>${nDc} ${nDc===1?'voce':'voci'} da confermare</strong> · importo vero ancora da inserire</span>${ICON.chev}</button>`:'');
  // proiezione di fine mese (mese in corso)
  let proj='';
  if(m.stato==='corrente'){const t=today(),dim=new Date(S.anno,S.mese,0).getDate(),g=t.getDate(),left=dim-g+1;
    const varIds=new Set(cats().filter(c=>c.tipo!=='fissa').map(c=>c.id));
    const varReale=r2(S.D.movimenti.filter(x=>x.anno===S.anno&&x.mese===S.mese&&varIds.has(x.categoria)).reduce((a,x)=>a+(x.tipo==='reso'?-1:x.tipo==='spesa'?1:0)*(+x.importo),0));
    const ritmoG=g>0?varReale/g:0,stimaVar=r2(ritmoG*dim);
    const extra=Math.max(0,r2(stimaVar-m.variabili));const fine=r2(m.saldo-extra);
    proj=`<section class="card" aria-label="Fine mese"><div class="row-head"><h2>Come chiudi ${MESI[mi]}</h2><span class="small muted">giorno ${g} di ${dim}</span></div>
     <div class="tiles"><div class="tile ${fine<0?'':'hero'}" style="${fine<0?'background:var(--warn-bg);color:var(--warn-ink)':''}"><span class="t-l">Se continui così</span><span class="t-v num">${sgn(fine)}</span><span class="t-n">saldo a fine mese</span></div><div class="tile"><span class="t-l">Puoi spendere</span><span class="t-v num">${m.saldo>0?eur(r2(m.saldo/left)):'0,00 €'}</span><span class="t-n">al giorno per ${left} giorni</span></div></div>
     <p class="note">Spese variabili finora ${eur(varReale)}, cioè ${eur(r2(ritmoG))} al giorno: a questo ritmo arrivi a circa ${eur(stimaVar)} entro fine mese${extra>0?`, ${eur(extra)} oltre il previsto`:', dentro il previsto'}.</p></section>`}
  // prossime scadenze
  const ps=prossimeScadenze();const t0=today();t0.setHours(0,0,0,0);
  const fra=d=>{const n=Math.round((d-t0)/864e5);return n<0?`scaduta da ${-n} ${-n===1?'giorno':'giorni'}`:n===0?'oggi':n===1?'domani':`tra ${n} giorni`};
  const psTot=r2(ps.reduce((a,x)=>a+x.i.importo,0));
  const scad=`<section class="card tight" aria-label="Prossime scadenze"><div class="row-head" style="padding-top:12px"><h2>Prossime scadenze</h2><a class="link" href="#previsioni" style="text-decoration:none;display:inline-flex;align-items:center">Gestisci</a></div><div class="list">${ps.slice(0,S.dueAll?99:5).map(x=>`<button class="item" data-act="editist" data-id="${esc(x.i.p.id)}" data-k="${x.i.m}"><span class="badge">${x.d.getDate()}<br>${MB[x.d.getMonth()]}</span><span class="grow"><span class="t">${esc(x.i.p.descrizione)}</span><span class="s">${fra(x.d)}${x.i.p.metodo?' · '+esc(x.i.p.metodo):''} ${x.i.stato==='daconfermare'?statoChip('daconfermare'):''}</span></span><span class="amt">−${eur(x.i.importo)}</span></button>`).join('')||'<p class="empty">Nessuna scadenza nei prossimi 30 giorni. Segna come "scadenza" rate, bollette e assicurazioni nelle previsioni.</p>'}</div>${ps.length?`<p class="note" style="padding-bottom:12px">${ps.length} nei prossimi 30 giorni · totale ${eur(psTot)}${ps.length>5?` · <button class="link" data-act="dueall" style="padding:0;min-height:0">${S.dueAll?'mostra meno':'mostra tutte'}</button>`:''}</p>`:''}</section>`;
  // dove vanno i soldi
  const list=y.cat.map(c=>({c,v:c.mesi[mi],a:media(c,S.anno)})).filter(x=>x.v>0.004).sort((a,b)=>b.v-a.v);
  const shown=S.catAll?list:list.slice(0,5);
  const dove=`<section class="card" aria-label="Dove vanno i soldi"><div class="row-head"><h2>Dove vanno i soldi</h2><span class="small muted">${MESI[mi]}</span></div>${splitBar(m)}<div>${shown.map(x=>{const pc=m.spese?Math.round(x.v/m.spese*100):0;const d=x.a?Math.round((x.v-x.a)/x.a*100):0;const up=x.v>x.a+0.004;return `<button class="catrow" data-act="dettcat" data-id="${esc(x.c.id)}"><span class="l1"><span>${esc(x.c.nome)}</span><span class="num">${eur(x.v)}</span></span><span class="bar"><i style="width:${pc}%;background:var(--accent)"></i></span><span class="l2"><span>${pc}% delle spese</span><span class="num ${up?'neg':'pos'}">${x.a?((d>0?'+':'')+d+'% sulla media'):'nuova'}</span></span></button>`}).join('')||'<p class="empty">Nessuna spesa in questo mese.</p>'}</div>${list.length>5?`<button class="link" data-act="catall">${S.catAll?'Mostra meno':`Tutte le categorie (${list.length})`}</button>`:''}</section>`;
  // confronti
  const yp=Y(S.anno-1);const prevM=mi>0?y.mesi[mi-1]:yp.mesi[11];const sameLY=yp.mesi[mi];
  const chiusi=y.mesi.filter(x=>x.stato==='chiuso');const medS=chiusi.length?r2(chiusi.reduce((a,x)=>a+x.spese,0)/chiusi.length):null;
  const cr=(l,ref)=>{if(ref==null||!(ref>0))return `<span>${l}</span><span class="muted">—</span><span></span>`;const d=r2(m.spese-ref),p=Math.round(d/ref*100);return `<span>${l}</span><span class="num muted">${eur(ref)}</span><strong class="num ${d>0?'neg':'pos'}">${d>0?'+':''}${p}%</strong>`};
  const conf=`<section class="card" aria-label="Confronti"><h2>Spese di ${MESI[mi]} a confronto</h2><div class="cmp"><span class="h">Rispetto a</span><span class="h">Spese</span><span class="h">Diff.</span>${cr('Mese prima',prevM.spese)}${cr(MESI[mi]+' '+(S.anno-1),sameLY.spese)}${cr('Media mesi chiusi',medS)}</div></section>`;
  // previsionale
  const nx=S.anno+1;let nextCard;
  if(previsionaleCreato(nx)){const yn=Y(nx);nextCard=`<section class="card"><div class="row-head"><div><p class="eyebrow">Previsionale ${nx}</p><span class="num ${yn.mesi[11].avanzo<0?'neg':'pos'}" style="font-size:22px;font-weight:800">${sgn(yn.mesi[11].avanzo)}</span><p class="note">Avanzo stimato a fine ${nx} · spese ${eur(yn.mesi.reduce((a,x)=>a+x.spese,0))}</p></div><button class="pill-btn soft" data-act="anno" data-k="${nx}">Apri</button></div></section>`}
  else nextCard=`<section class="card"><div class="row-head"><div><p class="eyebrow">Previsionale ${nx}</p><p class="note">Copia previsioni e netti del ${S.anno} come simulazione.</p></div><button class="pill-btn soft" data-act="creaanno" data-k="${nx}">Crea</button></div></section>`;
  return header('Dashboard',{badge:false})+banner+saldiChart(y)+proj+scad+dove+conf+avanzoChart(y)+nextCard;
}
// dettaglio di una categoria
function vDettaglio(){
  const c=cats().find(x=>x.id===S.detCat);if(!c){location.hash='#dashboard';return ''}
  const y=Y();const yc=y.cat.find(x=>x.id===c.id)||{mesi:Array(12).fill(0),reale:Array(12).fill(0)};
  const tot=r2(yc.mesi.reduce((a,b)=>a+b,0)),med=media(yc,S.anno),cur=yc.mesi[S.mese-1];
  const W=320,H=130;const mx=Math.max(1,...yc.mesi);
  const bars=yc.mesi.map((v,i)=>{const h=Math.max(v>0?2:0,v/mx*(H-30));const x=8+i*(W-16)/12;const fut=y.mesi[i].stato==='futuro';return `<rect x="${x.toFixed(1)}" y="${(H-16-h).toFixed(1)}" width="18" height="${h.toFixed(1)}" rx="3" fill="${fut?'var(--soft)':'var(--accent)'}"${i===S.mese-1?' stroke="var(--ink)" stroke-width="1.5"':''}/>`}).join('');
  const my=(H-16-med/mx*(H-30)).toFixed(1);
  const rows=righeMese(S.anno,S.mese).filter(r=>r.cat===c.id);
  const prv=S.D.previsioni.filter(p=>p.anno===S.anno&&p.categoria===c.id);
  return `<div class="hd"><div style="min-width:0"><a class="eyebrow" href="#dashboard" style="text-decoration:none;color:var(--accent-ink)">‹ Dashboard</a><h1 style="font-size:24px;font-weight:800;letter-spacing:-.4px">${esc(c.nome)}</h1></div></div>
  <section class="card"><div class="tiles"><div class="tile hero"><span class="t-l">${MESI[S.mese-1]}</span><span class="t-v num">${eur(cur)}</span><span class="t-n">${med?((cur>med?'+':'')+Math.round((cur-med)/med*100)+'% sulla media'):'—'}</span></div><div class="tile"><span class="t-l">Totale ${S.anno}</span><span class="t-v num">${eur(tot)}</span><span class="t-n">Media ${eur(med)}/mese</span></div></div>
  <svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Spesa mese per mese in ${esc(c.nome)}">${bars}<line x1="4" x2="${W-4}" y1="${my}" y2="${my}" stroke="var(--neg)" stroke-width="1.5" stroke-dasharray="4 4"/>${[0,3,6,9,11].map(i=>`<text x="${(8+i*(W-16)/12+9).toFixed(1)}" y="${H-3}" font-size="10" fill="var(--sub)" text-anchor="middle">${MB[i]}</text>`).join('')}</svg><p class="note">Barre chiare: mesi futuri (previsione). Tratteggio: media.</p></section>
  <p class="sec-title">Movimenti di ${MESI[S.mese-1]}</p><section class="card tight"><div class="list">${rows.map(r=>r.k==='ist'?istRow(r.i):`<button class="item" data-act="editmov" data-id="${esc(r.x.id)}"><span class="grow"><span class="t">${esc(r.x.descrizione)}</span><span class="s">${r.x.tipo==='reso'?'Storno / reso · ':''}${fmtDate(r.x.data)}${r.x.metodo?' · '+esc(r.x.metodo):''}${r.x.quota?' · quota '+esc(r.x.quota):''}</span></span><span class="amt ${r.entrata?'pos':''}">${r.entrata?'+':'−'}${eur(r.importo)}</span></button>`).join('')||'<p class="empty">Nessun movimento in questo mese.</p>'}</div></section>
  ${prv.length?`<p class="sec-title">Previsioni</p><section class="card tight"><div class="list">${prv.map(p=>`<button class="item" data-act="editprev" data-id="${esc(p.id)}"><span class="grow"><span class="t">${esc(p.descrizione)}</span><span class="s">${TIPI[p.tipo]} · ${mesiLabel(p.importi)}</span></span>${ICON.chev}</button>`).join('')}</div></section>`:''}`;
}
function splitBar(m){const fp=m.spese>0?Math.max(0,Math.min(1,m.fisse/m.spese)):0;return `<div class="split" aria-hidden="true"><span style="width:${(fp*100).toFixed(1)}%;background:var(--fixed)"></span><span style="flex:1;background:var(--var)"></span></div><div class="legend"><span><span class="dot" style="background:var(--fixed)"></span><strong>Fisse</strong> <span class="muted num">${eur(m.fisse)} · ${Math.round(fp*100)}%</span></span><span><span class="dot" style="background:var(--var)"></span><strong>Variabili</strong> <span class="muted num">${eur(m.variabili)} · ${Math.round((1-fp)*100)}%</span></span></div>`}
function initials(s){return String(s).split(/[\s/+]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()}
function istRow(i){const g=i.p.giorno;return `<button class="item ${i.stato==='effettivo'?'':'is-prev'}" data-act="editist" data-id="${esc(i.p.id)}" data-k="${i.m}"><span class="badge db"><b>${g?esc(g):'—'}</b><i>${MB[i.m-1]}</i></span><span class="grow"><span class="t">${esc(i.p.descrizione)}</span><span class="s">${esc(catName(i.p.categoria))}${i.p.metodo?' · '+esc(i.p.metodo):''} ${statoChip(i.stato)}</span></span><span class="amt">−${eur(i.importo)}</span></button>`}
function avanzoChart(y){
  const W=320,H=150,pl=8,pr=8,pt=18,pb=26;
  const vals=y.mesi.map(x=>x.avanzo);const mx=Math.max(0,...vals),mn=Math.min(0,...vals);const span=(mx-mn)||1;
  const X=i=>pl+i*(W-pl-pr)/11, Yv=v=>pt+(mx-v)/span*(H-pt-pb);
  const lastReal=y.mesi.map(x=>x.stato).lastIndexOf('chiuso');
  const pts=vals.map((v,i)=>[X(i),Yv(v)]);
  const real=lastReal>=0?pts.slice(0,lastReal+1):[], est=pts.slice(Math.max(0,lastReal));
  const line=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const area=real.length>1?`M${real[0][0].toFixed(1)},${Yv(0).toFixed(1)} L${line(real).replace(/ /g,' L')} L${real[real.length-1][0].toFixed(1)},${Yv(0).toFixed(1)} Z`:'';
  const sel=pts[S.mese-1],last=pts[11];
  const grid=[mx,0,mn].filter((v,i,a)=>a.indexOf(v)===i).map(v=>`<line x1="${pl}" x2="${W-pr}" y1="${Yv(v).toFixed(1)}" y2="${Yv(v).toFixed(1)}" stroke="var(--line)" stroke-width="1" ${v===0?'':'stroke-dasharray="2 4"'}/>`).join('');
  const labels=[0,3,6,9,11].map(i=>`<text x="${X(i).toFixed(1)}" y="${H-6}" font-size="11" fill="var(--sub)" text-anchor="${i===0?'start':i===11?'end':'middle'}">${MB[i]}</text>`).join('');
  const yl=(mx>0?`<text x="${pl}" y="${(Yv(mx)-5).toFixed(1)}" font-size="10" fill="var(--sub)">${n2(mx)}</text>`:'')+(mn<0?`<text x="${pl}" y="${(Yv(mn)+12).toFixed(1)}" font-size="10" fill="var(--sub)">${n2(mn)}</text>`:'');
  const a=y.mesi[S.mese-1].avanzo,f=y.mesi[11].avanzo;
  return `<section class="card" aria-label="Avanzo cumulato"><div class="row-head"><div><p class="eyebrow">Avanzo cumulato a ${MESI[S.mese-1]}</p><span class="num ${a<0?'neg':'pos'}" style="font-size:24px;font-weight:800">${sgn(a)}</span></div><div style="text-align:right"><p class="eyebrow">Fine anno</p><span class="num ${f<0?'neg':'pos'}" style="font-size:17px;font-weight:800">${sgn(f)}</span></div></div><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Avanzo cumulato da Gennaio a Dicembre: tratto pieno i mesi chiusi, tratteggio la previsione">${grid}${area?`<path d="${area}" fill="var(--accent)" opacity=".12"/>`:''}${real.length>1?`<polyline points="${line(real)}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`:''}${est.length>1?`<polyline points="${line(est)}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="4 6" stroke-linecap="round"/>`:''}<circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="var(--card)" stroke="var(--accent)" stroke-width="2.5"/><circle cx="${sel[0].toFixed(1)}" cy="${sel[1].toFixed(1)}" r="5.5" fill="var(--accent)"/>${yl}${labels}</svg><p class="note">Tratto pieno: mesi chiusi. Tratteggio: previsione.</p></section>`;
}

// ---------- REGISTRO ----------
function righeMese(anno,m){
  const y=Y(anno);const rows=[];
  S.D.movimenti.filter(x=>x.anno===anno&&x.mese===m).forEach(x=>rows.push({k:'mov',x,data:x.data||'',entrata:x.tipo!=='spesa',importo:+x.importo,cat:x.categoria||null,met:x.metodo||'',stato:'effettivo'}));
  y.ist.filter(i=>i.m===m).forEach(i=>rows.push({k:'ist',i,data:anno+'-'+pad(m)+'-'+pad(i.p.giorno||28),entrata:false,importo:i.importo,cat:i.p.categoria,met:i.p.metodo||'',stato:i.stato}));
  if(m===1&&y.riporto)rows.push({k:'rip',data:anno+'-01-01',entrata:true,importo:y.riporto,cat:null,met:'',stato:'effettivo',auto:y.riportoAuto});
  Object.entries(y.netti).forEach(([mm,n])=>{if(meseStip(+mm)===m)rows.push({k:'stip',mm:+mm,n,data:anno+'-'+pad(m)+'-27',entrata:true,importo:n.netto,cat:null,stato:n.stato==='confermato'?'effettivo':'previsto'})});
  return rows;
}
// parte di budget non ancora spesa nel mese (conta nei totali finché il mese non è chiuso a consuntivo)
function budResiduo(anno,m,cat){const b={};S.D.previsioni.filter(p=>p.anno===anno&&p.tipo==='budget'&&p.importi&&p.importi[m-1]!=null&&!budgetChiuso(p,m)&&(!cat||cat==='tutte'||p.categoria===cat)).forEach(p=>{b[p.categoria]=(b[p.categoria]||0)+(+p.importi[m-1])});
  const yc=Y(anno);return r2(Object.entries(b).reduce((a,[id,v])=>{const c=yc.cat.find(x=>x.id===id);return a+Math.max(0,v-(c?c.reale[m-1]:0))},0))}
// riquadro con giorno e mese (al posto della sigla della categoria)
function dayBadge(iso,cls){const ok=/^\d{4}-\d{2}-\d{2}/.test(iso||'');if(!ok)return `<span class="badge db ${cls||''}" aria-label="Senza data"><b>—</b></span>`;const g=+iso.slice(8,10),m=+iso.slice(5,7);return `<span class="badge db ${cls||''}" aria-hidden="true"><b>${g}</b><i>${MB[m-1]}</i></span>`}
function regRow(r){
    if(r.k==='ist')return istRow(r.i);
    if(r.k==='rip')return `<button class="item" data-act="editriporto"><span class="badge in">A.P.</span><span class="grow"><span class="t">Riporto dall'anno precedente</span><span class="s">Entrata · ${r.auto?'avanzo di Dicembre '+(S.anno-1)+', calcolato in automatico':'inserito a mano'}</span></span><span class="amt pos">+${eur(r.importo)}</span></button>`;
    if(r.k==='stip'){const sim=r.n.stato!=='confermato';return `<button class="item ${sim?'is-prev':''}" data-act="editstip" data-k="${r.mm}"><span class="badge in">€</span><span class="grow"><span class="t">Stipendio ${nomeStip(r.mm)}</span><span class="s">Entrata · ${sim?'stima anno precedente <span class="chip sim">SIMULATO</span>':'netto confermato'}</span></span><span class="amt pos">+${eur(r.importo)}</span></button>`}
    const x=r.x;const tl=x.tipo==='spot'?'Entrata spot'+(entName(x.categoria)?' · '+esc(entName(x.categoria)):''):x.tipo==='reso'?'Storno / reso · '+esc(catName(x.categoria)):esc(catName(x.categoria));
    return `<button class="item" data-act="editmov" data-id="${esc(x.id)}">${dayBadge(x.data,r.entrata?'in':'')}<span class="grow"><span class="t">${esc(x.descrizione||catName(x.categoria))}</span><span class="s">${tl}${x.metodo?' · '+esc(x.metodo):''}${x.quota?' · quota '+esc(x.quota):''}</span></span><span class="amt ${r.entrata?'pos':''}">${r.entrata?'+':'−'}${eur(r.importo)}${x.gruppo?`<span class="s" style="display:block;font-weight:500">di ${eur(+x.totale||0)}</span>`:''}</span></button>`}
function regDesc(r){if(r.k==='mov')return r.x.descrizione||catName(r.x.categoria)||'';if(r.k==='ist')return r.i.p.descrizione||'';if(r.k==='stip')return 'Stipendio '+nomeStip(r.mm);if(r.k==='rip')return "Riporto dall'anno precedente";return ''}
function regFiltra(rows){const F=S.regF;const q=(S.regQ||'').trim().toLowerCase();
  rows=rows.filter(r=>F==='tutti'||(F==='uscite'&&!r.entrata)||(F==='entrate'&&r.entrata)||(F==='previsti'&&r.stato==='previsto')||(F==='daconf'&&r.stato==='daconfermare'));
  if(S.regCat!=='tutte')rows=rows.filter(r=>r.cat===S.regCat);
  if(S.regMet!=='tutti')rows=rows.filter(r=>r.met===S.regMet);
  if(q)rows=rows.filter(r=>regDesc(r).toLowerCase().includes(q));
  rows.forEach((r,i)=>r._i=i);rows.sort((a,b)=>{const da=/^\d{4}-\d{2}-\d{2}/.test(a.data||'')?a.data.slice(0,10):'',db=/^\d{4}-\d{2}-\d{2}/.test(b.data||'')?b.data.slice(0,10):'';if(!da!==!db)return da?1:-1;return db.localeCompare(da)||a._i-b._i});
  return rows}
// risultati del Registro: mese scelto, oppure tutto l'anno se c'è una ricerca; totale se c'è un filtro di categoria o una ricerca
function regRisultati(){
  const q=(S.regQ||'').trim();const mesi=q?[12,11,10,9,8,7,6,5,4,3,2,1]:[S.mese];
  const t={sp:0,res:0,pre:0,ent:0,n:0};let lista='';
  for(const m of mesi){const rows=regFiltra(righeMese(S.anno,m));if(!rows.length)continue;
    rows.forEach(r=>{t.n++;if(r.k==='mov'&&r.x.tipo==='reso')t.res+=r.importo;else if(r.entrata)t.ent+=r.importo;else if(r.stato==='effettivo')t.sp+=r.importo;else t.pre+=r.importo});
    lista+=(q?`<p class="sec-title">${MESI[m-1]}</p>`:'')+`<section class="card tight"><div class="list">${rows.map(regRow).join('')}</div></section>`}
  if(!q)lista=`<p class="sec-title">Movimenti</p>`+(lista||'<section class="card tight"><div class="list"><p class="empty">Nessun movimento con questo filtro.</p></div></section>');
  else if(!t.n)lista=`<p class="sec-title">Risultati</p><section class="card tight"><div class="list"><p class="empty">Nessun movimento del ${S.anno} contiene "${esc(q)}".</p></div></section>`;
  let tot='';
  if(!q){const br=budResiduo(S.anno,S.mese,S.regCat);if(br&&S.regF!=='entrate'&&S.regF!=='daconf'){t.pre+=br;t.bud=br}}
  if(S.regCat!=='tutte'||q){const net=r2(t.sp-t.res);
    const chi=[S.regCat!=='tutte'?esc(catName(S.regCat)):'',q?'"'+esc(q)+'"':'',S.regMet!=='tutti'?esc(S.regMet):''].filter(Boolean).join(' · ');
    const det=[`${t.n} ${t.n===1?'movimento':'movimenti'}`,t.res?`storni e resi −${eur(r2(t.res))} già sottratti`:'',t.ent?`entrate +${eur(r2(t.ent))}`:''].filter(Boolean).join(' · ');
    tot=`<section class="card" aria-label="Totale del filtro"><div class="row-head"><div><p class="eyebrow">Speso · ${chi}</p><span class="num" style="font-size:24px;font-weight:800">${eur(net)}</span><p class="note" style="margin-top:2px">${q?'Tutto il '+S.anno:MESI[S.mese-1]+' '+S.anno}</p></div>${t.pre?`<div style="text-align:right"><p class="eyebrow">Previste</p><span class="num" style="font-size:17px;font-weight:800">${eur(r2(t.pre))}</span><p class="note" style="margin-top:2px">${t.bud?'budget non ancora speso':'da pagare'}</p></div>`:''}</div>${t.bud?`<p class="note">In conto per ${MESI[S.mese-1]}: <strong class="num">${eur(r2(net+t.pre))}</strong> finché non chiudi il mese</p>`:''}${t.n?`<p class="note">${det}</p>`:''}</section>`}
  return tot+lista}
function vRegistro(){
  if(!cats().length)return header('Registro')+onboarding();
  const F=S.regF;
  const all=righeMese(S.anno,S.mese);
  const usc=r2(all.filter(r=>!r.entrata&&r.stato==='effettivo').reduce((a,r)=>a+r.importo,0));
  const ent=r2(all.filter(r=>r.entrata).reduce((a,r)=>a+r.importo,0));const entSim=all.some(r=>r.k==='stip'&&r.stato!=='effettivo');
  const budR=budResiduo(S.anno,S.mese,'tutte');const pre=r2(all.filter(r=>r.stato!=='effettivo'&&r.k!=='stip').reduce((a,r)=>a+r.importo,0)+budR);
  const nDc=all.filter(r=>r.stato==='daconfermare').length;
  const fl=[['tutti','Tutti'],['uscite','Uscite'],['entrate','Entrate'],['previsti','Previsti'],['daconf','Da confermare']];
  const chips=`<div class="seg fit" role="group" aria-label="Filtro">${fl.map(([k,l])=>`<button data-act="regf" data-k="${k}" aria-pressed="${F===k}">${l}</button>`).join('')}</div><div class="two"><div class="field"><label for="reg-cat" class="sr">Categoria</label><select id="reg-cat" data-change="regcat"><option value="tutte">Categorie</option>${catsAnno().map(c=>`<option value="${esc(c.id)}" ${S.regCat===c.id?'selected':''}>${esc(c.nome)}</option>`).join('')}</select></div><div class="field"><label for="reg-met" class="sr">Metodo di pagamento</label><select id="reg-met" data-change="regmet"><option value="tutti">Metodi</option>${metodi().map(m=>`<option value="${esc(m)}" ${S.regMet===m?'selected':''}>${esc(m)}</option>`).join('')}</select></div></div><div class="field"><label for="reg-q" class="sr">Cerca per descrizione</label><input id="reg-q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Cerca per descrizione" value="${esc(S.regQ||'')}" data-input="regq"></div>`;
  const bud=S.D.previsioni.filter(p=>p.anno===S.anno&&p.tipo==='budget'&&p.importi&&p.importi[S.mese-1]!=null&&(S.regCat==='tutte'||p.categoria===S.regCat));
  const yc=Y();
  const budRows=bud.map(p=>{const c=yc.cat.find(x=>x.id===p.categoria);const usato=c?c.reale[S.mese-1]:0;const b=+p.importi[S.mese-1];const pc=Math.min(100,b?usato/b*100:0);const ch=budgetChiuso(p,S.mese),daCh=!ch&&monthState(S.anno,S.mese,today())==='chiuso';
    if(ch)return `<button class="item" data-act="editprev" data-id="${esc(p.id)}"><span class="grow"><span class="t">${esc(p.descrizione)} · consuntivo</span><span class="s num">Budget ${eur(b)} chiuso · conta il registrato</span></span><span class="amt">${eur(usato)}<span class="s" style="display:block;font-weight:500">a consuntivo</span></span></button>`;
    return `<button class="item" data-act="${daCh?'chiusura':'editprev'}" data-id="${esc(p.id)}"><span class="grow"><span class="t">${esc(p.descrizione)} · budget${daCh?' <span class="chip">DA CHIUDERE</span>':''}</span><span class="s num">Usati ${eur(usato)} su ${eur(b)} · in conto ${eur(Math.max(b,usato))}</span><span class="bar" style="margin-top:4px"><i style="width:${pc.toFixed(1)}%;background:${usato>b?'var(--neg)':'var(--accent)'}"></i></span></span>${usato>b?`<span class="amt neg">−${eur(r2(usato-b))}<span class="s" style="display:block;font-weight:500">oltre il budget</span></span>`:`<span class="amt">${eur(r2(b-usato))}<span class="s" style="display:block;font-weight:500">restano</span></span>`}</button>`}).join('');
  return header('Registro')+chips+chiusuraBanner()+`<a class="banner" href="#previsioni" style="background:var(--chip);color:var(--accent-ink);text-decoration:none"><span><strong>Spese previste e ricorrenti</strong> · affitto, rate, abbonamenti, budget</span>${ICON.chev}</a><div class="sum-line"><span><span class="sl-l">Entrate</span><strong class="num pos">${eur(ent)}</strong>${entSim?'<span class="simtag">(Simulate)</span>':''}</span><span><span class="sl-l">Uscite</span><strong class="num">${eur(usc)}</strong><span class="simtag">pagate</span></span><span><span class="sl-l">Previste</span><strong class="num">${eur(pre)}</strong><span class="simtag">${budR?'da pagare + budget':'da pagare'}</span></span></div>`+
   (budRows&&(F==='tutti'||F==='uscite')?`<p class="sec-title">Budget del mese</p><section class="card tight"><div class="list">${budRows}</div></section>`:'')+
   `<div id="reg-res">${regRisultati()}</div>`;
}

// ---------- ENTRATE ----------
function vEntrate(){
  const y=Y();const np=nettiAnno(S.D,S.anno-1);
  const rows=[];
  for(const m of [1,2,3,4,5,6,7,14,8,9,10,11,12,13]){const n=y.netti[m],p=np[m];if(!n&&!p)continue;
    const dn=n&&p?r2(n.netto-p.netto):null,dl=n&&p&&n.lordo!=null&&p.lordo!=null?r2(n.lordo-p.lordo):null;
    rows.push(`<tr class="click" data-act="editstip" data-k="${m}"><td>${nomeStip(m)}</td><td><strong>${n?n2(n.netto):'–'}</strong></td><td>${n&&n.lordo!=null?n2(n.lordo):'–'}</td><td class="${dn<0?'neg':dn>0?'pos':''}">${dn==null?'–':(dn>0?'+':'')+n2(dn)}</td><td class="${dl<0?'neg':dl>0?'pos':''}">${dl==null?'–':(dl>0?'+':'')+n2(dl)}</td><td>${n?`<span class="chip ${n.stato==='confermato'?'ok':'sim'}">${n.stato==='confermato'?'OK':'SIM'}</span>`:''}</td></tr>`)}
  const tl=r2(Object.values(y.netti).reduce((a,n)=>a+(+n.lordo||0),0));
  const pt=r2(Object.values(np).reduce((a,n)=>a+(+n.netto||0),0));const plt=r2(Object.values(np).reduce((a,n)=>a+(+n.lordo||0),0));
  const simAnno=Object.values(y.netti).some(n=>n.stato!=='confermato');
  const tasse=tl?r2(tl-y.totNetti):0,ptasse=plt?r2(plt-pt):0;
  // confronto tra gli anni con stipendi registrati
  const anniS=[...new Set(S.D.stipendi.map(x=>x.anno))].filter(a=>a<=S.anno).sort((a,b)=>b-a);
  const conf=anniS.map(a=>{const N=nettiAnno(S.D,a);const nt=r2(Object.values(N).reduce((s,n)=>s+(+n.netto||0),0)),lt=r2(Object.values(N).reduce((s,n)=>s+(+n.lordo||0),0));const sim=Object.values(N).some(n=>n.stato!=='confermato');return {a,nt,lt,tx:r2(lt-nt),sim}});
  const confRows=conf.map((c,i)=>{const pr=conf[i+1];const d=pr?r2(c.nt-pr.nt):null;return `<tr class="${c.a===S.anno?'sel':''}"><td>${c.a}${c.sim?' <span class="chip sim">SIM</span>':''}</td><td><strong>${n2(c.nt)}</strong></td><td>${n2(r2(c.nt/12))}</td><td>${c.lt?n2(c.lt):'–'}</td><td>${c.lt?(c.tx/c.lt*100).toFixed(2).replace('.',',')+'%':'–'}</td><td class="${d<0?'neg':d>0?'pos':''}">${d==null?'–':(d>0?'+':'')+n2(d)}</td></tr>`}).join('');
  const mv=S.D.movimenti.filter(x=>x.anno===S.anno);
  const spot=mv.filter(x=>x.tipo==='spot').sort((a,b)=>a.mese-b.mese||(a.data||'').localeCompare(b.data||''));
  const resi=mv.filter(x=>x.tipo==='reso').sort((a,b)=>a.mese-b.mese);
  const rip=y.riporto;
  const li=x=>`<button class="item" data-act="editmov" data-id="${esc(x.id)}"><span class="badge in">${MB[x.mese-1]}</span><span class="grow"><span class="t">${esc(x.descrizione)}</span><span class="s">${x.tipo==='reso'?esc(catName(x.categoria))+' · ':entName(x.categoria)?esc(entName(x.categoria))+' · ':''}${fmtDate(x.data)}</span></span><span class="amt pos">+${eur(+x.importo)}</span></button>`;
  return header('Entrate',{month:false,h:'Prospetto Entrate'})+
   `<div class="actions"><button class="pill-btn" data-act="add" data-k="stipendio">+ Stipendio</button><button class="pill-btn soft" data-act="add" data-k="spot">+ Entrata spot</button></div>`+
   `<section class="card"><div class="tiles"><div class="tile hero"><span class="t-l">Stipendio standard</span><span class="t-v num">${eur(y.std)}</span><span class="t-n">(12 netti + 13ª + 14ª) / 12</span></div><div class="tile"><span class="t-l">Netti anno</span><span class="t-v num">${eur(y.totNetti)}</span><span class="t-n num">${pt?'a.p. '+sgn(r2(y.totNetti-pt)):(tl?'Lordo '+eur(tl):'')}</span></div></div><p class="note">I mesi senza netto registrato usano la stima anno precedente (SIM). Quando registri lo stipendio diventa confermato (OK) e lo standard si ricalcola.</p></section>`+
   (rows.length?`<div class="table-box"><table><thead><tr><th>Mese</th><th>Netto</th><th>Lordo</th><th>Δ netto a.p.</th><th>Δ lordo a.p.</th><th>Stato</th></tr></thead><tbody>${rows.join('')}<tr class="tot"><td>Totale</td><td>${n2(y.totNetti)}</td><td>${tl?n2(tl):'–'}</td><td>${pt?(y.totNetti>=pt?'+':'')+n2(r2(y.totNetti-pt)):'–'}</td><td>${plt&&tl?(tl>=plt?'+':'')+n2(r2(tl-plt)):'–'}</td><td></td></tr><tr class="tot"><td>Media mensile</td><td>${n2(r2(y.totNetti/12))}</td><td>${tl?n2(r2(tl/12)):'–'}</td><td>${pt?n2(r2((y.totNetti-pt)/12)):'–'}</td><td>${plt&&tl?n2(r2((tl-plt)/12)):'–'}</td><td></td></tr></tbody></table></div>`+
   (tl?`<section class="card"><h2>Tasse e contributi ${S.anno}${simAnno?' <span class="chip sim">CON STIME</span>':''}</h2><div class="tiles"><div class="tile"><span class="t-l">Lordo − netto</span><span class="t-v num">${eur(tasse)}</span><span class="t-n">${(tasse/tl*100).toFixed(2).replace('.',',')}% del lordo</span></div><div class="tile"><span class="t-l">Media mensile</span><span class="t-v num">${eur(r2(tasse/12))}</span><span class="t-n">${ptasse?'a.p. '+eur(r2(ptasse/12)):'—'}</span></div></div>${ptasse?`<p class="note">${S.anno-1}: ${eur(ptasse)}, ${(ptasse/plt*100).toFixed(2).replace('.',',')}% del lordo · differenza ${sgn(r2(tasse-ptasse))}</p>`:''}</section>`:'')+
   (conf.length>1?`<p class="sec-title">Confronto tra gli anni</p><div class="table-box"><table><thead><tr><th>Anno</th><th>Netto</th><th>Media mese</th><th>Lordo</th><th>Tasse</th><th>Δ netto a.p.</th></tr></thead><tbody>${confRows}</tbody></table></div><p class="note">Netto e lordo comprendono 13ª e 14ª. Media mese = netto / 12 (lo stipendio standard). SIM = anno con netti ancora stimati.</p>`:''):'<p class="empty">Nessuno stipendio registrato per il '+S.anno+' né per l\'anno prima.</p>')+
   `<p class="sec-title">Entrate spot</p><section class="card tight"><div class="list"><button class="item" data-act="editriporto"><span class="badge in">A.P.</span><span class="grow"><span class="t">Riporto dall'anno precedente</span><span class="s">${y.riportoAuto?`Avanzo di Dicembre ${S.anno-1}${y.riportoAvanzo<0?' negativo: non riportato':''} · automatico`:'Inserito a mano · conta solo a Gennaio'}</span></span><span class="amt">${eur(rip)}</span></button>${spot.map(li).join('')}</div></section>`+
   `<p class="sec-title">Storni e resi</p><section class="card tight"><div class="list">${resi.map(li).join('')||'<p class="empty">Nessuno storno o reso. Riducono la spesa della loro categoria.</p>'}</div></section>`;
}

// ---------- ALTRO ----------
function vDati(){
  return header('Dati',{month:false,h:'Dati e collegamento'})+`<section class="card dati-card"><h2>Esporta in Excel</h2><p class="note">Un file .xlsx con tre fogli: Spese (prospetto per categoria e mese, entrate, saldo e avanzo), Registro (tutti i movimenti con metodo e stato, filtrabile) e Stipendi (netti, lordi e confronto con l'anno prima).</p><button class="pill-btn" data-act="export" style="justify-content:center">Scarica Budget_${S.anno}.xlsx</button><hr class="sep"><h2>Collegamento dati</h2><p class="note">${esc(syncLine())}. I dati stanno nel tuo Google Sheet "Budget Michele – Dati app".</p><div class="actions"><button class="pill-btn soft" data-act="syncnow">Sincronizza ora</button><a class="pill-btn soft" href="#collega" style="text-decoration:none;justify-content:center">Cambia collegamento</a></div></section>`;
}
function vAltro(){
  const items=[['entrate','Prospetto Entrate','Stipendi, 13ª e 14ª, entrate spot, storni, riporto'],['prospetto','Prospetto Uscite','Categorie per mese, saldo e avanzo'],['previsioni','Previsioni','Spese di inizio anno: certe, variabili e budget'],['categorie','Categorie','Spese, entrate e metodi di pagamento'],['simula','Simulatore','Prova spese e netti ipotetici'],['dati','Dati e collegamento','Esporta in Excel, sincronizzazione, Google Sheet']];
  const yrs=anni();const nx=S.anno+1;
  return header('Altro',{month:false,h:'Altro'})+`<section class="card tight menu"><div class="list">${items.map(([k,t,s])=>`<a class="item" href="#${k}" style="color:inherit;text-decoration:none"><span class="grow"><span class="t">${t}</span><span class="s">${s}</span></span><span class="chev">${ICON.chev}</span></a>`).join('')}</div></section>`+
  `<section class="card"><h2>Anno</h2><div class="chips" role="group" aria-label="Anno">${yrs.map(a=>`<button data-act="anno" data-k="${a}" aria-pressed="${a===S.anno}">${a}</button>`).join('')}</div>${previsionaleCreato(nx)?'':`<button class="pill-btn soft" data-act="creaanno" data-k="${nx}">Crea previsionale ${nx}</button><p class="note">Riporta nel ${nx} le spese fisse e ricorrenti attive a Dicembre (non le rate e le categorie escluse); le variabili partono da zero. Prima di creare vedi l'elenco.</p>`}</section>`+
  `<section class="card"><h2>Tema</h2><div class="seg" role="group" aria-label="Tema"><button data-act="setmode" data-k="auto" aria-pressed="${S.mode==='auto'}">Automatico</button><button data-act="setmode" data-k="light" aria-pressed="${S.mode==='light'}">Chiaro</button><button data-act="setmode" data-k="dark" aria-pressed="${S.mode==='dark'}">Scuro</button></div></section>`;
}
function vProspetto(){
  const y=Y();
  const st=y.mesi.map(m=>m.stato);
  const fmtc=v=>Math.abs(v)<0.005?'–':n2(v);
  const rowsC=catsAnno().map(cc=>y.cat.find(c=>c.id===cc.id)).filter(Boolean);
  const body=rowsC.map(c=>`<tr class="click" data-act="regcat" data-id="${esc(c.id)}"><td>${esc(c.nome)}</td>${c.mesi.map((v,i)=>`<td class="${st[i]==='futuro'?'fut':''}">${fmtc(v)}</td>`).join('')}<td><strong>${fmtc(r2(c.mesi.reduce((a,b)=>a+b,0)))}</strong></td><td class="muted">${fmtc(media(c,S.anno))}</td></tr>`).join('');
  const r=(l,k,tot)=>`<tr class="tot"><td>${l}</td>${y.mesi.map(m=>`<td class="${k!=='disp'&&k!=='spese'&&m[k]<0?'neg':''}">${fmtc(m[k])}</td>`).join('')}<td>${tot}</td><td></td></tr>`;
  const foot=r('Totale spese','spese',fmtc(r2(y.mesi.reduce((a,m)=>a+m.spese,0))))+r('Disponibilità','disp',fmtc(r2(y.mesi.reduce((a,m)=>a+m.disp,0))))+r('Saldo','saldo',fmtc(y.mesi[11].avanzo))+r('Avanzo cumulato','avanzo','');
  return header('Prospetto',{month:false,h:'Prospetto Uscite'})+`<p class="note">Stipendio standard ${eur(y.std)}. In corsivo i mesi futuri. Tocca una categoria per vederne i movimenti.</p><div class="table-box"><table><thead><tr><th>Categoria</th>${MB.map(m=>`<th>${m}</th>`).join('')}<th>Totale</th><th>Media</th></tr></thead><tbody>${body}${foot}</tbody></table></div>`;
}

// ---------- PREVISIONI / CATEGORIE ----------
const TIPI={certo:'Importo certo',variabile:'Importo variabile',budget:'Budget'};
function mesiLabel(imp){const on=imp.map((v,i)=>v!=null?i:-1).filter(i=>i>=0);if(!on.length)return 'nessun mese';if(on.length===12)return 'tutti i mesi';const runs=[];let s=on[0],p=on[0];for(const i of on.slice(1)){if(i===p+1){p=i;continue}runs.push([s,p]);s=p=i}runs.push([s,p]);return runs.map(([a,b])=>a===b?MB[a]:MB[a]+'–'+MB[b]).join(', ')}
function vPrevisioni(){
  const pv=S.D.previsioni.filter(p=>p.anno===S.anno);
  const groups=cats().map(c=>({c,items:pv.filter(p=>p.categoria===c.id)})).filter(g=>g.items.length);
  return header('Previsioni',{month:false,h:'Previsioni '+S.anno})+`<div class="actions"><button class="pill-btn" data-act="add" data-k="prevista">+ Nuova previsione</button></div>
  <section class="card"><div class="cmp" style="grid-template-columns:auto 1fr;gap:8px 12px"><span class="chip acc">CERTO</span><span class="small">Affitto, telefono, rata auto: diventa pagata da sola il giorno di addebito. Puoi correggerla dopo.</span><span class="chip warn">VARIABILE</span><span class="small">American Express, rate: dal giorno di addebito resta "da confermare" finché non scrivi l'importo vero.</span><span class="chip sim">BUDGET</span><span class="small">Benzina, spesa: un tetto che le spese vere consumano. A mese chiuso conta solo il reale.</span></div></section>`+
   (groups.map(g=>`<p class="sec-title">${esc(g.c.nome)}</p><section class="card tight"><div class="list">${g.items.map(p=>{const s=p.importi.filter(v=>v!=null);const same=s.length&&s.every(v=>+v===+s[0]);return `<button class="item" data-act="editprev" data-id="${esc(p.id)}"><span class="grow"><span class="t">${esc(p.descrizione)}</span><span class="s">${TIPI[p.tipo]||p.tipo}${p.scadenza?' · scadenza':''} · ${mesiLabel(p.importi)}${p.rate?' · a rate':''}${(p.rate||p.serie&&serieRighe(p).length>1)?` · fino a ${MB[serieFine(p).m-1]} ${serieFine(p).anno}`:''}${p.giorno?' · giorno '+esc(p.giorno):''}</span></span><span class="amt">${s.length?(same?eur(+s[0]):'variabile'):'–'}</span></button>`}).join('')}</div></section>`).join('')||'<p class="empty">Nessuna previsione per il '+S.anno+'.</p>');
}
const ordBtns=(act,id,nome,i,n)=>`<button class="ghost" data-act="${act}" data-id="${esc(id)}" data-k="-1" aria-label="Sposta su ${esc(nome)}" ${i===0?'disabled':''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button><button class="ghost" data-act="${act}" data-id="${esc(id)}" data-k="1" aria-label="Sposta giù ${esc(nome)}" ${i===n-1?'disabled':''}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>`;
function vCategorie(){
  const T=S.catTab||'spese';
  const tabs=`<div class="seg" role="group" aria-label="Tipologia"><button data-act="cattab" data-k="spese" aria-pressed="${T==='spese'}">Spese</button><button data-act="cattab" data-k="entrate" aria-pressed="${T==='entrate'}">Entrate</button><button data-act="cattab" data-k="metodi" aria-pressed="${T==='metodi'}">Metodi</button></div>`;
  let body='';
  if(T==='spese'){
    const used=c=>S.D.movimenti.some(s=>s.categoria===c)||S.D.previsioni.some(p=>p.categoria===c);
    const tl={fissa:'Fissa',variabile:'Variabile',investimento:'Investimento',simulazione:'Simulazione'};
    const per=c=>(c.dal?' · dal '+c.dal:'')+(c.al?' · fino al '+c.al:'');
    const all=cats();
    const row=c=>`<div class="item"><span class="grow"><span class="t">${esc(c.nome)}</span><span class="s">${tl[c.tipo]||c.tipo}${per(c)}${c.noprev?' · non riportata':''}${used(c.id)?'':' · non usata'}</span></span>${ordBtns('catmove',c.id,c.nome,all.indexOf(c),all.length)}<button class="link" data-act="editcat" data-id="${esc(c.id)}">Modifica</button></div>`;
    const on=all.filter(c=>catAttiva(c,S.anno)),off=all.filter(c=>!catAttiva(c,S.anno));
    body=`<div class="actions"><button class="pill-btn" data-act="newcat">+ Nuova categoria di spesa</button></div><p class="note">L'ordine è quello del prospetto. Per una spesa che finisce (es. rate dell'iPhone) apri Modifica e scegli da che anno non la usi più: sparisce dagli anni seguenti e resta in quelli passati.</p><p class="sec-title">In uso nel ${S.anno}</p><section class="card tight"><div class="list">${on.map(row).join('')||'<p class="empty">Nessuna categoria. Creane una per iniziare.</p>'}</div></section>`+(off.length?`<p class="sec-title">Non in uso nel ${S.anno}</p><section class="card tight"><div class="list">${off.map(row).join('')}</div></section>`:'');
  }else if(T==='entrate'){
    const all=catEnt();const n=id=>S.D.movimenti.filter(x=>x.tipo==='spot'&&x.categoria===id).length;
    body=`<div class="actions"><button class="pill-btn" data-act="newecat">+ Nuova categoria di entrata</button></div><p class="note">Per le entrate spot: vendite, rimborsi, regali, chiusura conti… Le scegli quando inserisci un'entrata spot.</p><section class="card tight"><div class="list">${all.map((c,i)=>`<div class="item"><span class="grow"><span class="t">${esc(c.nome)}</span><span class="s">${n(c.id)?(n(c.id)===1?'1 entrata':n(c.id)+' entrate'):'non usata'}</span></span>${ordBtns('ecatmove',c.id,c.nome,i,all.length)}<button class="link" data-act="editecat" data-id="${esc(c.id)}">Modifica</button></div>`).join('')||'<p class="empty">Nessuna categoria di entrata. Creane una con il pulsante sopra.</p>'}</div></section>`;
  }else{
    const all=metodi();const n=m=>S.D.movimenti.filter(x=>x.metodo===m).length+S.D.previsioni.filter(x=>x.metodo===m).length;
    body=`<div class="actions"><button class="pill-btn" data-act="newmet">+ Nuovo metodo di pagamento</button></div><p class="note">Conti e carte con cui paghi o ricevi. Sono solo informativi: non cambiano i calcoli.</p><section class="card tight"><div class="list">${all.map((m,i)=>`<div class="item"><span class="grow"><span class="t">${esc(m)}</span><span class="s">${n(m)?(n(m)===1?'usato in 1 voce':'usato in '+n(m)+' voci'):'non usato'}</span></span>${ordBtns('metmove',String(i),m,i,all.length)}<button class="link" data-act="editmet1" data-id="${i}">Modifica</button></div>`).join('')}</div></section>`;
  }
  return header('Categorie',{month:false,h:'Categorie'})+tabs+body;
}
function simData(){
  const D=Object.assign({},S.D);
  D.previsioni=S.D.previsioni.concat(S.sim.extra.map((e,i)=>({id:'sim'+i,anno:S.anno,categoria:e.categoria,descrizione:e.descrizione,tipo:'variabile',importi:e.importi})));
  const ov=Object.entries(S.sim.netti).map(([m,v])=>({anno:S.anno,mese:+m,netto:v,lordo:null,stato:'simulato'}));
  D.stipendi=S.D.stipendi.filter(s=>!(s.anno===S.anno&&S.sim.netti[s.mese]!=null)).concat(ov);
  return D;
}
function vSimula(){
  if(!cats().length)return header('Simulatore')+onboarding();
  const a=Y(),b=Y(S.anno,simData());const mi=S.mese-1;
  const has=S.sim.extra.length||Object.keys(S.sim.netti).length;
  const cmp=(l,x,y)=>`<span>${l}</span><span class="num muted">${sgn(x)}</span><span class="num ${y<0?'neg':'pos'}"><strong>${sgn(y)}</strong></span>`;
  const changed=a.mesi.map((m,i)=>({m:i+1,a:m.saldo,b:b.mesi[i].saldo})).filter(x=>Math.abs(x.a-x.b)>0.004);
  return header('Simulatore')+
  `<section class="card"><h2>Effetto</h2><div class="cmp"><span class="h"></span><span class="h">Oggi</span><span class="h">Simulato</span>${cmp('Saldo '+MESI[mi],a.mesi[mi].saldo,b.mesi[mi].saldo)}${cmp('Avanzo a '+MB[mi],a.mesi[mi].avanzo,b.mesi[mi].avanzo)}${cmp('Fine anno',a.mesi[11].avanzo,b.mesi[11].avanzo)}${cmp('Stipendio standard',a.std,b.std)}</div>${changed.length?`<p class="note">Mesi toccati: ${changed.map(x=>MB[x.m-1]+' '+sgn(r2(x.b-x.a))).join(' · ')}</p>`:'<p class="note">Aggiungi una spesa o un netto ipotetico: i dati reali non cambiano finché non confermi.</p>'}</section>`+
  `<section class="card tight"><div class="row-head" style="padding-top:12px"><h2>Ipotesi</h2></div><div class="list">${S.sim.extra.map((e,i)=>`<div class="item"><span class="grow"><span class="t">${esc(e.descrizione)}</span><span class="s">${esc(catName(e.categoria))} · ${mesiLabel(e.importi)}</span></span><span class="amt">${eur(e.importi.reduce((x,v)=>x+(+v||0),0))}</span><button class="ghost" data-act="simdel" data-k="${i}" aria-label="Togli ipotesi">${ICON.close}</button></div>`).join('')}${Object.entries(S.sim.netti).map(([m,v])=>`<div class="item"><span class="grow"><span class="t">Netto ${nomeStip(+m)}</span><span class="s">Ipotetico</span></span><span class="amt">${eur(+v)}</span><button class="ghost" data-act="simdeln" data-k="${m}" aria-label="Togli netto ipotetico">${ICON.close}</button></div>`).join('')||'<p class="empty">Nessuna ipotesi.</p>'}</div></section>`+
  `<div class="actions"><button class="pill-btn soft" data-act="simspesa">+ Spesa ipotetica</button><button class="pill-btn soft" data-act="simnetto">+ Netto ipotetico</button></div>`+
  (has?`<div class="actions"><button class="pill-btn danger" data-act="simreset">Annulla tutto</button><button class="pill-btn" data-act="simok">Conferma e salva</button></div>`:'');
}

// ---------- fogli ----------
let sheetClose=null;
function openSheet(title,html,mount,opts={}){
  const bd=document.getElementById('sheet');
  bd.innerHTML=`<div class="sheet ${opts.compact?'compact':'tall'}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="grab"></div><div class="sheet-hd"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Chiudi">${ICON.close}</button></div>${html}</div>`;
  bd.hidden=false;
  const close=()=>{bd.hidden=true;bd.innerHTML='';sheetClose=null};
  sheetClose=close;
  bd.onclick=e=>{if(e.target===bd||e.target.closest('[data-close]'))close()};
  if(mount)mount(bd.querySelector('.sheet'),close);
  const f=bd.querySelector('[data-autofocus]');if(f)setTimeout(()=>f.focus(),60);
}
function choiceBox(title,html,opts){
  return new Promise(res=>{openSheet(title,`<p style="margin:0">${html}</p><div class="choice">${opts.map(([k,l],i)=>`<button class="pill-btn ${i===0?'':'soft'}" data-r="${k}">${esc(l)}</button>`).join('')}</div>`,(el,close)=>{el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{close();res(b.dataset.r)})},{compact:true})});
}
function confirmBox(title,text,ok='Conferma',danger=false){
  return new Promise(res=>{openSheet(title,`<div class="cb-text">${text}</div><div class="actions"><button class="pill-btn soft" data-r="0">Annulla</button><button class="pill-btn ${danger?'danger':''}" data-r="1">${esc(ok)}</button></div>`,(el,close)=>{el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{close();res(b.dataset.r==='1')})},{compact:true})});
}
let toastT=0;function toast(t){const el=document.getElementById('toast');const warn=/non riuscit|non valid|^Scrivi|^Non |^Inserisci|^Hai |^Mancano|^Crea prima|^Serve|deve venire|già in corso|^Ogni mese|^Scegli/i.test(t);
  el.className='toast'+(warn?' warn':'');el.innerHTML=`<span class="t-ic" aria-hidden="true">${warn?'!':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'}</span><span class="t-tx"></span>`;el.querySelector('.t-tx').textContent=t;
  el.hidden=false;el.classList.remove('in');void el.offsetWidth;el.classList.add('in');el.onclick=()=>{el.classList.remove('in');setTimeout(()=>el.hidden=true,250)};
  clearTimeout(toastT);toastT=setTimeout(()=>{el.classList.remove('in');setTimeout(()=>el.hidden=true,250)},3200)}
function catOptions(sel){return cats().filter(c=>catAttiva(c,S.anno)||c.id===sel||catHaDati(c.id,S.anno)).map(c=>`<option value="${esc(c.id)}" ${c.id===sel?'selected':''}>${esc(c.nome)}</option>`).join('')}
const annoOptions=(da,sel,n=11)=>Array.from({length:n},(_,i)=>da+i).map(a=>`<option value="${a}" ${a===sel?'selected':''}>${a}</option>`).join('');
// salva una previsione che può proseguire negli anni successivi: list = [{anno,m}] ; una riga per anno, stessa "serie"
async function salvaSerie(base,list,v,serie){const by={};list.forEach(x=>{(by[x.anno]=by[x.anno]||Array(12).fill(null))[x.m-1]=r2(v)});const anni=Object.keys(by).map(Number).sort();
  const sid=anni.length>1?(serie||newId('previsioni')):(serie||null);
  await batch(async()=>{for(const a of anni){await put('previsioni/'+(sid?sid+'-'+a:newId('previsioni')),Object.assign({},base,{anno:a,importi:by[a],effettivi:{},serie:sid}))}});return anni}
function serieRighe(p){return p&&p.serie?S.D.previsioni.filter(x=>x.serie===p.serie).sort((a,b)=>a.anno-b.anno):[p]}
function serieFine(p){const r=serieRighe(p),u=r[r.length-1];let m=0;(u.importi||[]).forEach((v,i)=>{if(v!=null)m=i+1});return {anno:u.anno,m}}
function meseOptions(sel){return MESI.map((n,i)=>`<option value="${i+1}" ${i+1===sel?'selected':''}>${n}</option>`).join('')}
function addebitoOptions(anno,selA,selM){const L=[[anno-1,12]].concat(MESI.map((_,i)=>[anno,i+1]),[[anno+1,1]]);
  return L.map(([a,m])=>`<option value="${a}-${m}" ${a===selA&&m===selM?'selected':''}>${MESI[m-1]}${a!==anno?' '+a:''}</option>`).join('')}
function leggiAddebito(v){const [a,m]=String(v).split('-').map(Number);return {anno:a,mese:m}}
function nomeAddebito(a,m){return MESI[m-1]+(a!==S.anno?' '+a:'')}
function stipOptions(sel){return [...Array(14).keys()].map(i=>`<option value="${i+1}" ${i+1===sel?'selected':''}>${nomeStip(i+1)}</option>`).join('')}
function topCats(){const lim=Date.now()-120*864e5;const cnt={};S.D.movimenti.forEach(x=>{if(x.tipo==='spesa'&&x.categoria){const d=x.data?Date.parse(x.data):0;cnt[x.categoria]=(cnt[x.categoria]||0)+(d>=lim?3:1)}});
  const att=cats().filter(c=>catAttiva(c,S.anno)&&c.tipo!=='investimento'&&c.tipo!=='simulazione');
  const bud=new Set(S.D.previsioni.filter(p=>p.anno===S.anno&&p.tipo==='budget').map(p=>p.categoria));
  const used=att.filter(c=>cnt[c.id]).sort((a,b)=>cnt[b.id]-cnt[a.id]);
  const rest=att.filter(c=>!cnt[c.id]&&(c.tipo==='variabile'||bud.has(c.id)));
  const out=used.concat(rest).slice(0,8);return out.length?out:att.slice(0,8)}
function curM(){return S.anno===today().getFullYear()?today().getMonth()+1:S.mese}

// + : uscita o entrata
function sheetAdd(kind='uscita'){
  if(!cats().length&&kind!=='stipendio'&&kind!=='spot'){toast('Crea prima almeno una categoria');location.hash='#categorie';return}
  const tc=topCats();const def=(tc[0]||{}).id;
  let verso=kind==='uscita'?'uscita':kind==='prevista'?'prevista':'entrata',sub=kind==='spot'?'spot':kind==='reso'?'reso':'stipendio';
  const html=`<div class="seg" role="group" aria-label="Tipo di movimento"><button type="button" data-verso="uscita">Uscita</button><button type="button" data-verso="entrata">Entrata</button><button type="button" data-verso="prevista">Prevista</button></div><p class="note k-prevnote">Una spesa che si ripete o che sai già: affitto, rate, abbonamenti, bollo, budget benzina.</p>
  <div class="seg k-ent" role="group" aria-label="Tipo di entrata"><button type="button" data-sub="stipendio">Stipendio</button><button type="button" data-sub="spot">Spot</button><button type="button" data-sub="reso">Storno / reso</button></div>
  <form id="f-add" novalidate style="display:flex;flex-direction:column;gap:14px">
   <div class="field k-stip"><label for="a-sm">Mensilità</label><select id="a-sm">${stipOptions(curM())}</select></div>
   <div class="field"><label for="a-imp" id="a-implbl">Importo (€)</label><input id="a-imp" class="big num" inputmode="decimal" autocomplete="off" placeholder="0,00" data-autofocus></div>
   <div class="field k-stip"><label for="a-lordo">Lordo (€)</label><input id="a-lordo" class="num" inputmode="decimal" placeholder="facoltativo"></div>
   <div class="field k-cat"><label for="a-cat">Categoria</label><select id="a-cat"><option value="" selected disabled>Scegli una categoria</option>${catOptions('')}</select></div>
   <div class="field k-ecat"><label for="a-ecat">Categoria entrata</label><select id="a-ecat">${ecatOptions('')}</select><p class="note">Le crei in Altro → Categorie → Entrate.</p></div>
   <div class="field k-met"><label id="a-metlbl">Metodo di pagamento</label>${metPick(lastMet()||metodi()[0])}</div>
   <div class="field k-prev"><label>Tipo</label><div class="seg" role="group" aria-label="Tipo di previsione"><button type="button" data-ptipo="certo">Importo certo</button><button type="button" data-ptipo="variabile">Variabile</button><button type="button" data-ptipo="budget">Budget</button></div><p class="note" id="a-ptnote"></p></div>
   <div class="two k-prev"><div class="field"><label for="a-pda">Dal mese (${S.anno})</label><select id="a-pda">${meseOptions(curM())}</select></div><div class="field"><label for="a-pf">Frequenza</label><select id="a-pf"><option value="1">Ogni mese</option><option value="2">Ogni 2 mesi</option><option value="3">Ogni 3 mesi</option><option value="6">Ogni 6 mesi</option><option value="12">Una volta</option></select></div></div>
   <div class="k-prev k-prate"><div class="field"><button type="button" class="switch" id="a-rate" role="switch" aria-checked="false"><span class="sw-t"><strong>È una spesa a rate</strong><span class="small muted">Finanziamento, rate dell'auto o del telefono: finisce alla data di fine e non viene riportata nel previsionale dell'anno dopo.</span></span><span class="sw-k" aria-hidden="true"></span></button></div></div>
   <div class="two k-prev k-pend"><div class="field"><label for="a-pa">Fino al mese</label><select id="a-pa">${meseOptions(12)}</select></div><div class="field"><label for="a-pay">Dell'anno</label><select id="a-pay">${annoOptions(S.anno,S.anno)}</select></div></div>
   <div class="k-prev"><div class="field k-pg"><label for="a-pg">Giorno di addebito</label><input id="a-pg" inputmode="numeric" placeholder="es. 5"></div></div>
   <div class="k-prev k-pscad"><div class="field k-scad"><button type="button" class="switch" id="a-scad" role="switch" aria-checked="false"><span class="sw-t"><strong>È una scadenza</strong><span class="small muted">Rata, bolletta, assicurazione: compare in "Prossime scadenze". La benzina o la spesa no.</span></span><span class="sw-k" aria-hidden="true"></span></button></div></div>
   <p class="note k-prev" id="a-pprev"></p>
   <div class="field k-desc"><label for="a-desc">Descrizione</label><input id="a-desc" autocomplete="off" placeholder="Es. Benzina, Cena, Reso Zalando…"></div>
   <div class="two k-date"><div class="field"><label for="a-data">Data</label><input id="a-data" type="date" value="${isoToday()}"></div><div class="field"><label for="a-mese">Mese di addebito</label><select id="a-mese">${addebitoOptions(S.anno,S.anno,curM())}</select></div></div>
   <div class="field k-rip"><label>Ripartizione</label><div id="a-ripbox"></div></div>
   <p class="note k-resonote">Lo storno o reso riduce la spesa della categoria: il saldo del mese risale dell'importo.</p>
   <div class="actions"><button class="pill-btn" type="submit">Salva</button></div>
  </form>`;
  openSheet('Nuovo movimento',html,(el,close)=>{
    const $=s=>el.querySelector(s);
    const sync=()=>{
      el.querySelectorAll('[data-verso]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.verso===verso));
      el.querySelectorAll('[data-sub]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sub===sub));
      const pv=verso==='prevista',u=verso==='uscita',st=verso==='entrata'&&sub==='stipendio';
      const show=(c,v)=>el.querySelectorAll(c).forEach(x=>x.hidden=!v);
      show('.k-ent',verso==='entrata');show('.k-ecat',verso==='entrata'&&sub==='spot');show('.k-pchips',pv);show('.k-uchips',!pv);show('.k-prevnote',pv);show('.k-prev',pv);show('.k-met',!st);$('#a-metlbl').textContent=u||pv?'Metodo di pagamento':'Accreditato su';show('.k-stip',st);show('.k-cat',u||pv||sub==='reso');show('.k-desc',!st);show('.k-date',!st&&!pv);show('.k-rip',u);show('.k-resonote',verso==='entrata'&&sub==='reso');
      $('#a-implbl').textContent=st?'Netto (€)':pv?(ptipo==='budget'?'Budget al mese (€)':'Importo per addebito (€)'):'Importo (€)';
      el.querySelectorAll('[data-ptipo]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ptipo===ptipo));$('#a-ptnote').textContent=PTN[ptipo];show('.k-pg',pv&&ptipo!=='budget');show('.k-pscad',pv&&ptipo!=='budget');
      if(pv){prevUpd();scadDraw()}
    };
    let scad=null;const scadAuto=()=>{const c=cats().find(x=>x.id===$('#a-cat').value);return !!c&&c.tipo==='fissa'};
    const scadDraw=()=>{const v=scad===null?scadAuto():scad;$('#a-scad').setAttribute('aria-checked',v)};
    let ptipo='certo';const PTN={certo:'Diventa pagata da sola nel giorno di addebito; puoi correggerla dopo.',variabile:'Dal giorno di addebito resta "da confermare" finché non scrivi l\'importo vero.',budget:'Tetto mensile che le spese vere consumano. A mese chiuso conta solo il reale.'};
    const prevMesi=()=>{const da=+$('#a-pda').value,f=+$('#a-pf').value,i0=S.anno*12+da-1,i1=(+$('#a-pay').value)*12+(+$('#a-pa').value)-1;const out=[];if(i1<i0)return out;for(let i=i0;i<=i1;i+=f){out.push({anno:Math.floor(i/12),m:i%12+1});if(f===12)break}return out};
    const prevUpd=()=>{$('.k-pend').hidden=verso!=='prevista'||$('#a-pf').value==='12';const ms_=prevMesi(),v=num($('#a-imp').value);const lab=x=>MB[x.m-1]+(x.anno!==S.anno?' '+String(x.anno).slice(2):'');
      $('#a-pprev').textContent=!ms_.length?'"Fino a" deve venire dopo "Dal mese".':`${ms_.length} ${ms_.length===1?'addebito':'addebiti'}${ms_.length>1?`, da ${MESI[ms_[0].m-1]} ${ms_[0].anno} a ${MESI[ms_[ms_.length-1].m-1]} ${ms_[ms_.length-1].anno}`:`: ${lab(ms_[0])} ${ms_[0].anno}`}${v>0?` · totale ${eur(r2(v*ms_.length))}`:''}.`};
    el.querySelectorAll('[data-ptipo]').forEach(b=>b.onclick=()=>{ptipo=b.dataset.ptipo;if(ptipo==='budget'){$('#a-pf').value='1'}sync()});
    ['#a-pda','#a-pa','#a-pay','#a-pf'].forEach(q=>$(q).addEventListener('change',prevUpd));$('#a-imp').addEventListener('input',()=>{if(verso==='prevista')prevUpd()});
    $('#a-rate').onclick=()=>$('#a-rate').setAttribute('aria-checked',$('#a-rate').getAttribute('aria-checked')!=='true');
    $('#a-scad').onclick=()=>{scad=!($('#a-scad').getAttribute('aria-checked')==='true');scadDraw()};$('#a-cat').addEventListener('change',()=>{if(verso==='prevista')scadDraw()});el.querySelectorAll('.k-pchips [data-cat]').forEach(b=>b.addEventListener('click',()=>setTimeout(scadDraw)));
    sync();
    el.querySelectorAll('[data-verso]').forEach(b=>b.onclick=()=>{verso=b.dataset.verso;sync()});
    el.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{sub=b.dataset.sub;sync()});
    let met=lastMet()||metodi()[0];
    el.querySelectorAll('[data-met]').forEach(b=>b.onclick=()=>{met=b.dataset.met;el.querySelectorAll('[data-met]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
    const sel=$('#a-cat');
    el.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{sel.value=b.dataset.cat;el.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
    sel.onchange=()=>el.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cat===sel.value));
    const d=$('#a-data'),ms=$('#a-mese');d.onchange=()=>{if(!d.value)return;const [y,mm]=d.value.split('-').map(Number);const k=y+'-'+mm;ms.value=[...ms.options].some(o=>o.value===k)?k:S.anno+'-'+mm};
    const imp=$('#a-imp');
    const RE=ripEditor($('#a-ripbox'),{tot:()=>num(imp.value),start:()=>leggiAddebito(ms.value)});
    imp.addEventListener('input',RE.refresh);ms.addEventListener('change',RE.refresh);
    $('#f-add').onsubmit=async e=>{e.preventDefault();if(!(verso==='entrata'&&sub==='stipendio'))setLastMet(met);
      const v=num(imp.value);if(!(v>0)){imp.focus();toast('Scrivi un importo maggiore di zero');return}
      if((verso!=='entrata'||sub==='reso')&&!$('#a-cat').value){$('#a-cat').focus();toast('Scegli una categoria');return}
      const desc=$('#a-desc').value.trim();
      if(verso==='prevista'){const ms_=prevMesi();if(!ms_.length){toast('"Fino a" deve venire dopo "Dal mese"');return}
        const g=parseInt($('#a-pg').value,10);const cat=$('#a-cat').value;
        const anni=await salvaSerie({categoria:cat,descrizione:desc||catName(cat),tipo:ptipo,giorno:ptipo!=='budget'&&g>=1&&g<=31?g:null,scadenza:ptipo!=='budget'&&$('#a-scad').getAttribute('aria-checked')==='true',metodo:met,freq:+$('#a-pf').value,rate:$('#a-rate').getAttribute('aria-checked')==='true'},ms_,v,null);
        const u=ms_[ms_.length-1];close();toast(`Prevista: ${desc||catName(cat)} ${eur(v)} · ${ms_.length} ${ms_.length===1?'mese':'mesi'}${anni.length>1?` fino a ${MESI[u.m-1]} ${u.anno}`:''}`);return}const {anno:annoAdd,mese}=leggiAddebito(ms.value);const data=d.value||null;
      if(verso==='entrata'&&sub==='stipendio'){const m=+$('#a-sm').value,l=num($('#a-lordo').value);
        await put('stipendi/'+S.anno+'-'+pad(m),{anno:S.anno,mese:m,netto:r2(v),lordo:isNaN(l)?null:r2(l),stato:'confermato'});close();toast(`Inserito: stipendio ${nomeStip(m)} ${eur(v)} netto (confermato)`);return}
      if(verso==='entrata'&&sub==='spot'){await put('movimenti/'+newId('movimenti'),{anno:annoAdd,mese,data,tipo:'spot',categoria:$('#a-ecat').value||null,descrizione:desc||entName($('#a-ecat').value)||'Entrata',importo:r2(v),metodo:met});close();toast(`Inserito: +${eur(v)} entrata spot${$('#a-ecat').value?' '+entName($('#a-ecat').value):''} · ${nomeAddebito(annoAdd,mese)}`);return}
      const cat=sel.value;
      if(verso==='entrata'&&sub==='reso'){await put('movimenti/'+newId('movimenti'),{anno:annoAdd,mese,data,tipo:'reso',categoria:cat,descrizione:desc||'Storno / reso',importo:r2(v),metodo:met});close();toast(`Inserito: reso +${eur(v)} su ${catName(cat)} · ${nomeAddebito(annoAdd,mese)}`);return}
      const R=RE.quote();if(!R.ok){toast(R.err);return}
      if(R.list.length===1){const q=R.list[0];const pr=S.D.previsioni.find(p=>p.anno===q.anno&&p.categoria===cat&&(p.tipo==='certo'||p.tipo==='variabile')&&p.importi&&p.importi[q.mese-1]!=null&&!(p.effettivi&&p.effettivi[String(q.mese)]!=null));
        if(pr){close();const ch=await choiceBox('C\'è già una previsione',`A ${MESI[q.mese-1]} è prevista "<strong>${esc(pr.descrizione)}</strong>" da ${eur(+pr.importi[q.mese-1])} (${TIPI[pr.tipo]}). Questa spesa da ${eur(v)} è la stessa?`,[['same','Sì, è la stessa: confermala con '+eur(v)],['new','No, è un\'altra spesa'],['0','Annulla']]);
          if(ch==='0')return;
          if(ch==='same'){const nd=clean(pr);nd.effettivi=Object.assign({},pr.effettivi||{});nd.effettivi[String(q.mese)]=r2(v);await put('previsioni/'+pr.id,nd);toast(`Confermata: ${pr.descrizione} ${MESI[q.mese-1]} ${eur(v)}`);return}
          await salvaQuote({data,tipo:'spesa',categoria:cat,descrizione:desc||catName(cat),metodo:met},v,R.list,null);toast(`Inserito: ${eur(v)} ${catName(cat)} · ${met} · addebito ${nomeAddebito(q.anno,q.mese)}`);return}}
      const base={data,tipo:'spesa',categoria:cat,descrizione:desc||catName(cat),metodo:met};
      await salvaQuote(base,v,R.list,null);
      close();toast(`Inserito: ${eur(v)} ${catName(cat)} · ${met}`+(R.list.length>1?` · ${R.list.map(q=>MB[q.mese-1]+' '+n2(q.importo)).join(', ')}`:` · addebito ${nomeAddebito(R.list[0].anno,R.list[0].mese)}`));
    };
  });
}
function sheetMov(id){
  const s=S.D.movimenti.find(x=>x.id===id);if(!s)return;
  if(s.gruppo&&s.tipo==='spesa')return sheetGruppo(s.gruppo);
  const tit=s.tipo==='spesa'?'Modifica uscita':s.tipo==='reso'?'Modifica storno / reso':'Modifica entrata spot';
  openSheet(tit,`<form id="f-m" novalidate style="display:flex;flex-direction:column;gap:14px">${s.gruppo?`<p class="note">Quota ${esc(s.quota)} di un'uscita da ${eur(+s.totale||0)} ripartita su più mesi.</p>`:''}
   <div class="field"><label for="m-imp">Importo (€)</label><input id="m-imp" class="big num" inputmode="decimal" value="${inp(s.importo)}"></div>
   ${s.tipo!=='spot'?`<div class="field"><label for="m-cat">Categoria</label><select id="m-cat">${catOptions(s.categoria)}</select></div>`:`<div class="field"><label for="m-ecat">Categoria entrata</label><select id="m-ecat">${ecatOptions(s.categoria)}</select></div>`}
   <div class="field"><label for="m-met">${s.tipo==='spesa'?'Metodo di pagamento':'Accreditato su'}</label><select id="m-met">${metOptions(s.metodo||'')}</select></div>
   <div class="field"><label for="m-desc">Descrizione</label><input id="m-desc" value="${esc(s.descrizione)}"></div>
   <div class="two"><div class="field"><label for="m-data">Data</label><input id="m-data" type="date" value="${esc(s.data||'')}"></div><div class="field"><label for="m-mese">Mese di addebito</label><select id="m-mese">${addebitoOptions(s.anno,s.anno,s.mese)}</select></div></div>
   <div class="actions"><button class="pill-btn danger" type="button" id="m-del">Elimina</button><button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    const $=q=>el.querySelector(q);
    $('#f-m').onsubmit=async e=>{e.preventDefault();const v=num($('#m-imp').value);if(!(v>0)){toast('Importo non valido');return}
      const nd=clean(s);Object.assign(nd,{importo:r2(v),descrizione:$('#m-desc').value.trim(),data:$('#m-data').value||null,...leggiAddebito($('#m-mese').value),metodo:$('#m-met').value||null});if($('#m-cat'))nd.categoria=$('#m-cat').value;if($('#m-ecat'))nd.categoria=$('#m-ecat').value||null;
      await put('movimenti/'+s.id,nd);close();toast(`Aggiornato: ${eur(v)}${nd.categoria?' '+(nd.tipo==='spot'?entName(nd.categoria):catName(nd.categoria)):''} · ${nomeAddebito(nd.anno,nd.mese)}`)};
    $('#m-del').onclick=async()=>{close();
      if(s.gruppo){const all=S.D.movimenti.filter(x=>x.gruppo===s.gruppo);if(!await confirmBox('Elimina uscita ripartita',`Eliminare tutte le ${all.length} quote di "${esc(s.descrizione)}"? Per togliere una sola quota, modificane l'importo.`,'Elimina tutte',true))return;for(const x of all)await del('movimenti/'+x.id);toast('Eliminate '+all.length+' quote');return}
      if(await confirmBox('Elimina movimento',`Eliminare "${esc(s.descrizione)}" da ${eur(+s.importo)}?`,'Elimina',true)){await del('movimenti/'+s.id);toast('Movimento eliminato')}};
  });
}
// istanza di una previsione in un mese: conferma / correggi
function sheetIst(pid,m){
  const p=S.D.previsioni.find(x=>x.id===pid);if(!p)return;
  const i=istanze(S.D,p.anno,today()).find(x=>x.p.id===pid&&x.m===m);if(!i)return;
  const eff=p.effettivi&&p.effettivi[String(m)]!=null;
  const info=i.stato==='effettivo'?(i.auto?`Pagata in automatico${p.giorno?' il giorno '+p.giorno:' a fine mese'}. Se l'importo vero è diverso, correggilo.`:'Confermata con l\'importo vero.'):i.stato==='daconfermare'?'Il giorno di addebito è passato: scrivi l\'importo vero per confermarla.':`Prevista per ${MESI[m-1]}${p.giorno?', giorno '+p.giorno:''}.`;
  openSheet(p.descrizione+' · '+MESI[m-1],`<form id="f-i" novalidate style="display:flex;flex-direction:column;gap:14px"><p class="note">${statoChip(i.stato)} ${esc(catName(p.categoria))} · ${TIPI[p.tipo]}. ${info}</p>
   <div class="field"><label for="i-imp">Importo effettivo (€)</label><input id="i-imp" class="big num" inputmode="decimal" value="${inp(i.importo)}" data-autofocus></div>
   <p class="note">Previsto: ${eur(i.previsto)}</p>
   <div class="actions"><button class="pill-btn" type="submit">${i.stato==='effettivo'?'Salva importo':'Conferma come pagata'}</button></div>
   <div class="actions">${eff?'<button class="pill-btn soft" type="button" id="i-undo">Torna al previsto</button>':''}<button class="pill-btn soft" type="button" id="i-edit">Modifica la previsione</button></div></form>`,(el,close)=>{
    const $=q=>el.querySelector(q);
    $('#f-i').onsubmit=async e=>{e.preventDefault();const v=num($('#i-imp').value);if(isNaN(v)||v<0){toast('Importo non valido');return}
      const nd=clean(p);nd.effettivi=Object.assign({},p.effettivi||{});nd.effettivi[String(m)]=r2(v);await put('previsioni/'+p.id,nd);close();toast(`Confermata: ${p.descrizione} ${MESI[m-1]} ${eur(v)}`)};
    if(eff)$('#i-undo').onclick=async()=>{const nd=clean(p);nd.effettivi=Object.assign({},p.effettivi);delete nd.effettivi[String(m)];await put('previsioni/'+p.id,nd);close();toast('Tornata al previsto')};
    $('#i-edit').onclick=()=>{close();sheetPrev(p.id)};
  });
}
function sheetPrev(id){
  const p=id?S.D.previsioni.find(x=>x.id===id):{anno:S.anno,categoria:(cats()[0]||{}).id,descrizione:'',tipo:'certo',giorno:null,importi:Array(12).fill(null)};if(!p)return;
  if(!cats().length){toast('Crea prima almeno una categoria');location.hash='#categorie';return}
  openSheet(id?'Modifica previsione':'Nuova previsione',`<form id="f-p" novalidate style="display:flex;flex-direction:column;gap:14px">
   <div class="field"><label for="p-desc">Descrizione</label><input id="p-desc" value="${esc(p.descrizione)}" placeholder="Es. Affitto, Netflix, Rata auto"></div>
   <div class="field"><label for="p-cat">Categoria</label><select id="p-cat">${catOptions(p.categoria)}</select></div>
   <div class="field"><label>Tipo</label><div class="seg" role="group" aria-label="Tipo"><button type="button" data-tipo="certo">Certo</button><button type="button" data-tipo="variabile">Variabile</button><button type="button" data-tipo="budget">Budget</button></div><p class="note" id="p-tnote"></p></div>
   <div class="field"><label for="p-met">Metodo di pagamento</label><select id="p-met">${metOptions(p.metodo||'')}</select></div>
   <div class="k-g"><div class="field k-scad"><button type="button" class="switch" id="p-scad" role="switch" aria-checked="${p.scadenza?'true':'false'}"><span class="sw-t"><strong>È una scadenza</strong><span class="small muted">Rata, bolletta, assicurazione: compare in "Prossime scadenze". La benzina o la spesa no.</span></span><span class="sw-k" aria-hidden="true"></span></button></div></div>
<div class="field"><button type="button" class="switch" id="p-rate" role="switch" aria-checked="${p.rate?'true':'false'}"><span class="sw-t"><strong>È una spesa a rate</strong><span class="small muted">Finanziamento, rate dell'auto o del telefono: finisce alla data di fine e non viene riportata nel previsionale dell'anno dopo.</span></span><span class="sw-k" aria-hidden="true"></span></button></div>
   <div class="field k-g"><label for="p-g">Giorno di addebito</label><input id="p-g" inputmode="numeric" value="${esc(p.giorno||'')}" placeholder="es. 5 (vuoto = fine mese)"></div>
   <div class="two"><div class="field"><label for="p-all">Importo da ripetere</label><input id="p-all" inputmode="decimal" placeholder="es. 380"></div><div class="field"><label for="p-from">Dal mese (${p.anno})</label><select id="p-from">${meseOptions(1)}</select></div></div>
   <div class="two"><div class="field"><label for="p-n">Per quanti mesi</label><select id="p-n">${Array.from({length:120},(_,i)=>`<option value="${i+1}" ${i===11?'selected':''}>${i+1}${(i+1)%12===0?` (${(i+1)/12} ${i+1===12?'anno':'anni'})`:''}</option>`).join('')}</select></div><div class="field"><label>&nbsp;</label><button class="pill-btn soft" type="button" id="p-fill" style="height:50px">Compila i mesi</button></div></div>
   <div class="grid12">${MB.map((m,i)=>`<div class="field"><label for="p-m${i}">${m}</label><input id="p-m${i}" inputmode="decimal" class="num" value="${inp(p.importi[i])}"></div>`).join('')}</div>
   <p class="note" id="p-fnote">Mese vuoto = nessuna spesa prevista in quel mese.${id&&p.serie&&serieRighe(p).length>1?` Prosegue fino a ${MESI[serieFine(p).m-1]} ${serieFine(p).anno} (${serieRighe(p).map(x=>x.anno).join(', ')}).`:''}</p>
   <div class="actions">${id?'<button class="pill-btn danger" type="button" id="p-del">Elimina</button>':''}<button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    const $=q=>el.querySelector(q);let tipo=p.tipo||'certo';
    const TN={certo:'Diventa pagata da sola il giorno di addebito. Puoi correggerla dopo.',variabile:'Dal giorno di addebito resta "da confermare" finché non scrivi l\'importo vero.',budget:'Tetto mensile: le spese vere della categoria lo consumano. A mese chiuso conta solo il reale.'};
    const sync=()=>{el.querySelectorAll('[data-tipo]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tipo===tipo));$('#p-tnote').textContent=TN[tipo];el.querySelectorAll('.k-g').forEach(x=>x.hidden=tipo==='budget')};sync();
    el.querySelectorAll('[data-tipo]').forEach(b=>b.onclick=()=>{tipo=b.dataset.tipo;sync()});
    $('#p-rate').onclick=()=>$('#p-rate').setAttribute('aria-checked',$('#p-rate').getAttribute('aria-checked')!=='true');
    $('#p-scad').onclick=()=>$('#p-scad').setAttribute('aria-checked',$('#p-scad').getAttribute('aria-checked')!=='true');
    let ext=null;
    $('#p-fill').onclick=()=>{const v=num($('#p-all').value);if(isNaN(v)){toast('Scrivi l\'importo da ripetere');return}const from=+$('#p-from').value-1,n=+$('#p-n').value;for(let i=0;i<12;i++)$('#p-m'+i).value=(i>=from&&i<from+n)?inp(v):'';
      const end=from+n-1;ext={v,list:[]};for(let i=12;i<=end;i++)ext.list.push({anno:p.anno+Math.floor(i/12),m:i%12+1});
      $('#p-fnote').textContent=ext.list.length?`Prosegue fino a ${MESI[end%12]} ${p.anno+Math.floor(end/12)}: i mesi degli anni successivi vengono creati al salvataggio.`:'Mese vuoto = nessuna spesa prevista in quel mese.'+(p.serie&&serieRighe(p).length>1?' Al salvataggio gli anni successivi della serie vengono tolti.':'');
      if(!ext.list.length)ext.trim=true};
    $('#f-p').onsubmit=async e=>{e.preventDefault();const imp=MB.map((_,i)=>{const t=$('#p-m'+i).value;const v=num(t);return t.trim()===''||isNaN(v)?null:r2(v)});
      if(!imp.some(v=>v!=null)){toast('Inserisci almeno un mese');return}
      const g=parseInt($('#p-g').value,10);const cat=$('#p-cat').value;
      const nd={anno:p.anno,categoria:cat,descrizione:$('#p-desc').value.trim()||catName(cat),tipo,importi:imp,giorno:tipo!=='budget'&&g>=1&&g<=31?g:null,scadenza:tipo!=='budget'&&$('#p-scad').getAttribute('aria-checked')==='true',metodo:$('#p-met').value||null,rate:$('#p-rate').getAttribute('aria-checked')==='true',origine:p.origine||null,effettivi:p.effettivi||{}};
      const myId=id||newId('previsioni');
      if(ext&&(ext.list.length||ext.trim)){const sid=p.serie||(ext.list.length?myId:null);nd.serie=sid;nd.freq=p.freq||1;SYNC.hold=(SYNC.hold||0)+1;try{
        if(p.serie)for(const x of S.D.previsioni.filter(x=>x.serie===p.serie&&x.anno>p.anno))await del('previsioni/'+x.id);
        await put('previsioni/'+myId,nd);
        if(ext.list.length){const base=Object.assign({},nd);delete base.anno;delete base.importi;delete base.effettivi;await salvaSerie(base,ext.list,ext.v,sid)}}finally{SYNC.hold--;if(!SYNC.hold)flush()}
        close();const u=ext.list[ext.list.length-1];toast(`${id?'Aggiornata':'Inserita'}: ${nd.descrizione}${u?` fino a ${MESI[u.m-1]} ${u.anno}`:' · '+mesiLabel(imp)}`);return}
      nd.serie=p.serie||null;nd.freq=p.freq||null;
      await put('previsioni/'+myId,nd);close();toast(`${id?'Aggiornata':'Inserita'}: ${nd.descrizione} · ${mesiLabel(imp)}`)};
    if(id)$('#p-del').onclick=async()=>{close();const sr=serieRighe(p);
      if(sr.length>1){const ch=await choiceBox('Elimina previsione',`"${esc(p.descrizione)}" prosegue in più anni (${sr.map(x=>x.anno).join(', ')}). Cosa elimino, comprese le conferme già fatte?`,[['uno','Solo il '+p.anno],['dopo','Dal '+p.anno+' in poi'],['tutti','Tutti gli anni'],['0','Annulla']]);
        if(ch==='0')return;const rm=sr.filter(x=>ch==='tutti'||(ch==='dopo'?x.anno>=p.anno:x.id===id));for(const x of rm)await del('previsioni/'+x.id);toast(rm.length>1?`Previsione eliminata da ${rm.length} anni`:'Previsione eliminata');return}
      if(await confirmBox('Elimina previsione',`Eliminare "${esc(p.descrizione)}" da tutti i mesi del ${p.anno}, comprese le conferme già fatte?`,'Elimina',true)){await del('previsioni/'+id);toast('Previsione eliminata')}};
  });
}
function sheetStip(m){
  const doc=S.D.stipendi.find(x=>x.anno===S.anno&&x.mese===m);const prev=nettiAnno(S.D,S.anno-1)[m];
  const cur=doc||{netto:prev?prev.netto:null,lordo:prev?prev.lordo:null,stato:'simulato'};
  openSheet((doc?'Modifica netto ':'Netto ')+S.anno,`<form id="f-st" novalidate style="display:flex;flex-direction:column;gap:14px">${!doc&&prev?`<p class="note">Ora è simulato con il netto ${S.anno-1}: ${eur(prev.netto)}.</p>`:''}<div class="field"><label for="st-m">Mensilità</label><select id="st-m">${stipOptions(m)}</select></div><div class="two"><div class="field"><label for="st-n">Netto (€)</label><input id="st-n" class="num" inputmode="decimal" value="${inp(cur.netto)}" data-autofocus></div><div class="field"><label for="st-l">Lordo (€)</label><input id="st-l" class="num" inputmode="decimal" value="${inp(cur.lordo)}"></div></div><div class="field"><label>Stato</label><div class="seg" role="group" aria-label="Stato"><button type="button" data-st="confermato">Confermato</button><button type="button" data-st="simulato">Simulato</button></div></div><div class="actions">${doc?'<button class="pill-btn danger" type="button" id="st-del">Elimina</button>':''}<button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    let st=doc?(doc.stato||'confermato'):'confermato';const sy=()=>el.querySelectorAll('[data-st]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.st===st));sy();
    el.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{st=b.dataset.st;sy()});
    el.querySelector('#f-st').onsubmit=async e=>{e.preventDefault();const n=num(el.querySelector('#st-n').value),l=num(el.querySelector('#st-l').value);if(isNaN(n)){toast('Scrivi il netto');return}
      const nm=+el.querySelector('#st-m').value;
      if(nm!==m){const other=S.D.stipendi.find(x=>x.anno===S.anno&&x.mese===nm);
        if(other){close();if(!await confirmBox('Mensilità già presente',`Per ${nomeStip(nm)} ${S.anno} c'è già un netto di ${eur(+other.netto)}. Lo sostituisco con questo?`,'Sostituisci',true))return}}
      await put('stipendi/'+S.anno+'-'+pad(nm),{anno:S.anno,mese:nm,netto:r2(n),lordo:isNaN(l)?null:r2(l),stato:st});
      if(nm!==m&&doc)await del('stipendi/'+doc.id);
      if(sheetClose)close();toast(nm!==m&&doc?`Netto spostato da ${nomeStip(m)} a ${nomeStip(nm)}: ${eur(n)}`:`Netto ${nomeStip(nm)}: ${eur(n)} (${st})`)};
    if(doc)el.querySelector('#st-del').onclick=async()=>{close();if(await confirmBox('Elimina netto',`Eliminare il netto di ${nomeStip(m)} ${S.anno}? Tornerà alla stima anno precedente, se c'è.`,'Elimina',true)){await del('stipendi/'+doc.id);toast('Netto eliminato')}};
  });
}
function sheetRiporto(){
  {const yy=Y();if(yy.riportoAuto){openSheet('Riporto '+S.anno,`<p style="margin:0">Il riporto di Gennaio ${S.anno} è calcolato in automatico: è l'avanzo cumulato di Dicembre ${S.anno-1} (${sgn(yy.riportoAvanzo)}), riportato solo se positivo. Si aggiorna da solo se cambi spese o netti del ${S.anno-1}.</p><div class="actions" style="margin-top:14px"><button class="pill-btn" data-x>Ho capito</button></div>`,(el,close)=>{el.querySelector('[data-x]').onclick=close},{compact:true});return}}
  const v=+((cfg().riporti||{})[S.anno]||0);
  openSheet('Riporto '+S.anno,`<form id="f-r" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="r-v">Riporto dall'anno precedente (€)</label><input id="r-v" class="big num" inputmode="decimal" value="${inp(v)}"></div><p class="note">Si somma alla disponibilità di Gennaio. Negativo se riporti un disavanzo.</p><div class="actions"><button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    el.querySelector('#f-r').onsubmit=async e=>{e.preventDefault();const n=num(el.querySelector('#r-v').value);if(isNaN(n)){toast('Importo non valido');return}const c=JSON.parse(JSON.stringify(cfg()));c.riporti=c.riporti||{};c.riporti[String(S.anno)]=r2(n);await saveConfig(c);close();toast('Riporto: '+eur(n))};
  });
}
function sheetCat(id){
  const c=id?cats().find(x=>x.id===id):{nome:'',tipo:'variabile',dal:S.anno,al:null};if(!c)return;
  const used=id&&(S.D.movimenti.some(s=>s.categoria===id)||S.D.previsioni.some(p=>p.categoria===id));
  const yrs=[...new Set([S.anno-1,S.anno,S.anno+1,c.al].filter(Boolean))].sort();
  const usoOpt=`<option value="" ${!c.al?'selected':''}>In uso, anche negli anni futuri</option>`+yrs.map(y=>`<option value="${y}" ${c.al===y?'selected':''}>Non più usata dal ${y+1} (ultimo anno ${y})</option>`).join('');
  openSheet(id?'Modifica categoria':'Nuova categoria',`<form id="f-c" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="c-n">Nome</label><input id="c-n" value="${esc(c.nome)}" ${id?'':'data-autofocus'} placeholder="Es. Affitto + Spese"></div><div class="field"><label for="c-t">Tipo</label><select id="c-t">${[['fissa','Fissa'],['variabile','Variabile'],['investimento','Investimento'],['simulazione','Simulazione']].map(([k,l])=>`<option value="${k}" ${c.tipo===k?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label for="c-al">Uso</label><select id="c-al">${usoOpt}</select><p class="note">Gli anni in cui la categoria ha già spese o previsioni restano sempre com'erano.${c.dal?` In uso dal ${c.dal}.`:''}</p></div><div class="field"><button type="button" class="switch" id="c-prev" role="switch" aria-checked="${c.noprev?'false':'true'}"><span class="sw-t"><strong>Riporta nel previsionale</strong><span class="small muted">Le sue spese fisse e ricorrenti passano all'anno dopo con "Crea previsionale". Spegnilo per viaggi e acquisti una tantum.</span></span><span class="sw-k" aria-hidden="true"></span></button></div><div class="actions">${id?`<button class="pill-btn danger" type="button" id="c-del" ${used?'disabled':''}>Elimina</button>`:''}<button class="pill-btn" type="submit">Salva</button></div>${used?'<p class="note">Non si può eliminare del tutto perché ha movimenti o previsioni: usa "Non più usata dal…".</p>':''}</form>`,(el,close)=>{
    el.querySelector('#c-prev').onclick=()=>{const b=el.querySelector('#c-prev');b.setAttribute('aria-checked',b.getAttribute('aria-checked')!=='true')};
    el.querySelector('#f-c').onsubmit=async e=>{e.preventDefault();const nome=el.querySelector('#c-n').value.trim();if(!nome){toast('Scrivi un nome');return}
      const alv=el.querySelector('#c-al').value;const al=alv?+alv:null;
      const cf=JSON.parse(JSON.stringify(cfg()));cf.categorie=cf.categorie||[];
      if(id){const x=cf.categorie.find(z=>z.id===id);x.nome=nome;x.tipo=el.querySelector('#c-t').value;x.al=al;x.noprev=el.querySelector('#c-prev').getAttribute('aria-checked')!=='true'}
      else{let nid=nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'categoria';while(cf.categorie.some(z=>z.id===nid))nid+='-2';cf.categorie.push({id:nid,nome,noprev:el.querySelector('#c-prev').getAttribute('aria-checked')!=='true',tipo:el.querySelector('#c-t').value,ordine:Math.max(-1,...cf.categorie.map(z=>z.ordine))+1,dal:S.anno,al})}
      await saveConfig(cf);close();toast((id?'Categoria aggiornata: ':'Categoria creata: ')+nome+(al?` · fino al ${al}`:''))};
    if(id&&!used)el.querySelector('#c-del').onclick=async()=>{close();if(await confirmBox('Elimina categoria',`Eliminare la categoria "${esc(c.nome)}"?`,'Elimina',true)){const cf=JSON.parse(JSON.stringify(cfg()));cf.categorie=cf.categorie.filter(z=>z.id!==id);await saveConfig(cf);toast('Categoria eliminata')}};
  });
}
async function moveCat(id,dir){const cf=JSON.parse(JSON.stringify(cfg()));const arr=cf.categorie.sort((a,b)=>a.ordine-b.ordine);const i=arr.findIndex(c=>c.id===id);const j=i+dir;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];arr.forEach((c,k)=>c.ordine=k);cf.categorie=arr;await saveConfig(cf)}
function sheetSimSpesa(){
  openSheet('Spesa ipotetica',`<form id="f-ss" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="ss-imp">Importo (€)</label><input id="ss-imp" class="big num" inputmode="decimal" placeholder="0,00" data-autofocus></div><div class="field"><label for="ss-desc">Descrizione</label><input id="ss-desc" placeholder="Es. Nuovo telefono"></div><div class="field"><label for="ss-cat">Categoria</label><select id="ss-cat">${catOptions((topCats()[0]||{}).id)}</select></div><div class="two"><div class="field"><label for="ss-m">Dal mese</label><select id="ss-m">${meseOptions(S.mese)}</select></div><div class="field"><label for="ss-n">Per mesi</label><select id="ss-n">${Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}</select></div></div><div class="field"><label for="ss-mod">Come</label><select id="ss-mod"><option value="rip">Ripartisci l'importo sui mesi</option><option value="rep">Ripeti l'importo ogni mese</option></select></div><div class="actions"><button class="pill-btn" type="submit">Aggiungi alla simulazione</button></div></form>`,(el,close)=>{
    el.querySelector('#f-ss').onsubmit=e=>{e.preventDefault();const v=num(el.querySelector('#ss-imp').value);if(!(v>0)){toast('Scrivi un importo');return}const from=+el.querySelector('#ss-m').value-1,n=Math.min(+el.querySelector('#ss-n').value,12-from),rep=el.querySelector('#ss-mod').value==='rep';const imp=Array(12).fill(null);const q=rep?v:r2(v/n);for(let i=0;i<n;i++)imp[from+i]=rep?r2(v):(i===n-1?r2(v-q*(n-1)):q);
      const cat=el.querySelector('#ss-cat').value;S.sim.extra.push({categoria:cat,descrizione:el.querySelector('#ss-desc').value.trim()||catName(cat),importi:imp});close();render()};
  });
}
function sheetSimNetto(){
  openSheet('Netto ipotetico',`<form id="f-sn" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="sn-m">Mensilità</label><select id="sn-m">${stipOptions(S.mese)}</select></div><div class="field"><label for="sn-v">Netto ipotetico (€)</label><input id="sn-v" class="big num" inputmode="decimal" data-autofocus></div><div class="actions"><button class="pill-btn" type="submit">Aggiungi alla simulazione</button></div></form>`,(el,close)=>{
    el.querySelector('#f-sn').onsubmit=e=>{e.preventDefault();const v=num(el.querySelector('#sn-v').value);if(isNaN(v)){toast('Scrivi il netto');return}S.sim.netti[el.querySelector('#sn-m').value]=r2(v);close();render()};
  });
}
async function simConfirm(){
  const n=S.sim.extra.length,k=Object.keys(S.sim.netti).length;
  if(!await confirmBox('Salva la simulazione',`Diventano dati reali: ${n} ${n===1?'previsione':'previsioni'} (tipo variabile) e ${k} ${k===1?'netto':'netti'} (stato simulato). Confermi?`,'Salva'))return;
  for(const e of S.sim.extra)await put('previsioni/'+newId('previsioni'),{anno:S.anno,categoria:e.categoria,descrizione:e.descrizione,tipo:'variabile',giorno:null,importi:e.importi,effettivi:{}});
  for(const [m,v] of Object.entries(S.sim.netti)){const s=S.D.stipendi.find(x=>x.anno===S.anno&&x.mese===+m);await put('stipendi/'+S.anno+'-'+pad(+m),{anno:S.anno,mese:+m,netto:v,lordo:s?s.lordo:null,stato:s&&s.stato==='confermato'?'confermato':'simulato'})}
  S.sim={extra:[],netti:{}};render();toast('Simulazione salvata nei dati');
}
// previsioni dell'anno prima che passano all'anno n (regola di Michele, 10/11/2026):
// fisse/ricorrenti attive a Dicembre → 12 mesi all'importo di Dicembre; periodiche (ogni 2/3/6 mesi, una volta) → stessi mesi;
// escluse: spese a rate, serie che proseguono già, categorie chiuse o con "Riporta nel previsionale" spento, vecchie stime. Variabili: nessuna stima.
function pianoPrevisionale(n){
  const prevY=n-1;const catOk=id=>{const c=cats().find(x=>x.id===id);return !c||(catAttiva(c,n)&&!c.noprev)};
  const giaN=S.D.previsioni.filter(p=>p.anno===n);const porta=[],salta=[];
  S.D.previsioni.filter(p=>p.anno===prevY).forEach(p=>{
    const why=/^Stima da /.test(p.descrizione||'')?'stima':p.rate?'a rate':(p.serie&&S.D.previsioni.some(q=>q.serie===p.serie&&q.anno===n))?'prosegue già':!catOk(p.categoria)?'categoria esclusa':giaN.some(q=>q.categoria===p.categoria&&q.descrizione===p.descrizione)?'già presente':null;
    if(why){if(why!=='stima')salta.push({p,why});return}
    const imp=p.importi||[];let nuovi;
    if((+p.freq||1)>1){nuovi=imp.slice()}
    else if(imp[11]!=null){nuovi=Array(12).fill(+imp[11])}
    else{salta.push({p,why:'finita prima di Dicembre'});return}
    porta.push({p,importi:nuovi})});
  return {porta,salta}}
async function creaAnno(n){
  const prevY=n-1;
  if(!haDati(prevY)){toast('Mancano previsioni e movimenti del '+prevY);return}
  const P=pianoPrevisionale(n);
  const voce=x=>`<li>${esc(x.p.descrizione)} · ${(+x.p.freq||1)>1?eur(+x.importi.find(v=>v!=null))+' · '+mesiLabel(x.importi):eur(x.importi[0])+' al mese'}</li>`;
  const html=`Riporto nel ${n} le spese fisse e ricorrenti del ${prevY} ancora attive a Dicembre, per tutti i 12 mesi all'importo di Dicembre. Le variabili partono da zero. Il riporto di Gennaio è automatico; i netti usano la stima anno precedente.`+
    `<p class="sec-title" style="margin:12px 0 4px">Riporto (${P.porta.length})</p><ul class="plist">${P.porta.map(voce).join('')||'<li>Nessuna</li>'}</ul>`+
    (P.salta.length?`<p class="sec-title" style="margin:12px 0 4px">Non riporto (${P.salta.length})</p><ul class="plist muted">${P.salta.map(x=>`<li>${esc(x.p.descrizione)} · ${x.why}</li>`).join('')}</ul>`:'');
  if(!await confirmBox('Crea previsionale '+n,html,'Crea'))return;
  await batch(async()=>{for(const x of P.porta){const d=clean(x.p);Object.assign(d,{anno:n,importi:x.importi,effettivi:{},serie:null,origine:'previsionale'});await put('previsioni/'+newId('previsioni'),d)}});
  S.anno=n;S.mese=1;location.hash='#home';render();toast(`Previsionale ${n} creato: ${P.porta.length} ${P.porta.length===1?'voce':'voci'}`);
}

// ---------- eventi ----------
document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-act]');if(!b||b.closest('#sheet'))return;
  const a=b.dataset.act,id=b.dataset.id,k=b.dataset.k;
  switch(a){
    case 'mprev':if(S.mese>1){S.mese--;render()}break;
    case 'mnext':if(S.mese<12){S.mese++;render()}break;
    case 'priv':S.priv=!S.priv;try{localStorage.setItem('budget-priv',S.priv?'1':'')}catch(e){}applyPriv();render();break;
    case 'mode':S.mode=S.mode==='auto'?'light':S.mode==='light'?'dark':'auto';saveMode();break;
    case 'setmode':S.mode=k;saveMode();break;
    case 'kpi':S.kpi=k;render();break;
    case 'catall':S.catAll=!S.catAll;render();break;
    case 'setmese':S.mese=+k;render();break;
    case 'dettcat':S.detCat=id;location.hash='#dettaglio';break;
    case 'dueall':S.dueAll=!S.dueAll;render();break;
    case 'regf':S.regF=k;render();break;
    case 'regcat':S.regCat=id;S.regF='tutti';if(S.view!=='registro')location.hash='#registro';else render();break;
    case 'chiusura':sheetChiusura();break;
    case 'godaconf':S.regF='daconf';S.regCat='tutte';const fm=Y().ist.find(i=>i.stato==='daconfermare');if(fm)S.mese=fm.m;location.hash='#registro';break;
    case 'editmov':sheetMov(id);break;
    case 'editist':sheetIst(id,+k);break;
    case 'editprev':sheetPrev(id);break;
    case 'newprev':sheetPrev(null);break;
    case 'editstip':sheetStip(+k);break;
    case 'editriporto':sheetRiporto();break;
    case 'newcat':sheetCat(null);break;
    case 'editcat':sheetCat(id);break;
    case 'catmove':moveCat(id,+k);break;
    case 'cattab':S.catTab=k;render();break;
    case 'newecat':sheetEcat(null);break;
    case 'editecat':sheetEcat(id);break;
    case 'ecatmove':moveEcat(id,+k);break;
    case 'newmet':sheetMet(null);break;
    case 'editmet1':sheetMet(+id);break;
    case 'metmove':moveMet(+id,+k);break;
    case 'add':sheetAdd(k||'uscita');break;
    case 'pickyear':sheetAnno();break;
    case 'setanno':setAnno(+k);break;
    case 'anno':S.anno=+k;S.mese=S.anno===today().getFullYear()?today().getMonth()+1:1;if(S.view!=='home')location.hash='#home';else render();break;
    case 'creaanno':creaAnno(+k);break;
    case 'simspesa':sheetSimSpesa();break;
    case 'simnetto':sheetSimNetto();break;
    case 'simdel':S.sim.extra.splice(+k,1);render();break;
    case 'simdeln':delete S.sim.netti[k];render();break;
    case 'simreset':S.sim={extra:[],netti:{}};render();break;
    case 'simok':simConfirm();break;
    case 'export':esporta();break;
    case 'syncnow':flush().then(()=>toast(syncLine()));break;
  }
});
document.addEventListener('input',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.input==='regq'){S.regQ=t.value;const box=document.getElementById('reg-res');if(box)box.innerHTML=regRisultati()}});
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset)return;if(t.dataset.change==='regcat'){S.regCat=t.value;render()}if(t.dataset.change==='regmet'){S.regMet=t.value;render()}});
function saveMode(){try{localStorage.setItem('budget-mode',S.mode)}catch(e){}applyMode();render()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheetClose)sheetClose()});
function route(){const h=(location.hash||'#home').slice(1);S.view=VIEWS.includes(h)?h:'home';if(sheetClose)sheetClose();render();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);
document.getElementById('fab').onclick=()=>{if(S.ready&&SYNC.api)sheetAdd('uscita')};
route();start();

// ---------- esportazione ----------
let xlLib=null;
function loadExcelJS(){if(window.ExcelJS)return Promise.resolve(window.ExcelJS);if(xlLib)return xlLib;
  const urls=['https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js','https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'];
  xlLib=new Promise((res,rej)=>{const tryN=i=>{if(i>=urls.length){xlLib=null;rej(new Error('lib'));return}const sc=document.createElement('script');sc.src=urls[i];sc.onload=()=>window.ExcelJS?res(window.ExcelJS):tryN(i+1);sc.onerror=()=>tryN(i+1);document.head.appendChild(sc)};tryN(0)});return xlLib}
async function esporta(){
  toast('Preparo il file…');
  try{const X=await loadExcelJS();const wb=buildWorkbook(X,S.D,S.anno,today(),cfg().nome||'Budget');const buf=await wb.xlsx.writeBuffer();
    const name='Budget_'+S.anno+'.xlsx';const type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const file=new File([buf],name,{type});
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name})}catch(e){if(e&&e.name==='AbortError')return;throw e}return}
    const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('File pronto: '+name)}
  catch(e){toast(e&&e.message==='lib'?'Non riesco a caricare il generatore Excel: controlla la connessione':'Esportazione non riuscita, riprova')}
}
const cfgCopy=()=>{const c=JSON.parse(JSON.stringify(cfg()));c.categorie=c.categorie||[];c.entrate=c.entrate||[];c.metodi=(c.metodi&&c.metodi.length?c.metodi:metodi().slice());return c};
function sheetEcat(id){
  const c=id?catEnt().find(x=>x.id===id):{nome:''};if(!c)return;const used=id&&S.D.movimenti.some(x=>x.tipo==='spot'&&x.categoria===id);
  openSheet(id?'Modifica categoria di entrata':'Nuova categoria di entrata',`<form id="f-e" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="e-n">Nome</label><input id="e-n" value="${esc(c.nome)}" ${id?'':'data-autofocus'} placeholder="Es. Vendite usato"></div><div class="actions">${id?`<button class="pill-btn danger" type="button" id="e-del">Elimina</button>`:''}<button class="pill-btn" type="submit">Salva</button></div>${used?'<p class="note">Se la elimini, le entrate già registrate restano ma senza categoria.</p>':''}</form>`,(el,close)=>{
    el.querySelector('#f-e').onsubmit=async e=>{e.preventDefault();const nome=el.querySelector('#e-n').value.trim();if(!nome){toast('Scrivi un nome');return}
      const cf=cfgCopy();if(cf.entrate.some(z=>z.nome.toLowerCase()===nome.toLowerCase()&&z.id!==id)){toast('Esiste già');return}
      if(id)cf.entrate.find(z=>z.id===id).nome=nome;
      else{let nid='e-'+(nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'entrata');while(cf.entrate.some(z=>z.id===nid)||cf.categorie.some(z=>z.id===nid))nid+='-2';cf.entrate.push({id:nid,nome,ordine:Math.max(-1,...cf.entrate.map(z=>z.ordine))+1})}
      await saveConfig(cf);close();toast((id?'Categoria aggiornata: ':'Categoria di entrata creata: ')+nome)};
    if(id)el.querySelector('#e-del').onclick=async()=>{close();if(await confirmBox('Elimina categoria',`Eliminare la categoria di entrata "${esc(c.nome)}"?`,'Elimina',true)){const cf=cfgCopy();cf.entrate=cf.entrate.filter(z=>z.id!==id);await saveConfig(cf);for(const x of S.D.movimenti.filter(x=>x.tipo==='spot'&&x.categoria===id)){const nd=clean(x);nd.categoria=null;await put('movimenti/'+x.id,nd)}toast('Categoria eliminata')}};
  });
}
async function moveEcat(id,dir){const cf=cfgCopy();const arr=cf.entrate.sort((a,b)=>a.ordine-b.ordine);const i=arr.findIndex(c=>c.id===id),j=i+dir;if(i<0||j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];arr.forEach((c,k)=>c.ordine=k);cf.entrate=arr;await saveConfig(cf)}
function setAnno(a){S.anno=a;S.mese=a===today().getFullYear()?today().getMonth()+1:(S.mese||1);render()}
function chiusurePendenti(){return S.ready?budgetDaChiudere(S.D,today()):[]}
function chiusuraBanner(){const L=chiusurePendenti();if(!L.length)return '';const f=L[0];
  return `<button class="banner warn" data-act="chiusura"><span><strong>${L.length===1?`Budget di ${MESI[f.m-1]} da chiudere`:`${L.length} mesi con budget da chiudere`}</strong> · conferma i costi per passarli a consuntivo</span>${ICON.chev}</button>`}
async function chiudiMesi(L){const upd={};const ys={};
  L.forEach(g=>{const yc=ys[g.anno]||(ys[g.anno]=Y(g.anno));g.prev.forEach(p0=>{const p=upd[p0.id]||(upd[p0.id]=Object.assign(clean(S.D.previsioni.find(x=>x.id===p0.id)||p0),{_id:p0.id}));p.effettivi=Object.assign({},p.effettivi||{});const c=yc.cat.find(x=>x.id===p.categoria);p.effettivi[String(g.m)]=c?r2(c.reale[g.m-1]):0})});
  await batch(async()=>{for(const p of Object.values(upd)){const id=p._id;delete p._id;await put('previsioni/'+id,p)}})}
const chiudiMese=g=>chiudiMesi([g]);
function sheetChiusura(){
  const L=chiusurePendenti();if(!L.length)return;const g=L[0],yc=Y(g.anno);
  const righe=g.prev.map(p=>{const c=yc.cat.find(x=>x.id===p.categoria);const r=c?c.reale[g.m-1]:0,b=+p.importi[g.m-1];return `<div class="item" style="padding:10px 0"><span class="grow"><span class="t">${esc(p.descrizione)}</span><span class="s">Budget ${eur(b)} · registrate ${eur(r)}</span></span><span class="amt ${r>b?'neg':''}">${eur(r)}<span class="s" style="display:block;font-weight:500">a consuntivo</span></span></div>`}).join('');
  const opts=[['ok','Sì, conferma '+MESI[g.m-1]],['fix','Li sistemo prima']];if(L.length>1)opts.push(['all',`Conferma tutti i ${L.length} mesi`]);opts.push(['0','Più tardi']);
  openSheet(`Chiusura di ${MESI[g.m-1]} ${g.anno}`,`<p style="margin:0">Il mese è finito. Hai registrato tutti i costi di queste voci a budget? Confermando conta quanto hai registrato e il budget si annulla.</p><div class="list" style="margin-top:6px">${righe}</div><div class="choice">${opts.map(([k,l],i)=>`<button class="pill-btn ${i===0?'':'soft'}" data-r="${k}">${esc(l)}</button>`).join('')}</div>`,(el,close)=>{
    el.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{const k=b.dataset.r;close();
      if(k==='ok'){await chiudiMese(g);toast(`${MESI[g.m-1]} chiuso a consuntivo`);if(chiusurePendenti().length)setTimeout(sheetChiusura,450)}
      else if(k==='all'){await chiudiMesi(L);toast(`${L.length} mesi chiusi a consuntivo`)}
      else if(k==='fix'){S.anno=g.anno;S.mese=g.m;S.regF='tutti';S.regCat=g.prev.length===1?g.prev[0].categoria:'tutte';location.hash='#registro';render();toast('Quando hai finito, tocca "Budget da chiudere"')}});
  },{compact:true});
}
function sheetAnno(){
  const yrs=anni(),cur=today().getFullYear(),nx=yrs.find(a=>a>cur&&!previsionaleCreato(a));
  openSheet('Anno',`<div class="yr-grid">${yrs.map(a=>`<button class="pill-btn ${a===S.anno?'':'soft'}" data-y="${a}">${a}${a===today().getFullYear()?' · in corso':haDati(a)?'':' · vuoto'}</button>`).join('')}</div>${nx?`<button class="link" id="yr-crea" style="align-self:center;margin-top:6px">Crea previsionale ${nx} dal ${nx-1}</button>`:''}`,(el,close)=>{
    if(nx)el.querySelector('#yr-crea').onclick=()=>{close();creaAnno(nx)};
    el.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{close();setAnno(+b.dataset.y)});
  },{compact:true});
}
function sheetMet(i){
  const old=i==null?'':metodi()[i];const n=old?S.D.movimenti.filter(x=>x.metodo===old).length+S.D.previsioni.filter(x=>x.metodo===old).length:0;
  openSheet(old?'Modifica metodo':'Nuovo metodo di pagamento',`<form id="f-mt" novalidate style="display:flex;flex-direction:column;gap:14px"><div class="field"><label for="mt-n">Nome</label><input id="mt-n" value="${esc(old)}" ${old?'':'data-autofocus'} placeholder="Es. Satispay"></div>${n?`<p class="note">Usato in ${n} tra movimenti e previsioni: se lo rinomini li aggiorno tutti.</p>`:''}<div class="actions">${old?`<button class="pill-btn danger" type="button" id="mt-del">Elimina</button>`:''}<button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    el.querySelector('#f-mt').onsubmit=async e=>{e.preventDefault();const nome=el.querySelector('#mt-n').value.trim();if(!nome){toast('Scrivi un nome');return}
      const cf=cfgCopy();if(cf.metodi.some((m,k)=>m.toLowerCase()===nome.toLowerCase()&&k!==i)){toast('Esiste già');return}
      if(old){cf.metodi[i]=nome}else cf.metodi.push(nome);
      await saveConfig(cf);close();
      if(old&&nome!==old){for(const x of S.D.movimenti.filter(x=>x.metodo===old)){const nd=clean(x);nd.metodo=nome;await put('movimenti/'+x.id,nd)}for(const p of S.D.previsioni.filter(p=>p.metodo===old)){const nd=clean(p);nd.metodo=nome;await put('previsioni/'+p.id,nd)}if(lastMet()===old)setLastMet(nome)}
      toast(old?`Metodo rinominato: ${old} → ${nome}`:`Metodo aggiunto: ${nome}`)};
    if(old)el.querySelector('#mt-del').onclick=async()=>{if(metodi().length<2){toast('Serve almeno un metodo');return}close();if(await confirmBox('Elimina metodo',`Eliminare "${esc(old)}" dall'elenco?${n?' I movimenti già registrati lo conservano.':''}`,'Elimina',true)){const cf=cfgCopy();cf.metodi.splice(i,1);await saveConfig(cf);toast('Metodo eliminato')}};
  });
}
async function moveMet(i,dir){const cf=cfgCopy();const j=i+dir;if(j<0||j>=cf.metodi.length)return;[cf.metodi[i],cf.metodi[j]]=[cf.metodi[j],cf.metodi[i]];await saveConfig(cf)}

function syncBanner(){
  if(!SYNC.api)return '';
  if(!navigator.onLine)return `<div class="banner" role="status"><span><strong>Offline</strong> · ${SYNC.queue.length?SYNC.queue.length+' modifiche salvate sul telefono, le invio appena torni online':'vedi i dati salvati sul telefono'}</span></div>`;
  if(SYNC.err)return `<button class="banner" data-act="syncnow"><span><strong>Sincronizzazione non riuscita</strong> · ${SYNC.queue.length} modifiche in attesa. Tocca per riprovare.</span>${ICON.chev}</button>`;
  return '';
}
function vCollega(){
  const a=SYNC.api||{url:DEFAULT_URL,key:''};
  return `<div class="hd"><div><p class="eyebrow">Budget</p><h1 style="font-size:26px;font-weight:800;letter-spacing:-.5px">Collega i tuoi dati</h1></div></div>
  <section class="card"><p class="note">L'app salva tutto nel tuo Google Sheet. Incolla qui l'indirizzo dell'app web di Apps Script e la chiave che trovi in cima allo script. Lo fai una volta sola: poi restano su questo telefono.</p>
  <form id="f-col" novalidate style="display:flex;flex-direction:column;gap:14px">
   <div class="field"><label for="c-url">Indirizzo app web (finisce con /exec)</label><input id="c-url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(a.url)}" placeholder="https://script.google.com/macros/s/…/exec"></div>
   <div class="field"><label for="c-key">Chiave</label><input id="c-key" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(a.key)}"></div>
   <div class="actions"><button class="pill-btn" type="submit">Collega</button></div>
   <p class="note" id="c-msg" role="status"></p>
  </form></section>`;
}
document.addEventListener('submit',async e=>{
  if(e.target.id!=='f-col')return;e.preventDefault();
  const u=document.getElementById('c-url').value,k=document.getElementById('c-key').value,msg=document.getElementById('c-msg');
  if(!/^https:\/\/script\.google(usercontent)?\.com\//.test(u.trim())){msg.textContent='L\'indirizzo deve iniziare con https://script.google.com/';return}
  if(!k.trim()){msg.textContent='Scrivi la chiave';return}
  msg.textContent='Provo il collegamento…';
  try{await collega(u,k);toast('Collegato al tuo Google Sheet');location.hash='#home'}
  catch(err){msg.textContent=String(err.message).includes('chiave')?'La chiave non corrisponde a quella dello script.':'Non riesco a raggiungere lo script. Controlla l\'indirizzo e che la distribuzione sia "Chiunque".'}
});



// ---------- ripartizione di un'uscita ----------
function mesiDa(anno,mese,n=18){const out=[];for(let i=0;i<n;i++){const mm=mese-1+i;out.push({anno:anno+Math.floor(mm/12),mese:mm%12+1})}return out}
const amKey=x=>x.anno+'-'+pad(x.mese);
const amLabel=x=>MESI[x.mese-1]+(x.anno!==S.anno?' '+x.anno:'');
function mesiTutti(c){const out=[];for(let a=c-1;a<=c+1;a++)for(let m=1;m<=12;m++)out.push({anno:a,mese:m});return out}
function ripEditor(box,{tot,start,init}){
  const centro=init&&init.centro||S.anno;let eqStart=null;
  let mode=init?init.mode:'no',n=init&&init.n||2;
  let rows=init&&init.rows?init.rows.map(r=>({am:r.am,v:r.v})):null;
  box.innerHTML=`<div class="seg" role="group" aria-label="Ripartizione"><button type="button" data-rip="no">Nessuna</button><button type="button" data-rip="eq">In parti uguali</button><button type="button" data-rip="cu">Personalizzata</button></div>
   <div class="rip-eq" style="margin-top:10px"><div class="two"><div class="field"><label for="rip-da">Dal mese</label><select id="rip-da"></select></div><div class="field"><label for="rip-n">Per quanti mesi</label><select id="rip-n">${Array.from({length:11},(_,i)=>`<option value="${i+2}" ${i+2===n?'selected':''}>${i+2} mesi</option>`).join('')}</select></div></div></div>
   <div class="rip-cu" style="margin-top:10px;display:flex;flex-direction:column;gap:8px"><div class="rip-rows" style="display:flex;flex-direction:column;gap:8px"></div><button type="button" class="link rip-add" style="align-self:flex-start">+ Aggiungi mese</button></div>
   <p class="note rip-note" style="margin-top:8px"></p>`;
  const $=q=>box.querySelector(q);
  const opts=sel=>mesiTutti(centro).map(x=>`<option value="${amKey(x)}" ${amKey(x)===sel?'selected':''}>${amLabel(x)}</option>`).join('');
  const ensureRows=()=>{if(rows&&rows.length)return;const m=mesiDa(start().anno,start().mese,2);rows=m.map(x=>({am:amKey(x),v:''}))};
  const drawRows=()=>{$('.rip-rows').innerHTML=rows.map((r,i)=>`<div style="display:grid;grid-template-columns:1.2fr 1fr 44px;gap:8px;align-items:center"><select data-i="${i}" class="rip-m" aria-label="Mese della quota ${i+1}" style="height:46px;font-size:16px">${opts(r.am)}</select><input data-i="${i}" class="rip-v num" inputmode="decimal" placeholder="0,00" aria-label="Importo della quota ${i+1}" value="${esc(r.v)}" style="height:46px;font-size:16px;border-radius:12px;border:1px solid var(--line);background:var(--card);padding:0 12px;min-width:0"><button type="button" class="ghost rip-del" data-i="${i}" aria-label="Togli la quota ${i+1}" ${rows.length<=1?'disabled':''}>${ICON.close}</button></div>`).join('');
    box.querySelectorAll('.rip-m').forEach(x=>x.onchange=()=>{rows[+x.dataset.i].am=x.value;note()});
    box.querySelectorAll('.rip-v').forEach(x=>x.oninput=()=>{rows[+x.dataset.i].v=x.value;note()});
    box.querySelectorAll('.rip-del').forEach(x=>x.onclick=()=>{rows.splice(+x.dataset.i,1);drawRows();note()})};
  const drawEq=()=>{const cur=eqStart||amKey(start());$('#rip-da').innerHTML=opts(cur)};
  const calc=()=>{const v=tot();
    if(mode==='no'){const s0=start();return {ok:true,list:[{anno:s0.anno,mese:s0.mese,importo:r2(v||0)}]}}
    if(mode==='eq'){const es=eqStart||amKey(start());const [ea,em]=es.split('-').map(Number);const m=mesiDa(ea,em,n);const q=r2(v/n);return {ok:v>0,err:'Scrivi l\'importo',list:m.map((x,i)=>({anno:x.anno,mese:x.mese,importo:i===n-1?r2(v-q*(n-1)):q}))}}
    const seen=new Set();const list=[];
    for(const r of rows){const a=num(r.v);if(r.v===''||isNaN(a))continue;if(seen.has(r.am))return {ok:false,err:'Ogni mese può comparire una volta sola'};seen.add(r.am);const [an,me]=r.am.split('-').map(Number);list.push({anno:an,mese:me,importo:r2(a)})}
    list.sort((a,b)=>a.anno-b.anno||a.mese-b.mese);
    const somma=r2(list.reduce((s,q)=>s+q.importo,0)),resto=r2((v||0)-somma);
    if(!(v>0))return {ok:false,err:'Scrivi l\'importo',list,resto};
    if(list.length<1)return {ok:false,err:'Inserisci almeno un mese con il suo importo',list,resto};
    if(Math.abs(resto)>0.004)return {ok:false,err:resto>0?`Mancano ${eur(resto)} da ripartire`:`Hai ripartito ${eur(-resto)} in più del totale`,list,resto};
    return {ok:true,list,resto:0}};
  const note=()=>{const R=calc(),el=$('.rip-note');
    if(mode==='no'){el.textContent='Conta tutta nel mese di addebito.';return}
    if(mode==='eq'){el.textContent=R.ok?R.list.map(q=>amLabel(q)+' '+eur(q.importo)).join(' · ')+'. Uscita reale una sola volta.':'Scrivi l\'importo per vedere le quote.';return}
    el.innerHTML=R.ok?'<span class="pos">Ripartito tutto.</span> '+(R.list.length>1?'Uscita reale una sola volta. ':'')+'Puoi scegliere anche mesi passati o dell\'anno prima.':esc(R.err)};
  const sync=()=>{box.querySelectorAll('[data-rip]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rip===mode));
    $('.rip-eq').hidden=mode!=='eq';$('.rip-cu').hidden=mode!=='cu';if(mode==='cu'){ensureRows();drawRows()}if(mode==='eq')drawEq();note()};
  box.querySelectorAll('[data-rip]').forEach(b=>b.onclick=()=>{mode=b.dataset.rip;sync()});
  $('#rip-n').onchange=e=>{n=+e.target.value;note()};
  $('#rip-da').onchange=e=>{eqStart=e.target.value;note()};
  $('.rip-add').onclick=()=>{ensureRows();const used=new Set(rows.map(r=>r.am));const last=rows.length?rows[rows.length-1].am.split('-').map(Number):[start().anno,start().mese];const all=mesiTutti(centro);const nx=mesiDa(last[0],last[1],36).slice(1).find(x=>!used.has(amKey(x))&&all.some(y=>amKey(y)===amKey(x)))||all.find(x=>!used.has(amKey(x)));if(!nx){toast('Hai già usato tutti i mesi disponibili');return}rows.push({am:amKey(nx),v:''});drawRows();note()};
  sync();
  return {quote:calc,refresh:()=>{if(mode==='cu')drawRows();if(mode==='eq')drawEq();note()}};
}
// scrive le quote (sostituendo quelle di un gruppo esistente)
async function salvaQuote(base,totale,list,gruppoVecchio){
  const old=gruppoVecchio?S.D.movimenti.filter(x=>x.gruppo===gruppoVecchio):[];
  if(list.length===1){const q=list[0];const id=old[0]?old[0].id:newId();
    await put('movimenti/'+id,Object.assign({},base,{anno:q.anno,mese:q.mese,importo:r2(totale)}));
    for(const x of old.slice(1))await del('movimenti/'+x.id);return}
  const g=gruppoVecchio||newId();
  for(let i=0;i<list.length;i++){const q=list[i];const id=old[i]?old[i].id:newId();
    await put('movimenti/'+id,Object.assign({},base,{anno:q.anno,mese:q.mese,importo:q.importo,gruppo:g,quota:(i+1)+'/'+list.length,totale:r2(totale)}))}
  for(const x of old.slice(list.length))await del('movimenti/'+x.id);
}
function sheetGruppo(g){
  const qs=S.D.movimenti.filter(x=>x.gruppo===g).sort((a,b)=>a.anno-b.anno||a.mese-b.mese);if(!qs.length)return;
  const s=qs[0];const tot=+s.totale||r2(qs.reduce((a,x)=>a+(+x.importo),0));
  const start={anno:s.anno,mese:s.mese};
  openSheet('Modifica uscita ripartita',`<form id="f-g" novalidate style="display:flex;flex-direction:column;gap:14px">
   <div class="field"><label for="g-imp">Importo totale (€)</label><input id="g-imp" class="big num" inputmode="decimal" value="${inp(tot)}"></div>
   <div class="field"><label for="g-cat">Categoria</label><select id="g-cat">${catOptions(s.categoria)}</select></div>
   <div class="field"><label for="g-met">Metodo di pagamento</label><select id="g-met">${metOptions(s.metodo||'')}</select></div>
   <div class="field"><label for="g-desc">Descrizione</label><input id="g-desc" value="${esc(s.descrizione)}"></div>
   <div class="two"><div class="field"><label for="g-data">Data</label><input id="g-data" type="date" value="${esc(s.data||'')}"></div><div class="field"><label for="g-mese">Primo mese</label><select id="g-mese">${meseOptions(s.mese)}</select></div></div>
   <div class="field"><label>Ripartizione</label><div id="g-ripbox"></div></div>
   <div class="actions"><button class="pill-btn danger" type="button" id="g-del">Elimina</button><button class="pill-btn" type="submit">Salva</button></div></form>`,(el,close)=>{
    const $=q=>el.querySelector(q);const imp=$('#g-imp'),ms=$('#g-mese');
    const RE=ripEditor($('#g-ripbox'),{tot:()=>num(imp.value),start:()=>({anno:start.anno,mese:+ms.value}),init:{mode:'cu',centro:Math.round((qs[0].anno+qs[qs.length-1].anno)/2),rows:qs.map(x=>({am:amKey(x),v:inp(x.importo)}))}});
    imp.addEventListener('input',RE.refresh);ms.addEventListener('change',RE.refresh);
    $('#f-g').onsubmit=async e=>{e.preventDefault();const v=num(imp.value);if(!(v>0)){toast('Importo non valido');return}
      const R=RE.quote();if(!R.ok){toast(R.err);return}
      await salvaQuote({data:$('#g-data').value||null,tipo:'spesa',categoria:$('#g-cat').value,descrizione:$('#g-desc').value.trim(),metodo:$('#g-met').value||null},v,R.list,g);
      close();toast(`Aggiornato: ${eur(v)} · `+R.list.map(q=>MB[q.mese-1]+' '+n2(q.importo)).join(', '))};
    $('#g-del').onclick=async()=>{close();if(!await confirmBox('Elimina uscita ripartita',`Eliminare "${esc(s.descrizione)}" da ${eur(tot)} con tutte le sue ${qs.length} quote?`,'Elimina',true))return;for(const x of qs)await del('movimenti/'+x.id);toast('Uscita eliminata')};
  });
}

// ---------- swipe tra i mesi: come scorrere delle foto ----------
(function(){
  const v=document.getElementById('view');let t=null,gh=null;const GAP=24;
  const calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ok=()=>['home','dashboard','registro','simula','dettaglio'].includes(S.view)&&!sheetClose&&S.ready;
  const clear=()=>{v.style.transition='';v.style.transform='';if(gh){gh.remove();gh=null}};
  // pagina accanto (mese prima a sinistra, mese dopo a destra)
  const ghost=d=>{if(gh&&gh._d===d)return gh;if(gh)gh.remove();const r=v.getBoundingClientRect();
    gh=document.createElement('div');gh._d=d;gh.className=v.className+' pg-ghost';gh.setAttribute('aria-hidden','true');gh.innerHTML=htmlMese(S.mese+d);
    Object.assign(gh.style,{position:'absolute',top:(r.top+window.scrollY)+'px',left:(r.left+window.scrollX)+'px',width:r.width+'px',margin:'0',pointerEvents:'none'});
    document.body.appendChild(gh);return gh};
  const place=(dx,anim)=>{const w=v.offsetWidth+GAP;const tr=anim?'transform .32s cubic-bezier(.2,.8,.2,1)':'none';v.style.transition=tr;v.style.transform=`translateX(${dx}px)`;
    if(gh){gh.style.transition=tr;gh.style.transform=`translateX(${dx+gh._d*w}px)`}};
  v.addEventListener('touchstart',e=>{t=null;if(e.touches.length!==1||!ok())return;if(e.target.closest('.chips,.table-box,input,select,textarea'))return;
    t={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now(),lock:null,dx:0}},{passive:true});
  v.addEventListener('touchmove',e=>{if(!t)return;const dx=e.touches[0].clientX-t.x,dy=e.touches[0].clientY-t.y;
    if(t.lock===null){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;t.lock=Math.abs(dx)>Math.abs(dy)*1.1?'x':'y'}
    if(t.lock!=='x')return;e.preventDefault();
    const d=dx<0?1:-1;const edge=(S.mese===1&&d<0)||(S.mese===12&&d>0);t.edge=edge;t.dx=edge?dx*0.25:dx;
    if(edge){if(gh){gh.remove();gh=null}}else if(!calm)ghost(d);
    place(t.dx,false)},{passive:false});
  const end=()=>{if(!t)return;const s=t;t=null;if(s.lock!=='x')return;
    const w=v.offsetWidth,vel=Math.abs(s.dx)/Math.max(1,Date.now()-s.t),go=!s.edge&&(Math.abs(s.dx)>w*0.18||vel>0.45&&Math.abs(s.dx)>30);
    if(!go){if(calm){clear();return}place(0,true);setTimeout(clear,330);return}
    const d=s.dx<0?1:-1;
    if(calm){S.mese+=d;render();clear();return}
    ghost(d);place(-d*(w+GAP),true);
    setTimeout(()=>{S.mese+=d;render();clear()},330)};
  v.addEventListener('touchend',end,{passive:true});v.addEventListener('touchcancel',()=>{t=null;clear()},{passive:true});
})();
