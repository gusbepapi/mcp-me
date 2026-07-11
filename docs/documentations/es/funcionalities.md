# Funcionalidades

## v1.0.0

- El archivo `README.md` ha sido traducido a varios idiomas;
- Los archivos de la carpeta `docs` han sido traducidos a varios idiomas;
- La página de análisis de legibilidad para el ATS ha sido traducida a varios idiomas;
- Se ha creado un léxico de términos (vocabulario temático) del *currículum* en CSV para generar los currículos en uno o más idiomas diferentes;
- Las herramientas (`tools`) y los *prompts* (órdenes) han sido añadidos y traducidos a varios idiomas;
- Se ha añadido el modelo multilingüe para la interfaz del MCP Inspector;
- Los tutoriales para los usuarios principiantes del MCP `mcp-me` han sido añadidos y generados:
  - por Pandoc:
    - para HTML fuera de línea, optimizado e ideal para cualquier dispositivo;
  - por Typst:
    - para PDF en tamaño A6, ideal para impresión;
    - para PDF con altura infinita y anchura en tamaño A4, ideal para ordenadores y *tablets*;
    - para PDF con altura infinita y anchura de 480 *píxeles*, ideal para cualquier móvil;
- Los tutoriales han sido traducidos a varios idiomas;
- El proyecto del MCP `mcp-me` ha sido reestructurado y reorganizado para facilitar que los usuarios creen sus propios temas, siguiendo el sistema de diseño de Pandoc Markdown, $\LaTeX$ y Typst con las convenciones y filosofías BEM, IBM Carbon y W3C DTCG.

* **Generadores de PDF en diferentes motores de renderizado:** Tú puedes generar tus *currículums* a través de LaTeX, Pandoc con Puppeteer, ReportLab PDF Toolkit, Typst y/o WeasyPrint. El sistema admite la creación de:
  - ***Currículums* funcionales:** adaptados a diferentes idiomas y temas visuales;
  - ***Currículums* modulares:** estructurados para diferentes carreras, idiomas y temas;
  - ***Currículums* híbridos:** combinando más de dos carreras en un único documento, personalizable en diferentes idiomas y temas.
* **Arquitectura de múltiples temas:** Esto permite que tú elijas uno o más temas para tus *currículums* funcionales, modulares y/o híbridos, o incluso que tú crees tus propios temas para tus *currículums*.
* **Arquitectura modular:** Tú podrás seleccionar solo una carrera para un currículum —extrayendo únicamente la relevancia de la experiencia profesional, de la experiencia académica, de las habilidades, de los cursos y certificados—, o dos carreras o más para *currículums* diferentes o para el mismo currículum, basando la relevancia en esas carreras.
* **Multilingüismo:** Tú puedes crear la carpeta `i18n` para construir las claves y traducirlas en YAML para generar los currículos en uno, dos o más idiomas extranjeros.
* **Soporte del MCP para imágenes de Docker y `distrobox`:** Tú podrás utilizar las imágenes de Docker de Gustavo Papi para este MCP sin tener que instalar localmente múltiples paquetes de forma innecesaria, evitando contaminar tu sistema o el uso de tu espacio en disco (rígido/sólido). Además, si eres usuario de Linux, podrás recurrir a `distrobox` para aislar todas o algunas de las dependencias necesarias, manteniendo tu sistema operativo totalmente limpio.
* **Análisis de legibilidad para el ATS:** Tú puedes generar la página del panel de ATS para verificar la puntuación y la precisión de *strings* de cada PDF generado con un motor de renderizado diferente. Esto te permite verificar los fallos que provocan tu rechazo por parte de la inteligencia artificial en las plataformas de empleo que utilizan sistemas de ATS con algoritmos para filtrar candidatos.
