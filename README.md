# Liste der »Entarteten Kunst«

[Ein Projekt von taz und OpenDataCity; Oktober 2014](http://kunstraub.taz.de)


## Voraussetzungen

Benötigt werden `node`, `bower`, `ruby` (für Sass; `gem install sass`) und die ImageMagick-Bibliothek. Anschließend kann ein Haufen Dependenzen automatisch installiert werden:

    $ npm install
    $ bower install

## Vor dem ersten Build

Bevor die App zum ersten Mal gebaut werden kann, müssen noch einige Dinge erledigt werden. Diese können entweder auf einmal erledigt werden (`gulp setup`) oder selektiv gestartet werden:

### JSON generieren

Zunächst empfiehlt es sich, die TSV-Dateien (ursprünglich aus Google Docs) in einen JSON-Datensatz zu konvertieren, damit weitere Schritte darauf aufbauen können.

    $ gulp data

### Vorschaubilder

Aus den Scans der einzelnen Seiten müssen Vorschaubilder generiert werden.

    $ gulp thumbnails

### Einzel-PDFs

**Achtung:** Dieser Schritt setzt voraus, dass die Datei _raubkunst.json_ auf dem aktuellen Stand ist (s. o., _JSON generieren_). Er muss jedes Mal wiederholt werden, wenn sich die Daten ändern.

Für jede Person wird im Voraus ein PDF mit den Seiten, auf denen sie erwähnt wird, generiert. Außerdem wird ein Gesamtverzeichnis mit allen Seiten erzeugt.

    $ gulp pdf

## Build

Schließlich kann das Projekt im Verzeichnis _dist/_ gebaut werden:

    $ gulp

Für die Entwicklung kann ein lokaler Server gestartet werden, der bei Änderungen automatisch einen Reload der Seite herbeiführt. [Der Server ist unter http://localhost:9000 zu erreichen.](http://localhost:9000/) Aufgrund der vielen großen Bilddateien dauert es einige Zeit, bis der Server vollständig gestartet ist.

    $ gulp watch
