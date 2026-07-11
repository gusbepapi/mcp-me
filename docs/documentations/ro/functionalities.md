# Funcționalități

## v1.0.0

- Fișierul `README.md` a fost tradus în mai multe limbi;
- Fișierele din folderul `docs` au fost traduse în mai multe limbi;
- Pagina de analiză a lizibilității pentru ATS a fost tradusă în mai multe limbi;
- A fost creat un lexicon de termeni (vocabular tematic) al CV-ului în format CSV pentru a genera CV-uri în una sau mai multe limbi diferite;
- Instrumentele (`tools`) și *prompt*-urile (comenzile) au fost adăugate și traduse în mai multe limbi;
- A fost adăugat modelul multilingv pentru interfața MCP Inspector;
- Tutorialele pentru utilizatorii începători ai MCP `mcp-me` au fost adăugate și generate:
  - prin Pandoc:
    - pentru HTML *offline*, optimizat și ideal pentru orice dispozitiv;
  - prin Typst:
    - pentru PDF în format A6, ideal pentru tipărire;
    - pentru PDF cu înălțime infinită și lățime în format A4, ideal pentru computere și tablete;
    - pentru PDF cu înălțime infinită și lățime de 480 de pixeli, ideal pentru orice telefon mobil;
- Tutorialele au fost traduse în mai multe limbi;
- Proiectul MCP `mcp-me` a fost restructurat și reorganizat pentru a le permite utilizatorilor să își creeze mai ușor propriile teme, urmând sistemul de design al Pandoc Markdown, $\LaTeX$ și Typst, în conformitate cu convențiile și filozofiile BEM, IBM Carbon și W3C DTCG.

* **Generatoare de PDF cu motoare de randare diferite:** Poți genera CV-urile tale prin LaTeX, Pandoc cu Puppeteer, ReportLab PDF Toolkit, Typst și/sau WeasyPrint. Sistemul suportă crearea de:
  - **CV-uri funcționale:** adaptate pentru diferite limbi și teme vizuale;
  - **CV-uri modulare:** structurate pentru diferite cariere, limbi și teme;
  - **CV-uri hibride:** combinând mai mult de două cariere într-un singur document, personalizabil în diferite limbi și teme.
* **Arhitectură multi-temă:** Acest lucru îți permite să alegi una sau mai multe teme pentru CV-urile tale funcționale, modulare și/sau hibride, sau chiar să îți creezi propriile teme pentru CV-urile tale.
* **Arhitectură modulară:** Vei putea selecta o singură carieră pentru un CV, extragând doar relevanța experienței profesionale, a trecutului academic, a abilităților, cursurilor și certificatelor, sau două sau mai multe cariere pentru CV-uri diferite sau pentru același CV, bazând relevanța pe acele cariere specifice.
* **Multilingvism:** Poți crea folderul `i18n` pentru a construi cheile și a le traduce în YAML pentru a genera CV-urile în una, două sau mai multe limbi străine.
* **Suport MCP pentru imagini Docker și `distrobox`:** Vei putea utiliza imaginile Docker ale lui Gustavo Papi pentru acest MCP fără a fi nevoie să instalezi local mai multe pachete în mod inutil, evitând astfel contaminarea sistemului tău sau ocuparea spațiului pe disc (hard disk/SSD). În plus, dacă ești utilizator de Linux, vei putea apela la `distrobox` pentru a izola toate sau o parte din dependențele necesare, menținând sistemul tău de operare complet curat.
* **Analiza lizibilității pentru ATS:** Poți genera pagina panoului de control ATS pentru a verifica scorul și precizia șirurilor de caractere (*strings*) ale fiecărui PDF generat cu un motor de randare diferit. Acest lucru îți permite să verifici erorile care duc la respingerea ta de către inteligența artificială pe platformele de recrutare care folosesc sisteme ATS cu algoritmi pentru a filtra candidații.
