# Funcionalidades

## v1.0.0

- El archivo `README.md` fue traducido a varios idiomas;
- Los archivos de la carpeta `docs` fueron traducidos a varios idiomas;
- La página de análisis de legibilidad para el ATS fue traducida a varios idiomas;
- Se creó un léxico de términos (vocabulario temático) del currículum en CSV para generar los *currículums* en uno o más idiomas diferentes;
- Las herramientas (`tools`) y los *prompts* (órdenes) fueron añadidos y traducidos a varios idiomas;
- Se añadió el modelo multilingüe para la interfaz del MCP Inspector;
- Los tutoriales para los usuarios principiantes del MCP `mcp-me` fueron añadidos y generados:
  - por Pandoc:
    - para HTML offline, optimizado e ideal para cualquier dispositivo;
  - por Typst:
    - para PDF en tamaño A6, ideal para impresión;
    - para PDF con altura infinita y ancho en tamaño A4, ideal para computadoras y *tablets*;
    - para PDF con altura infinita y ancho de 480 *píxeles*, ideal para cualquier celular;
- Los tutoriales fueron traducidos a varios idiomas;
- El proyecto del MCP `mcp-me` fue reestructurado y reorganizado para facilitar que los usuarios creen sus propios temas, siguiendo el sistema de diseño de Pandoc Markdown, $\LaTeX$ y Typst con las convenciones y filosofías BEM, IBM Carbon y W3C DTCG.

* **Generadores de PDF en diferentes motores de renderizado:** Vos podés generar tus *currículums* a través de LaTeX, Pandoc con Puppeteer, ReportLab PDF Toolkit, Typst y WeasyPrint. El sistema soporta la creación de:
  - ****Currículums** funcionales:** adaptados a diferentes idiomas y temas visuales;
  - ****Currículums** modulares:** estructurados para diferentes carreras, idiomas y temas;
  - ****Currículums** híbridos:** combinando más de dos carreras en un único documento, personalizable en diferentes idiomas y temas.
* **Arquitectura de múltiples temas:** Esto permite que vos elijas uno o más temas para tus *currículums* funcionales, modulares y/o híbridos, o incluso que vos crees tus propios temas para tus *currículums*.
* **Arquitectura modular:** Vos vas a poder seleccionar solo una carrera para un currículum, extrayendo únicamente la relevancia de la experiencia profesional, de la experiencia académica, de las habilidades, de los cursos y certificados, o dos carreras o más para *currículums* diferentes o para el mismo currículum, basando la relevancia en esas carreras.
* **Multilingüismo:** Vos podés crear la carpeta `i18n` para construir las claves y traducirlas en YAML para generar los *currículums* en uno, dos o más idiomas extranjeros.
* **Soporte del MCP para imágenes de Docker y `distrobox`:** Vos vas a poder utilizar las imágenes de Docker de Gustavo Papi para este MCP sin tener que instalar localmente múltiples paquetes de forma innecesaria, evitando contaminar tu sistema o ocupar espacio en tu disco (rígido/sólido). Además, si sos usuario de Linux, vas a poder recurrir a `distrobox` para aislar todas o algunas de las dependencias necesarias, manteniendo tu sistema operativo totalmente limpio.
* **Análisis de legibilidad para el ATS:** Vos podés generar la página del panel de ATS para verificar la puntuación y la precisión de *strings* de cada PDF generado con un motor de renderizado diferente. Esto te permite verificar las fallas que provocan tu rechazo por parte de la inteligencia artificial en las plataformas de empleo que utilizan sistemas de ATS con algoritmos para filtrar candidatos.
