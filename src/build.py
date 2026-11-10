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
<meta name="theme-color" content="#F3F4F7">
<meta name="robots" content="noindex, nofollow">
<title>Budget Michele</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" href="icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="splash" id="splash" role="status" aria-live="polite" aria-label="Caricamento"><div class="halo" aria-hidden="true"></div><div class="halo h2" aria-hidden="true"></div><svg class="ring" viewBox="0 0 76 76" fill="none" aria-hidden="true"><circle cx="38" cy="38" r="24" stroke="rgba(255,255,255,.25)" stroke-width="7"/><circle class="arc" cx="38" cy="38" r="24" stroke="#fff" stroke-width="7" stroke-linecap="round" transform="rotate(-90 38 38)" pathLength="100"/><circle class="dot" cx="38" cy="38" r="5" fill="#fff"/></svg><div class="word" aria-hidden="true"><span style="animation-delay:0.35s">B</span><span style="animation-delay:0.42s">u</span><span style="animation-delay:0.49s">d</span><span style="animation-delay:0.56s">g</span><span style="animation-delay:0.63s">e</span><span style="animation-delay:0.70s">t</span></div><p class="tag">I tuoi flussi di cassa</p><div class="bottom"><div class="track" aria-hidden="true"><div class="fill" id="splash-fill"></div></div><p id="splash-msg">Avvio…</p></div></div>
<main id="view" aria-live="polite"></main>
<nav class="tabs" aria-label="Sezioni"><div class="in">
<a href="#home" data-v="home">{ic('home')}Home</a>
<a href="#dashboard" data-v="dashboard">{ic('dash')}Dashboard</a>
<button class="fab" id="fab" type="button" aria-label="Nuovo movimento: uscita, entrata o prevista">{ic('plus')}</button>
<a href="#registro" data-v="registro">{ic('list')}Registro</a>
<a href="#altro" data-v="altro">{ic('more')}Altro</a>
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
