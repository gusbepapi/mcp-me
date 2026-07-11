# Funzionalità

## v1.0.0

- Il file `README.md` è stato tradotto in diverse lingue;
- I file nella cartella `docs` sono stati tradotti in diverse lingue;
- La pagina di analisi della leggibilità per l’ATS è stata tradotta in diverse lingue;
- È stato creato un lessico di termini (vocabolario tematico) del *curriculum* in CSV per generare i CV in una o più lingue diverse;
- Gli strumenti (`tools`) e i *prompt* (comandi) sono stati aggiunti e tradotti in diverse lingue;
- È stato aggiunto il modello multilingue per l’interfaccia del MCP Inspector;
- I tutorial per gli utenti principianti del MCP `mcp-me` sono stati aggiunti e generati:
  - tramite Pandoc:
    - per HTML *offline*, ottimizzato e ideale per qualsiasi dispositivo;
  - tramite Typst:
    - per PDF in formato A6, ideale per la stampa;
    - per PDF con altezza infinita e larghezza in formato A4, ideale per computer e tablet;
    - per PDF con altezza infinita e larghezza di 480 *pixel*, ideale per qualsiasi *smartphone*;
- I tutorial sono stati tradotti in diverse lingue;
- Il progetto del MCP `mcp-me` è stato ristrutturato e riorganizzato per facilitare agli utenti la creazione dei propri temi, seguendo il sistema di *design* di Pandoc Markdown, $\LaTeX$ e Typst con le convenzioni e filosofie BEM, IBM Carbon e W3C DTCG.

* **Generatori di PDF con diversi motori di *rendering*:** Puoi generare i tuoi CV tramite LaTeX, Pandoc con Puppeteer, ReportLab PDF Toolkit, Typst e/o WeasyPrint. Il sistema supporta la creazione di:
  - **CV funzionali:** adattati a diverse lingue e temi visivi;
  - **CV modulari:** strutturati per diverse carriere, lingue e temi;
  - **CV ibridi:** combinando più di due carriere in un unico documento, personalizzabile in diverse lingue e temi.
* **Architettura multitema:** Questo ti consente di scegliere uno o più temi per i tuoi CV funzionali, modulari e/o ibridi, o persino di creare i tuoi temi personalizzati per i tuoi CV.
* **Architettura modulare:** Potrai selezionare una sola carriera per un curriculum, estraendo esclusivamente la rilevanza dell’esperienza professionale, dell’esperienza accademica, delle competenze, dei corsi e dei certificati, oppure due o più carriere per CV diversi o per lo stesso CV, basando la rilevanza su quelle specifiche carriere.
* **Multilinguismo:** Puoi creare la cartella `i18n` per costruire le chiavi e tradurle in YAML per generare i CV in una, due o più lingue straniere.
* **Supporto del MCP per le immagini Docker e `distrobox`:** Potrai utilizzare le immagini Docker del Gustavo Papi per questo MCP senza dover installare localmente molteplici pacchetti in modo superfluo, evitando così di intasare il tuo sistema o di occupare lo spazio sul tuo disco (rigido/solido). Inoltre, se sei un utente Linux, potrai ricorrere a `distrobox` per isolare tutte o parte delle dipendenze necessarie, mantenendo il tuo sistema operativo completamente pulito.
* **Analisi della leggibilità per l’ATS:** Puoi generare la pagina del pannello di controllo dell’ATS per verificare il punteggio e la precisione delle stringhe (*strings*) di ogni PDF generato con un motore di *rendering* differente. Questo ti permette di verificare i difetti che causano il tuo rifiuto da parte dell’intelligenza artificiale sulle piattaforme di lavoro che utilizzano sistemi ATS con algoritmi per filtrare i candidati.
