# Funcionalidades

## v1.0.0

- O arquivo `README.md` foi traduzido para vários idiomas;
- Os arquivos na pasta `docs` foram traduzidos para vários idiomas;
- A página de análise de legibilidade para o ATS foi traduzida para vários idiomas;
- Foi criado um léxico de termos (vocabulário temático) do currículo em CSV para gerar os currículos em um ou mais idiomas diferentes;
- As ferramentas (`tools`) e os *prompts* (comandos) foram adicionados e traduzidos para vários idiomas;
- Foi adicionado o modelo multilíngue para a interface do MCP Inspector;
- Os tutoriais para os usuários iniciantes do MCP `mcp-me` foram adicionados e gerados:
  - por Pandoc:
    - para HTML offline, otimizado e ideal para qualquer dispositivo;
  - por Typst:
    - para PDF em tamanho A6, ideal para impressão;
    - para PDF com altura infinita e largura em tamanho A4, ideal para computadores e *tablets*;
    - para PDF com altura infinita e largura de 480 *pixels*, ideal para qualquer celular;
- Os tutoriais foram traduzidos para vários idiomas;
- O projeto do MCP `mcp-me` fue reestruturado e reorganizado para facilitar que os usuários criem seus próprios temas, seguindo o sistema de *design* de Pandoc Markdown, $\LaTeX$ e Typst com as convenções e filosofias BEM, IBM Carbon e W3C DTCG.

* **Geradores de PDF em mecanismos de renderização diferentes:** Você pode gerar seus documentos através de LaTeX, Pandoc com Puppeteer, ReportLab PDF Toolkit, Typst e/ou WeasyPrint. O sistema suporta a criação de:
  - **Currículos funcionais:** adaptados em diferentes idiomas e temas visuais;
  - **Currículos modulares:** estruturados para diferentes carreiras, idiomas e temas;
  - **Currículos híbridos:** combinando mais de duas carreiras em um único documento, personalizável em diferentes idiomas e temas.
* **Arquitetura de múltiplos temas:** Isso permite que você escolha um ou mais temas para os seus currículos funcionais, modulares e/ou híbridos, ou até mesmo que você crie os seus próprios temas para os seus currículos.
* **Arquitetura modular:** Você poderá selecionar apenas uma carreira para um currículo, extraindo apenas a relevância da experiência profissional, da experiência acadêmica, das habilidades, dos cursos e certificados, ou duas carreiras ou mais para currículos diferentes ou para o mesmo currículo, baseando a relevância nessas carreiras.
* **Multilinguismo:** Você pode criar a pasta `i18n` para construir as chaves e traduzi-las em YAML para gerar os currículos em um, dois ou mais idiomas estrangeiros.
* **Suporte do MCP às imagens do Docker e ao `distrobox`:** Você poderá utilizar as imagens do Docker do Gustavo Papi para este MCP sem ter que instalar localmente múltiplos pacotes de forma desnecessária, evitando contaminar o seu sistema ou ocupar o seu espaço em disco (rígido/sólido). Além disso, caso seja usuário de Linux, poderá recorrer ao `distrobox` para isolar todas ou algumas das dependências necessárias, mantendo o seu sistema operacional totalmente limpo.
* **Análise de legibilidade para o ATS:** Você pode gerar a página do painel de ATS para verificar a pontuação e a precisão de *strings* de cada PDF gerado com um mecanismo de renderização diferente. Isso permite verificar as falhas que resultam na sua rejeição pela inteligência artificial nas plataformas de emprego que utilizam sistemas de ATS com algoritmos para filtrar candidatos.