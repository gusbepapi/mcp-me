# Funktionen

## v1.0.0

- Die `README.md`-Datei wurde in mehrere Sprachen übersetzt;
- Die Dateien im Ordner `docs` wurden in mehrere Sprachen übersetzt;
- Die Seite zur ATS-Lesbarkeitsanalyse wurde in mehrere Sprachen übersetzt;
- Es wurde ein Begriffslexikon (thematisches Vokabular) für den Lebenslauf in CSV erstellt, um Lebensläufe in einer oder mehreren verschiedenen Sprachen zu generieren;
- Die Tools (`tools`) und *Prompts* (Befehle) wurden hinzugefügt und in mehrere Sprachen übersetzt;
- Das mehrsprachige *Template* für die Benutzeroberfläche des MCP-Inspectors wurde hinzugefügt;
- Die Anleitungen für Einsteiger des MCP `mcp-me` wurden hinzugefügt und generiert:
  - mittels Pandoc:
    - für Offline-HTML, optimiert und ideal für jedes Gerät;
  - mittels Typst:
    - für PDF im A6-Format, ideal für den Druck;
    - für PDF mit unendlicher Höhe und der Breite eines A4-Formats, ideal für *Computer* und *Tablets*;
    - für PDF mit unendlicher Höhe und einer Breite von 480 *Pixeln*, ideal für jedes Mobiltelefon;
- Die Anleitungen wurden in mehrere Sprachen übersetzt;
- Das Projekt des MCP `mcp-me` wurde restrukturiert und reorganisiert, um den Benutzern das Erstellen eigener Themes zu erleichtern, basierend auf dem *Design*-System von Pandoc Markdown, $\LaTeX$ und Typst unter Einhaltung der Konventionen und Philosophien von BEM, IBM Carbon und W3C DTCG.

* **PDF-Generatoren mit verschiedenen *Rendering-Engines*:** Du kannst deine Lebensläufen über LaTeX, Pandoc mit Puppeteer, ReportLab PDF Toolkit, Typst und/oder WeasyPrint generieren. Das System unterstützt die Erstellung von:
  - **Funktionalen Lebensläufen:** angepasst an verschiedene Sprachen und visuelle Themes;
  - **Modularen Lebensläufen:** strukturiert für verschiedene Karrieren, Sprachen und Themes;
  - **Hybriden Lebensläufen:** die mehr als zwei Karrieren in einem einzigen Dokument kombinieren und in verschiedenen Sprachen und Themes anpassbar sind.
* **Multi-Theme-Architektur:** Dies ermöglicht es dir, ein oder mehrere Themes für deine funktionalen, modularen und/oder hybriden Lebensläufe auszuwählen oder sogar deine eigenen Themes für deine Lebensläufe zu erstellen.
* **Modulare Architektur:** Du kannst nur eine Karriere für einen Lebenslauf auswählen, wobei nur die Relevanz der Berufserfahrung, des akademischen Hintergrunds, der Fähigkeiten, Kurse und Zertifikate berücksichtigt wird, oder zwei oder mehr Karrieren für verschiedene Lebensläufe oder für denselben Lebenslauf, wobei die Relevanz auf diesen spezifischen Karrieren basiert.
* **Mehrsprachigkeit:** Du kannst den Ordner `i18n` erstellen, um die Schlüssel zu definieren und sie in YAML zu übersetzen, um die Lebensläufe in einer, zwei oder mehr Fremdsprachen zu generieren.
* **MCP-Unterstützung für Docker-Images und `distrobox`:** Du kannst die Docker-Images von Gustavo Papi für diesen MCP verwenden, ohne lokal unnötig viele Pakete installieren zu müssen. Dies verhindert, dass dein System zugemüllt oder dein Speicherplatz (Festplatte/SSD) unnötig belegt wird. Wenn du ein Linux-Benutzer bist, kannst du außerdem auf `distrobox` zurückgreifen, um alle oder einen Teil der erforderlichen Abhängigkeiten zu isolieren, sodass dein Betriebssystem völlig sauber bleibt.
* **Lesbarkeitsanalyse für das ATS:** Du kannst die ATS-Dashboard-Seite generieren, um die Punktzahl und die Genauigkeit der Zeichenketten (*strings*) jedes PDFs zu überprüfen, das mit einer anderen *Rendering-Engine* generiert wurde. Auf diese Weise kannst du Fehler überprüfen, die zu deiner Ablehnung durch künstliche Intelligenz auf Jobplattformen führen, die ATS-Systeme mit Algorithmen zur Filterung von Kandidaten einsetzen.
