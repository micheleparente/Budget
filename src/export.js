// Esportazione Excel: fogli Spese (prospetto), Registro, Stipendi. Usa ExcelJS.
function buildWorkbook(ExcelJS,D,anno,oggi,nome){
  const MES=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const MBr=['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
  const y=computeYear(D,anno,oggi);
  const cats=((D.config&&D.config.categorie)||[]).slice().sort((a,b)=>a.ordine-b.ordine).filter(c=>((!c.dal||anno>=c.dal)&&(!c.al||anno<=c.al))||(D.movimenti||[]).some(x=>x.anno===anno&&x.categoria===c.id)||(D.previsioni||[]).some(p=>p.anno===anno&&p.categoria===c.id));
  const wb=new ExcelJS.Workbook();wb.creator='Budget Michele';wb.created=oggi;
  const EUR='#,##0.00 "€";[Red]-#,##0.00 "€"';
  const INK='FF0D0F14',ACC='FF2F5BFF',SOFT='FFEEF0F4',LINE='FFE4E6EB',SUB='FF5A5F6B';
  const FILL={fissa:'FFFDE8E8',variabile:'FFFFF3E2',investimento:'FFE6F4EC',simulazione:'FFE6F1FB'};
  const font=(o={})=>Object.assign({name:'Calibri',size:11,color:{argb:INK}},o);
  const fill=c=>({type:'pattern',pattern:'solid',fgColor:{argb:c}});
  const thin={style:'thin',color:{argb:LINE}};
  const col=n=>{let s='';while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s};
  const head=(row,bg=ACC)=>{row.eachCell(c=>{c.font=font({bold:true,color:{argb:'FFFFFFFF'}});c.fill=fill(bg);c.alignment={vertical:'middle',horizontal:c.col===1?'left':'center'}});row.height=22};
  const futuro=m=>monthState(anno,m,oggi)==='futuro';

  // ---------- SPESE ----------
  const ws=wb.addWorksheet('Spese',{views:[{state:'frozen',xSplit:1,ySplit:4}],properties:{tabColor:{argb:ACC}}});
  ws.columns=[{width:28},...MBr.map(()=>({width:12})),{width:15},{width:13}];
  ws.mergeCells('A1:O1');ws.getCell('A1').value=(nome||'Budget')+' · '+anno;ws.getCell('A1').font=font({size:16,bold:true});
  ws.getCell('A2').value=`Esportato il ${oggi.toLocaleDateString('it-IT')} · stipendio standard ${y.std.toLocaleString('it-IT',{minimumFractionDigits:2})} € · in corsivo grigio i mesi futuri (previsione)`;ws.getCell('A2').font=font({size:10,italic:true,color:{argb:SUB}});
  const hdr=r=>{const row=ws.getRow(r);row.values=[r===4?'ENTRATE':'SPESE',...MBr,'TOTALE ANNO','MEDIA'];head(row,r===4?'FF0A7A4E':ACC)};
  hdr(4);
  const put=(r,label,vals,opt={})=>{const row=ws.getRow(r);row.getCell(1).value=label;vals.forEach((v,i)=>{const c=row.getCell(i+2);c.value=v;c.numFmt=EUR;if(futuro(i+1))c.font=font({italic:true,color:{argb:SUB}})});
    row.getCell(14).value={formula:`SUM(B${r}:M${r})`};row.getCell(14).numFmt=EUR;row.getCell(14).font=font({bold:true});
    if(opt.media!==false){row.getCell(15).value={formula:`AVERAGE(B${r}:M${r})`};row.getCell(15).numFmt=EUR}
    if(opt.fill)row.eachCell({includeEmpty:true},c=>{if(c.col<=15)c.fill=fill(opt.fill)});
    row.eachCell({includeEmpty:true},c=>{if(c.col<=15)c.border={bottom:thin}});return row};
  put(5,'Stipendio standard',y.mesi.map(()=>y.std));
  put(6,'Entrate spot',y.mesi.map(m=>m.spot));
  put(7,'Riporto anno precedente',y.mesi.map((m,i)=>i===0?y.riporto:0),{media:false});
  const te=put(8,'TOTALE ENTRATE',[...Array(12)].map(()=>0),{fill:SOFT,media:false});
  for(let i=0;i<12;i++){const L=col(i+2);te.getCell(i+2).value={formula:`SUM(${L}5:${L}7)`};te.getCell(i+2).font=font({bold:true})}
  te.getCell(1).font=font({bold:true});
  const r0=10;hdr(r0);
  let r=r0+1;const first=r;
  cats.forEach(c=>{const cc=y.cat.find(x=>x.id===c.id);put(r,c.nome,cc?cc.mesi:Array(12).fill(0),{fill:FILL[c.tipo]});r++});
  const last=r-1;
  const ts=put(r,'TOTALE SPESE',[...Array(12)].map(()=>0),{fill:SOFT,media:false});
  for(let i=0;i<12;i++){const L=col(i+2);ts.getCell(i+2).value={formula:`SUM(${L}${first}:${L}${last})`};ts.getCell(i+2).font=font({bold:true})}
  ts.getCell(1).font=font({bold:true});const rTS=r;r+=2;
  const sal=put(r,'Saldo del mese',[...Array(12)].map(()=>0),{media:false});
  for(let i=0;i<12;i++){const L=col(i+2);sal.getCell(i+2).value={formula:`${L}8-${L}${rTS}`}}const rS=r;r++;
  const av=put(r,'Avanzo cumulato',[...Array(12)].map(()=>0),{media:false,fill:SOFT});
  for(let i=0;i<12;i++){const L=col(i+2);av.getCell(i+2).value={formula:i===0?`B${rS}`:`${col(i+1)}${r}+${L}${rS}`};av.getCell(i+2).font=font({bold:true})}
  av.getCell(14).value={formula:`M${r}`};av.getCell(1).font=font({bold:true});r+=2;
  ws.getCell('A'+r).value='Legenda colori: rosso chiaro = categorie fisse · arancio chiaro = variabili · verde = investimenti · azzurro = simulazione';ws.getCell('A'+r).font=font({size:10,italic:true,color:{argb:SUB}});

  // ---------- REGISTRO ----------
  const wr=wb.addWorksheet('Registro',{views:[{state:'frozen',ySplit:1}],properties:{tabColor:{argb:'FFF59E0B'}}});
  const catNome=id=>{const c=cats.find(x=>x.id===id);return c?c.nome:(id||'')};
  const rows=[];
  (D.movimenti||[]).filter(x=>x.anno===anno).forEach(x=>{
    const tipo=x.tipo==='spesa'?'Spesa':x.tipo==='reso'?'Storno / reso':'Entrata spot';
    rows.push({data:x.data?new Date(x.data+'T12:00:00'):null,m:x.mese,mov:x.tipo==='spesa'?'Uscita':'Entrata',tipo,cat:catNome(x.categoria),desc:x.descrizione||'',met:x.metodo||'',u:x.tipo==='spesa'?+x.importo:null,e:x.tipo==='spesa'?null:+x.importo,stato:'Effettivo',quota:x.quota?x.quota+' di '+(+x.totale||0).toLocaleString('it-IT',{minimumFractionDigits:2})+' €':''});
  });
  y.ist.forEach(i=>rows.push({data:dataAddebito(anno,i.m,i.p.giorno||28),m:i.m,mov:'Uscita',tipo:'Prevista ('+(i.p.tipo==='certo'?'certa':'variabile')+')',cat:catNome(i.p.categoria),desc:i.p.descrizione,met:i.p.metodo||'',u:i.importo,e:null,stato:i.stato==='effettivo'?(i.auto?'Pagata (automatica)':'Pagata'):i.stato==='daconfermare'?'Da confermare':'Prevista',quota:''}));
  Object.entries(y.netti).forEach(([mm,n])=>{if(n.stato!=='confermato')return;mm=+mm;const m=mm<=12?mm:mm===13?12:7;rows.push({data:null,m,mov:'Entrata',tipo:'Stipendio',cat:'',desc:'Stipendio '+(mm<=12?MES[mm-1]:mm===13?'13ª':'14ª'),met:'',u:null,e:n.netto,stato:'Effettivo',quota:''})});
  rows.sort((a,b)=>a.m-b.m||((a.data?a.data.getTime():9e15)-(b.data?b.data.getTime():9e15)));
  wr.columns=[{header:'Data',key:'data',width:12},{header:'Mese addebito',key:'mese',width:14},{header:'Movimento',key:'mov',width:11},{header:'Tipo',key:'tipo',width:20},{header:'Categoria',key:'cat',width:24},{header:'Descrizione',key:'desc',width:38},{header:'Metodo',key:'met',width:15},{header:'Uscita',key:'u',width:13},{header:'Entrata',key:'e',width:13},{header:'Stato',key:'stato',width:19},{header:'Ripartizione',key:'quota',width:20}];
  head(wr.getRow(1));
  rows.forEach((x,i)=>{const row=wr.addRow({data:x.data,mese:MES[x.m-1],mov:x.mov,tipo:x.tipo,cat:x.cat,desc:x.desc,met:x.met,u:x.u,e:x.e,stato:x.stato,quota:x.quota});
    row.getCell(1).numFmt='dd/mm/yyyy';row.getCell(8).numFmt=EUR;row.getCell(9).numFmt=EUR;
    if(x.e!=null)row.getCell(9).font=font({color:{argb:'FF0A7A4E'},bold:true});
    if(x.stato==='Prevista'||x.stato==='Da confermare')row.eachCell({includeEmpty:true},c=>{c.font=font({italic:true,color:{argb:x.stato==='Da confermare'?'FF8A4B08':SUB}})});
    if(i%2)row.eachCell({includeEmpty:true},c=>{if(c.col<=11)c.fill=fill('FFF7F8FA')});
  });
  const n=rows.length+1;
  wr.autoFilter={from:'A1',to:'K'+Math.max(2,n)};
  const tot=wr.getRow(n+1);tot.getCell(6).value='TOTALE (rispetta i filtri)';tot.getCell(8).value={formula:`SUBTOTAL(109,H2:H${n})`};tot.getCell(9).value={formula:`SUBTOTAL(109,I2:I${n})`};
  [6,8,9].forEach(k=>{tot.getCell(k).font=font({bold:true});tot.getCell(k).fill=fill(SOFT)});tot.getCell(8).numFmt=EUR;tot.getCell(9).numFmt=EUR;

  // ---------- STIPENDI ----------
  const wt=wb.addWorksheet('Stipendi',{properties:{tabColor:{argb:'FF0A7A4E'}}});
  const np=nettiAnno(D,anno-1);
  wt.columns=[{width:16},{width:13},{width:13},{width:13},{width:13},{width:13},{width:13},{width:13}];
  wt.mergeCells('A1:H1');wt.getCell('A1').value='Stipendi '+anno+' (confronto con '+(anno-1)+')';wt.getCell('A1').font=font({size:16,bold:true});
  const h=wt.getRow(3);h.values=['Mese','Netto '+anno,'Lordo '+anno,'Stato','Netto '+(anno-1),'Lordo '+(anno-1),'Δ netto','Δ lordo'];head(h,'FF0A7A4E');
  for(let m=1;m<=14;m++){const rr=3+m;const a=y.netti[m],p=np[m];const row=wt.getRow(rr);
    row.values=[m<=12?MES[m-1]:m===13?'13ª (Dicembre)':'14ª (Luglio)',a?a.netto:null,a&&a.lordo!=null?a.lordo:null,a?(a.stato==='confermato'?'Confermato':'Simulato'):'',p?p.netto:null,p&&p.lordo!=null?p.lordo:null];
    row.getCell(7).value={formula:`IF(AND(ISNUMBER(B${rr}),ISNUMBER(E${rr})),B${rr}-E${rr},"")`};row.getCell(8).value={formula:`IF(AND(ISNUMBER(C${rr}),ISNUMBER(F${rr})),C${rr}-F${rr},"")`};
    [2,3,5,6,7,8].forEach(k=>row.getCell(k).numFmt=EUR);
    if(a&&a.stato!=='confermato')[2,3,4].forEach(k=>row.getCell(k).font=font({italic:true,color:{argb:SUB}}));
    else if(a)row.getCell(4).font=font({color:{argb:'FF0A7A4E'},bold:true});
    row.eachCell({includeEmpty:true},c=>{if(c.col<=8)c.border={bottom:thin}});
  }
  const R=wt.getRow(18);R.values=['TOTALE'];['B','C','E','F','G','H'].forEach((L,i)=>{const c=R.getCell([2,3,5,6,7,8][i]);c.value={formula:`SUM(${L}4:${L}17)`};c.numFmt=EUR;c.font=font({bold:true});c.fill=fill(SOFT)});R.getCell(1).font=font({bold:true});R.getCell(1).fill=fill(SOFT);
  const M=wt.getRow(19);M.values=['Stipendio standard'];[['B',2],['C',3],['E',5],['F',6]].forEach(([L,k])=>{const c=M.getCell(k);c.value={formula:`${L}18/12`};c.numFmt=EUR;c.font=font({bold:true})});M.getCell(1).font=font({bold:true});
  const T=wt.getRow(20);T.values=['Tasse e contributi'];T.getCell(3).value={formula:'C18-B18'};T.getCell(3).numFmt=EUR;T.getCell(6).value={formula:'F18-E18'};T.getCell(6).numFmt=EUR;
  const P=wt.getRow(21);P.values=['Incidenza su lordo'];P.getCell(3).value={formula:'IF(C18>0,C20/C18,"")'};P.getCell(3).numFmt='0.0%';P.getCell(6).value={formula:'IF(F18>0,F20/F18,"")'};P.getCell(6).numFmt='0.0%';
  wt.getCell('A23').value='Stipendio standard = (12 netti + 13ª + 14ª) / 12. "Simulato" = stima anno precedente, finché non arriva il netto vero.';wt.getCell('A23').font=font({size:10,italic:true,color:{argb:SUB}});
  [ws,wr,wt].forEach(w=>{w.pageSetup={orientation:'landscape',paperSize:9,fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.4,right:.4,top:.5,bottom:.5,header:.2,footer:.2}}});
  return wb;
}
if(typeof module!=='undefined')module.exports={buildWorkbook};
