# Fonctionnalités

## v1.0.0

- Le fichier `README.md` a été traduit en plusieurs langues ;
- Les fichiers du dossier `docs` ont été traduits en plusieurs langues ;
- La page d’analyse de lisibilité pour l’ATS a été traduite en plusieurs langues ;
- Un lexique de termes (vocabulaire thématique) du *curriculum* a été créé en CSV pour générer les CV en une ou plusieurs langues différentes ;
- Les outils (`tools`) et les *prompts* (commandes) ont été ajoutés et traduits en plusieurs langues ;
- Le modèle multilingue a été ajouté pour l’interface du MCP Inspector ;
- Les tutoriels pour les utilisateurs débutants du MCP `mcp-me` ont été ajoutés et générés :
  - par Pandoc :
    - pour HTML hors ligne, optimisé et idéal pour n'importe quel appareil ;
  - par Typst :
    - pour PDF au format A6, idéal pour l’impression ;
    - pour PDF avec hauteur infinie et largeur au format A4, idéal pour les ordinateurs et les tablettes ;
    - pour PDF avec hauteur infinie et largeur de 480 pixels, idéal pour n'importe quel téléphone portable ;
- Les tutoriels ont été traduits en plusieurs langues ;
- Le projet du MCP `mcp-me` a été restructuré et réorganisé pour permettre aux utilisateurs de créer plus facilement leurs propres thèmes, en suivant le système de *design* de Pandoc Markdown, $\LaTeX$ et Typst avec les conventions et philosophies BEM, IBM Carbon et W3C DTCG.

* **Générateurs de PDF avec différents moteurs de rendu :** Vous pouvez générer vos CV via LaTeX, Pandoc avec Puppeteer, ReportLab PDF Toolkit, Typst et/ou WeasyPrint. Le système prend en charge la création de :
  - **CV fonctionnels :** adaptés à différentes langues et thèmes visuels ;
  - **CV modulaires :** structurés pour différentes carrières, langues et thèmes ;
  - **CV hybrides :** combinant plus de deux carrières dans un seul document, personnalisables en différentes langues et thèmes.
* **Architecture multi-thèmes :** Cela vous permet de choisir un ou plusieurs thèmes pour vos CV fonctionnels, modulaires et/ou hybrides, ou même de créer vos propres thèmes pour vos CV.
* **Architecture modulaire :** Vous pourrez sélectionner une seule carrière pour un CV, en extrayant uniquement la pertinence de l’expérience professionnelle, de l’expérience académique, des compétences, des cours et certificats, ou deux carrières ou plus pour des CV différents ou pour le même CV, en basant la pertinence sur ces carrières.
* **Multilinguisme :** Vous pouvez créer le dossier `i18n` pour construire les clés et les traduire en YAML afin de générer les CV dans une, deux ou plusieurs langues étrangères.
* **Prise en charge du MCP pour les images Docker et `distrobox` :** Vous pourrez utiliser les images Docker du Gustavo Papi pour ce MCP sans avoir à installer localement de nombreux paquets de manière inutile, évitant ainsi d’encombrer votre système ou d’occuper votre espace disque (disque dur/SSD). De plus, si vous êtes un utilisateur de Linux, vous pourrez recourir à `distrobox` pour isoler tout ou partie des dépendances nécessaires, maintenant votre système d’exploitation totalement propre.
* **Analyse de lisibilité pour l’ATS :** Vous pouvez générer la page du tableau de bord de l’ATS pour vérifier le score et la précision des chaînes de caractères (*strings*) de chaque PDF généré avec un moteur de rendu différent. Cela vous permet de vérifier les failles qui entraînent votre rejet par l’intelligence artificielle sur les plateformes de l’emploi qui utilisent des systèmes ATS avec des algorithmes pour filtrer les candidats.
