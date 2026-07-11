# Funcionalidades

## v1.0.0

- O ficheiro `README.md` foi traducido a varias linguas;
- Os ficheiros da carpeta `docs` foron traducidos a varias linguas;
- A páxina de análise de lebilidade para o ATS foi traducida a varias linguas;
- Creouse un léxico de termos (vocabulario temático) do currículo en CSV para xerar os currículos nunha ou máis linguas diferentes;
- As ferramentas (`tools`) e os *prompts* (ordes) foron engadidos e traducidos a varias linguas;
- Engadiuse o modelo multilingüe para a interface do MCP Inspector;
- Os titoriais para os usuarios principiantes do MCP `mcp-me` foron engadidos e xerados:
  - por Pandoc:
    - para HTML fóra de liña, optimizado e ideal para calquera dispositivo;
  - por Typst:
    - para PDF en tamaño A6, ideal para impresión;
    - para PDF con altura infinita e largura en tamaño A4, ideal para ordenadores e *tablets*;
    - para PDF con altura infinita e largura de 480 píxeles, ideal para calquera teléfono móbil;
- Os titoriais foron traducidos a varias linguas;
- O proxecto do MCP `mcp-me` foi reestruturado e reorganizado para facilitar que os usuarios creen os seus propios temas, seguindo o sistema de deseño de Pandoc Markdown, $\LaTeX$ e Typst coas convencións e filosofías BEM, IBM Carbon e W3C DTCG.

* **Xeradores de PDF en diferentes motores de renderizado:** Ti podes xerar os teus documentos a través de LaTeX, Pandoc con Puppeteer, ReportLab PDF Toolkit, Typst e/of WeasyPrint. O sistema admite a creación de:
  - **Currículos funcionais:** adaptados a diferentes linguas e temas visuais;
  - **Currículos modulares:** estruturados para diferentes carreiras, linguas e temas;
  - **Currículos híbridos:** combinando máis de dúas carreiras nun único documento, personalizable en diferentes linguas e temas.
* **Arquitectura de múltiples temas:** Isto permite que ti escollas un ou máis temas para os teus currículos funcionais, modulares e/of híbridos, ou mesmo que ti crees os teus propios temas para os teus currículos.
* **Arquitectura modular:** Ti poderás seleccionar só unha carreira para un currículo —extraendo unicamente a relevancia da experiencia profesional, da experiencia académica, das habilidades, dos cursos e certificados—, ou dúas carreiras ou máis para currículos diferentes ou para o mesmo currículo, baseando a relevancia nesas carreiras.
* **Multilingüismo:** Ti podes crear a carpeta `i18n` para construír as claves e traducilas en YAML para xerar os currículos nunha, dúas ou máis linguas estranxeiras.
* **Soporte do MCP para imaxes de Docker e `distrobox`:** Ti poderás utilizar as imaxes de Docker do Gustavo Papi para este MCP sen ter que instalar localmente múltiples paquetes de forma innecesaria, evitando contaminar o teu sistema ou ocupar o teu espaio en disco (ríxido/sólido). Ademais, se es usuario de Linux, poderás recorrer a `distrobox` para illar todas ou algunhas das dependencias necesarias, mantendo o teu sistema operativo totalmente limpo.
* **Análise de lebilidade para o ATS:** Ti podes xerar a páxina do panel de ATS para verificar a puntuació e a precisión de *strings* de cada PDF xerat cun motor de renderizado diferente. Isto permíteche verificar os fallos que provocan o teu rexeitamento por parte da intelixencia artificial nas plataformas de emprego que utilizan sistemas de ATS con algoritmos para filtrar candidatos.
