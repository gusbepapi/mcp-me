# Funcionalidades

## v1.0.0

- O ficheiro `README.md` foi traduzido em várias línguas;
- Os ficheiros na pasta `docs` foram traduzidos em várias línguas;
- A página de análise de legibilidade para o ATS foi traduzida em várias línguas;
- Foi criado um léxico de termos (vocabulário temático) do currículo em CSV para gerar os currículos em uma ou mais línguas diferentes;
- As ferramentas (`tools`) e os *prompts* (comandos) foram adicionados e traduzidos em várias línguas;
- Foi adicionado o modelo multilíngue para a interface do MCP Inspector;
- Os tutoriais para os utilizadores iniciantes do MCP `mcp-me` foram adicionados e gerados:
  - por Pandoc:
    - para HTML fora de linha, optimizado e ideal para qualquer dispositivo;
  - por Typst:
    - para PDF com tamanho A6, ideal para impressão;
    - para PDF com altura infinita e largura de tamanho A4, ideal para computadores e *tablets*;
    - para PDF com altura infinita e largura de 480 *pixels*, ideal para qualquer telemóvel;
- Os tutoriais foram traduzidos em várias línguas;
- O projecto do MCP `mcp-me` foi reestruturado e reorganizado para facilitar que os utilizadores criem os seus próprios temas, seguindo o sistema de *design* de Pandoc Markdown, $\LaTeX$ e Typst com as convenções e filosofias BEM, IBM Carbon e W3C DTCG.

* **Geradores de PDF em mecanismos de renderização diferentes:** Tu podes gerar os teus currículos através de LaTeX, Pandoc com Puppeteer, ReportLab PDF Toolkit, Typst e/ou WeasyPrint. O sistema suporta a criação de:
  - **Currículos funcionais:** adaptados em diferentes línguas e temas visuais;
  - **Currículos modulares:** estructurados para diferentes carreiras, línguas e temas visuais;
  - **Currículos híbridos:** combinando mais de duas carreiras num único documento, personalizável em diferentes línguas e temas visuais.
* **Arquitectura de múltiplos temas:** Isto permite que tu escolhas um ou mais temas para os teus currículos funcionais, modulares e/ou híbridos, ou até mesmo que tu cries os teus próprios temas para os teus currículos.
* **Arquitectura modular:** Tu poderás selecionar apenas uma carreira para um currículo, extraindo apenas a relevância da experiência profissional, da experiência académica, das habilidades, dos cursos e certificados, ou duas carreiras ou mais para currículos diferentes ou para o mesmo currículo, baseando a relevância nessas carreiras.
* **Multilinguismo:** Tu podes criar a pasta `i18n` para construir as chaves e traduzi-las em YAML para gerar os currículos em uma, duas ou mais línguas estrangeiras.
* **Suporte do MCP às imagens do Docker e ao `distrobox`:** Tu poderás utilizar as imagens do Docker do Gustavo Papi para este MCP sem teres de instalar localmente múltiplos pacotes de forma desnecessária, evitando ocupar o teu espaço em disco (rígido/sólido). Além disso, caso sejas utilizador de Linux, poderás recorrer ao `distrobox` para isolar todas ou algumas das dependências necessárias, mantendo o teu sistema operativo totalmente limpo.
* **Análise de legibilidade para o ATS:** Tu podes gerar a página do painel de ATS para verificar a pontuação e a precisão de *strings* de cada PDF gerado com um mecanismo de renderização diferente. Isto permite-te verificar as falhas que resultam na tua rejeição pela inteligência artificial nas plataformas de emprego que utilizam sistemas de ATS com algoritmos para filtrar candidatos.
