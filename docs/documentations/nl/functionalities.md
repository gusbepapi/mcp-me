# Functionaliteiten

## v1.0.0

- Het `README.md`-bestand is vertaald in verschillende talen;
- De bestanden in de map `docs` zijn vertaald in verschillende talen;
- De pagina voor de ATS-leesbaarheidsanalyse is vertaald in verschillende talen;
- Er is een lexicon van termen (thematische woordenschat) voor het cv aangemaakt in CSV om cv’s in één of meer verschillende talen te genereren;
- De tools (`tools`) en *prompts* (commando’s) zijn toegevoegd en vertaald in verschillende talen;
- Het meertalige model is toegevoegd voor de interface van de MCP Inspector;
- De handleidingen voor beginnende gebruikers van de MCP `mcp-me` zijn toegevoegd en gegenereerd:
  - via Pandoc:
    - voor *offline* HTML, gecoptimaliseerd en ideaal voor elk apparaat;
  - via Typst:
    - voor PDF in A6-formaat, ideaal voor drukwerk;
    - voor PDF met oneindige hoogte en de breedte van een A4-formaat, ideaal voor *computers* en *tablets*;
    - voor PDF met oneindige hoogte en een breedte van 480 *pixels*, ideaal voor elke mobiele telefoon;
- De handleidingen zijn vertaald in verschillende talen;
- Het project van de MCP `mcp-me` is geherstructureerd en gereorganiseerd om het voor gebruikers gemakkelijker te maken hun eigen thema’s te maken, volgens het ontwerpsysteem van Pandoc Markdown, $\LaTeX$ en Typst met de conventies en filosofieën van BEM, IBM Carbon en W3C DTCG.

* **PDF-generators met verschillende rendering-engines:** U kunt uw cv’s genereren via LaTeX, Pandoc met Puppeteer, ReportLab PDF Toolkit, Typst en/of WeasyPrint. Het systeem ondersteunt het aanmaken van:
  - **Functionele cv’s:** aangepast aan verschillende talen en visuele thema’s;
  - **Modulaire cv’s:** gestructureerd voor verschillende carrières, talen en thema’s;
  - **Hybride cv’s:** waarbij meer dan twee carrières worden gecombineerd in één enkel document, aanpasbaar in verschillende talen en thema’s.
* **Multi-thema-architectuur:** Hiermee kunt u één of meer thema’s kiezen voor uw functionele, modulaire en/of hybride cv’s, of u kunt zelfs uw eigen thema’s voor uw cv’s maken.
* **Modulaire architectuur:** U kunt slechts één carrière selecteren voor een cv, waarbij alleen de relevantie van de werkervaring, academische achtergrond, vaardigheden, cursussen en certificaten wordt geëxtraheerd, of twee of meer carrières voor verschillende cv’s of voor hetzelfde cv, waarbij de relevantie op die specifieke carrières wordt gebaseerd.
* **Meertaligheid:** U kunt de map `i18n` aanmaken om de sleutels te bouwen en deze in YAML te vertalen om de cv’s in één, twee of meer vreemde talen te genereren.
* **MCP-ondersteuning voor Docker-images en `distrobox`:** U kunt de Docker-images van Gustavo Papi voor deze MCP gebruiken zonder dat u lokaal onnodig veel pakketten hoeft te installeren, waardoor u voorkomt dat uw systeem vervuilt of dat uw schijfruimte (harde schijf/SSD) in beslag wordt genomen. Bovendien kunt u als Linux-gebruiker een beroep doen op `distrobox` om alle of een deel van de vereiste afhankelijkheden te isoleren, zodat uw besturingssysteem volledig schoon blijft.
* **Leesbaarheidsanalyse for het ATS:** U kunt de ATS-dashboardpagina genereren om de score en de nauwkeurigheid van de tekenreeksen (*strings*) te controleren van elke PDF die met een andere rendering-engine is gegenereerd. Hiermee kunt u de fouten controleren die leiden tot uw afwijzing door kunstmatige intelligentie op vacatureplatforms die ATS-systemen met algoritmen gebruiken om kandidaten te filteren.
