# Funcionalitats

## v1.0.0

- El fitxer `README.md` s’ha traduït a diverses llengües;
- Els fitxers de la carpeta `docs` s’han traduït a diverses llengües;
- La pàgina d’anàlisi de llegibilitat per a l’ATS s’ha traduït a diverses llengües;
- S’ha creat un lèxic de termes (vocabulari temàtic) del *currículum* en CSV per generar els *currículums* en una o més llengües diferents;
- Les eines (`tools`) i els *prompts* (ordres) s’han afegit i s’han traduït a diverses llengües;
- S’ha afegit el model multilingüe per a la interfície del MCP Inspector;
- Els tutorials per als usuaris principiants del MCP `mcp-me` s’han afegit i s’han generat:
  - per Pandoc:
    - per a HTML fora de línia, optimitzat i ideal per a qualsevol dispositiu;
  - per Typst:
    - per a PDF en mida A6, ideal per a impressió;
    - per a PDF amb altura infinita i amplada en mida A4, ideal per a ordinadors i tauletes;
    - per a PDF amb altura infinita i amplada de 480 *píxels*, ideal per a qualsevol telèfon mòbil;
- Els tutorials s’han traduït a diverses llengües;
- El projecte del MCP `mcp-me` s’ha reestructurat i reorganitzat per facilitar que els usuaris creïn els seus propis temes, seguint el sistema de disseny de Pandoc Markdown, $\LaTeX$ i Typst amb les convencions i filosofies BEM, IBM Carbon i W3C DTCG.

* **Generadors de PDF amb diferents motors de renderització:** Tu pots generar els teus *currículums* a través de LaTeX, Pandoc amb Puppeteer, ReportLab PDF Toolkit, Typst i/o WeasyPrint. El sistema admet la creació de:
  - ***Currículums* funcionals:** adaptats a diferents llengües i temes visuals;
  - ***Currículums* modulars:** estructurats per a diferents carreres, llengües i temes;
  - ***Currículums* híbrids:** combinant més de dues carreres en un únic document, personalitzable en diferents llengües i temes.
* **Arquitectura de múltiples temes:** Això permet que tu triïs un o més temes per als teus *currículums* funcionals, modulars i/o híbrids, o fins i tot que tu creïs els teus propis temes per als teus *currículums*.
* **Arquitectura modular:** Tu podràs seleccionar només una carrera per a un currículum, extraient únicament la rellevància de l’experiència professional, de l’experiència acadèmica, de les habilitats, dels cursos i certificats, o dues carreres o més per a *currículums* diferents o per al mateix currículum, basant la rellevància en aquestes carreres.
* **Multilingüisme:** Tu pots crear la carpeta `i18n` per construir les claus i traduir-les en YAML per generar els *currículums* en una, dues o més llengües estrangeres.
* **Suport del MCP per a imatges de Docker i `distrobox`:** Tu podràs utilitzar les imatges de Docker del Gustavo Papi per a aquest MCP sense haver d’instal·lar localment múltiples paquets de forma innecessària, evitant contaminar el teu sistema o l’ús del teu espai en disc (rígid/sòlid). A més, si ets usuari de Linux, podràs recórrer a `distrobox` per aïllar totes o algunes de les dependències necessàries, mantenint el teu sistema operatiu totalment net.
* **Anàlisi de llegibilitat per a l’ATS:** Tu pots generar la pàgina del panell d’ATS per verificar la puntuació i la precisió de les cadenes de caràcters (*strings*) de cada PDF generat amb un motor de renderització diferent. Això et permet verificar les errades que provoquen el teu rebuig per part de la intel·ligència artificial a les plataformes d’ocupació que utilitzen sistemes d’ATS amb algoritmes per filtrar candidats.
