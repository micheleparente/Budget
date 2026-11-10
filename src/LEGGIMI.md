# Sorgenti dell'app Budget

`index.html` nella cartella principale è generato da questi file:

    cd src && python3 build.py && cp site/index.html ../index.html && cp sw.js ../sw.js

Modifica sempre i sorgenti qui, poi ricompila. Cambia VERSIONE in sw.js a ogni rilascio.
