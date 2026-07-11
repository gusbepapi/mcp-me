# Features

## v1.0.0

- The `README.md` file has been translated into multiple languages;
- The files in the `docs` folder have been translated into multiple languages;
- The ATS parseability analysis page has been translated into multiple languages;
- A curriculum lexicon (thematic vocabulary) has been created in CSV to generate CVs in one or more different languages;
- The tools and prompts have been added and translated into multiple languages;
- The multilingual template for the MCP Inspector interface has been added;
- Tutorials for beginner users of the `mcp-me` MCP have been added and generated:
  - via Pandoc:
    - for offline HTML, optimised and ideal for any device;
  - via Typst:
    - for PDF in A6 size, ideal for printing;
    - for PDF with infinite height and A4 width, ideal for computers and tablets;
    - for PDF with infinite height and a width of 480 pixels, ideal for any mobile phone;
- The tutorials have been translated into multiple languages;
- The `mcp-me` MCP project has been restructured and reorganised to make it easier for users to create their own themes, following the Pandoc Markdown, $\LaTeX$, and Typst design systems with BEM, IBM Carbon, ITCSS, and W3C DTCG conventions and philosophies.

* **PDF generators across different rendering engines:** You can generate your documents using LaTeX, Pandoc with Puppeteer, ReportLab PDF Toolkit, Typst, and/or WeasyPrint. The system supports the creation of:
  - **Functional CVs:** tailored to different languages and visual themes;
  - **Modular CVs:** structured for different careers, languages, and themes;
  - **Hybrid CVs:** combining more than two careers into a single document, customisable across different languages and visual themes.
* **Multi-theme architecture:** This allows you to choose one or more themes for your functional, modular, and/or hybrid CVs, or you can even create your own themes for your CVs.
* **Modular architecture:** You will be able to select just one career for a CV, extracting only the relevance of professional experience, academic background, skills, courses, and certificates, or two or more careers for different CVs or for the same CV, basing the relevance on those specific careers.
* **Multilingualism:** You can create the `i18n` folder to build the keys and translate them in YAML to generate CVs in one, two, or more foreign languages.
* **MCP support for Docker images and `distrobox`:** You can use Gustavo Papi’s Docker images for this MCP without having to install multiple packages locally unnecessarily, preventing your system from being cluttered or your disk space (hard drive/solid-state drive) from being taken up. Furthermore, if you are a Linux user, you can use `distrobox` to isolate some or all of the required dependencies, keeping your operating system completely clean.
* **ATS parseability analysis:** You can generate the ATS dashboard page to verify the score and string accuracy of each PDF generated with a different rendering engine. This allows you to verify the flaws that result in your rejection by artificial intelligence on employment platforms that use ATS systems with algorithms to filter candidates.
