import re
css=open('style.css').read(); calc=open('calc.js').read().split("if(typeof module")[0]
exp=open('export.js').read().split("if(typeof module")[0]; sync=open('sync.js').read(); app=open('app.js').read()
m=re.search(r"const ICON=\{(.*?)\n\};",app,re.S).group(1)
ic=lambda n: re.search(n+r":'(.*?)'",m).group(1)
html=f'''<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Budget">
<meta name="theme-color" content="#E4E4E7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#2C2C30" media="(prefers-color-scheme: dark)">
<meta name="robots" content="noindex, nofollow">
<title>Budget Michele</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon-b2.png">
<script>try{{var q=(location.search.match(/icona=(scura|chiara)/)||[])[1]||localStorage.getItem('budget-icona');if(q==='scura'){{document.querySelector('link[rel=apple-touch-icon]').href='apple-touch-icon-b2-scura.png';document.querySelector('link[rel=manifest]').href='manifest-scura.webmanifest'}}}}catch(e){{}}</script>
<link rel="icon" href="icon-192-b2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="splash" id="splash" role="status" aria-live="polite" aria-label="Caricamento"><div><div class="word" aria-hidden="true"><span style="animation-delay:0.15s">b</span><span style="animation-delay:0.21s">u</span><span style="animation-delay:0.27s">d</span><span style="animation-delay:0.33s">g</span><span style="animation-delay:0.39s">e</span><span style="animation-delay:0.45s">t</span><span style="animation-delay:0.51s">.</span></div><p class="tag">Flussi di cassa · Michele</p></div><div class="bottom"><div class="row"><p id="splash-msg">Avvio…</p><span id="splash-pct" aria-hidden="true">0%</span></div><div class="track" aria-hidden="true"><div class="fill" id="splash-fill"></div></div></div></div>
<div id="scr"><main id="view" class="pg" aria-live="polite"></main></div>
<nav class="tabs" aria-label="Sezioni"><div class="in">
<a href="#home" data-v="home">{ic('home')}<span>Home</span></a>
<a href="#dashboard" data-v="dashboard">{ic('dash')}<span>Dashboard</span></a>
<button class="fab" id="fab" type="button" aria-label="Nuovo movimento: uscita, entrata o prevista">{ic('plus')}</button>
<a href="#registro" data-v="registro">{ic('list')}<span>Registro</span></a>
<a href="#altro" data-v="altro">{ic('more')}<span>Altro</span></a>
</div></nav>
<div class="backdrop" id="sheet" hidden></div>
<div class="toast" id="toast" role="status" hidden></div>
<script>
{calc}
{exp}
{app.replace("route();start();","")}
{sync}
route();start();
</script>
</body>
</html>'''
open('site/index.html','w').write(html);print(len(html))
