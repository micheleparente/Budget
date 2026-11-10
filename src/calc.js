// Motore di calcolo: movimenti (uscite/entrate), previsioni (certo/variabile/budget), stipendi.
function r2(x){return Math.round((x+Number.EPSILON)*100)/100}
function dayStart(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function monthState(anno,m,oggi){const y=oggi.getFullYear(),mm=oggi.getMonth()+1;if(anno<y||(anno===y&&m<mm))return 'chiuso';if(anno===y&&m===mm)return 'corrente';return 'futuro'}
function dataAddebito(anno,m,g){const dim=new Date(anno,m,0).getDate();return new Date(anno,m-1,Math.min(Math.max(1,g||1),dim))}
// Istanze mensili delle previsioni non-budget, con stato
function istanze(D,anno,oggi){
  const out=[];const t=dayStart(oggi);
  (D.previsioni||[]).filter(p=>p.anno===anno&&p.tipo!=='budget').forEach(p=>{
    for(let m=1;m<=12;m++){
      const v=p.importi&&p.importi[m-1];if(v==null)continue;
      const eff=p.effettivi&&p.effettivi[String(m)];
      const scaduta=p.giorno?dataAddebito(anno,m,p.giorno)<=t:monthState(anno,m,oggi)==='chiuso';
      let stato,importo=+v,auto=false;
      if(eff!=null){stato='effettivo';importo=+eff}
      else if(p.tipo==='certo'&&scaduta){stato='effettivo';auto=true}
      else if(p.tipo==='variabile'&&scaduta){stato='daconfermare'}
      else stato='previsto';
      out.push({p,m,stato,importo:r2(importo),previsto:+v,auto});
    }
  });
  return out;
}
// Netti 1..12, 13 (13ª, Dicembre), 14 (14ª, Luglio): reali o simulati dall'anno precedente
function nettiAnno(D,anno){
  const res={};
  for(let m=1;m<=14;m++){
    const s=(D.stipendi||[]).find(x=>x.anno===anno&&x.mese===m);
    if(s){res[m]={netto:+s.netto,lordo:s.lordo==null?null:+s.lordo,stato:s.stato||'confermato',doc:s};continue}
    const p=(D.stipendi||[]).find(x=>x.anno===anno-1&&x.mese===m);
    if(p)res[m]={netto:+p.netto,lordo:p.lordo==null?null:+p.lordo,stato:'simulato',doc:null};
  }
  return res;
}
function annoHaDati(D,a){return (D.movimenti||[]).some(x=>x.anno===a)||(D.previsioni||[]).some(x=>x.anno===a)||(D.stipendi||[]).some(x=>x.anno===a)}
// Riporto di Gennaio: se l'anno prima è nell'app = avanzo di Dicembre dell'anno prima, solo se positivo (automatico);
// un valore inserito a mano (solo per gli anni prima dell'uso dell'app, es. 2026) ha la precedenza.
function riportoInfo(D,anno,oggi){
  const man=((D.config&&D.config.riporti)||{})[String(anno)];
  if(man!=null&&man!=='')return {v:+man||0,auto:false,av:null};
  if(annoHaDati(D,anno-1)){const av=computeYear(D,anno-1,oggi).mesi[11].avanzo;return {v:av>0?av:0,auto:true,av}}
  return {v:+(((D.config&&D.config.riporti)||{})[String(anno)]||0),auto:false,av:null};
}
function budgetChiuso(p,m){return !!(p.effettivi&&p.effettivi[String(m)]!=null)}
// mesi chiusi (passati) con budget non ancora portati a consuntivo
function budgetDaChiudere(D,oggi){const out={};(D.previsioni||[]).filter(p=>p.tipo==='budget').forEach(p=>{for(let m=1;m<=12;m++){const v=p.importi&&p.importi[m-1];if(v==null||budgetChiuso(p,m)||monthState(p.anno,m,oggi)!=='chiuso')continue;const k=p.anno*100+m;(out[k]=out[k]||{anno:p.anno,m,prev:[]}).prev.push(p)}});return Object.keys(out).sort().map(k=>out[k])}
function computeYear(D,anno,oggi){
  const cats=((D.config&&D.config.categorie)||[]).slice().sort((a,b)=>a.ordine-b.ordine);
  const mov=(D.movimenti||[]).filter(x=>x.anno===anno);
  const ist=istanze(D,anno,oggi);
  const bud=(D.previsioni||[]).filter(p=>p.anno===anno&&p.tipo==='budget');
  const N=nettiAnno(D,anno);
  const totNetti=Object.values(N).reduce((a,n)=>a+(+n.netto||0),0);
  const std=r2(totNetti/12);
  const RI=riportoInfo(D,anno,oggi),riporto=RI.v;
  const cat={};
  const mk=(id,c)=>cat[id]||(cat[id]={id,nome:c?c.nome:id,tipo:c?c.tipo:'variabile',mesi:Array(12).fill(0),reale:Array(12).fill(0)});
  cats.forEach(c=>mk(c.id,c));
  for(let m=1;m<=12;m++){
    const closed=monthState(anno,m,oggi)==='chiuso';
    const real={},fixed={},b={};
    mov.filter(x=>x.mese===m).forEach(x=>{
      if(x.tipo==='spesa')real[x.categoria]=(real[x.categoria]||0)+(+x.importo);
      else if(x.tipo==='reso')real[x.categoria]=(real[x.categoria]||0)-(+x.importo);
    });
    ist.filter(i=>i.m===m).forEach(i=>{fixed[i.p.categoria]=(fixed[i.p.categoria]||0)+i.importo});
    // budget: conta max(budget, reale) finché il mese non è chiuso a consuntivo (Eff del mese valorizzato); poi solo reale
    bud.forEach(p=>{const v=p.importi&&p.importi[m-1];if(v!=null&&!budgetChiuso(p,m))b[p.categoria]=(b[p.categoria]||0)+(+v)});
    new Set([...Object.keys(real),...Object.keys(fixed),...Object.keys(b)]).forEach(id=>{
      const c=mk(id,cats.find(x=>x.id===id));const rl=real[id]||0,f=fixed[id]||0,bb=b[id]||0;
      c.reale[m-1]=r2(rl);
      c.mesi[m-1]=r2(f+(bb>0?Math.max(bb,rl):rl));
    });
  }
  const mesi=[];let cum=0;
  for(let m=1;m<=12;m++){
    const spot=r2(mov.filter(x=>x.mese===m&&x.tipo==='spot').reduce((a,x)=>a+(+x.importo),0));
    const disp=r2(std+spot+(m===1?riporto:0));
    const all=Object.values(cat);
    const tot=r2(all.reduce((a,c)=>a+c.mesi[m-1],0));
    const fisse=r2(all.filter(c=>c.tipo==='fissa').reduce((a,c)=>a+c.mesi[m-1],0));
    const saldo=r2(disp-tot);cum=r2(cum+saldo);
    mesi.push({m,spot,disp,spese:tot,fisse,variabili:r2(tot-fisse),saldo,avanzo:cum,stato:monthState(anno,m,oggi),daconf:ist.filter(i=>i.m===m&&i.stato==='daconfermare').length});
  }
  return {anno,std,riporto,riportoAuto:RI.auto,riportoAvanzo:RI.av,netti:N,totNetti:r2(totNetti),cat:Object.values(cat),mesi,ist};
}
if(typeof module!=='undefined')module.exports={computeYear,istanze,nettiAnno,r2,monthState,dataAddebito};
