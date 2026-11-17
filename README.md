# porting-calculator

Ein Rechner für das Porten von 2-Takt-Zylindern. Aus Hub, Pleuellänge und Kanalhöhe berechnet er die Steuerzeiten in Kurbelwinkelgrad.

## Funktionen

- Eingabe der Motordaten: Hub, Pleuellänge, Bohrung (mm)
- Beliebig viele Kanäle mit Höhe ab Oberkante Kolbenboden im UT
- Pro Kanal: Öffnen (° v. UT), Schließen (° n. UT) und Steuerzeit (°)
- Ergebnisse werden beim Tippen sofort neu berechnet
- Heller und dunkler Modus (folgt der Systemeinstellung)

## Berechnung

Die Kolbenposition ab OT bei Kurbelwinkel θ ergibt sich aus der Kurbeltrieb-Geometrie:

```
x(θ) = r + l − (r·cos θ + √(l² − r²·sin² θ))     mit r = Hub / 2, l = Pleuellänge
```

Ein Kanal der Höhe `h` öffnet, sobald der Kolben die Position `Hub − h` erreicht. Der zugehörige Winkel wird per Bisektion zwischen 0° und 180° gesucht. Daraus folgt:

- Öffnet = 180° − Öffnungswinkel (v. UT), schließt symmetrisch (n. UT)
- Steuerzeit = 360° − 2 · Öffnungswinkel

Die Bohrung wird aktuell nur angezeigt und fließt nicht in die Berechnung ein.

## Starten

Es gibt keine Abhängigkeiten und keinen Build-Schritt. Einfach `web/index.html` im Browser öffnen.

Alternativ mit einem lokalen Server, z. B.:

```bash
npx serve web
```

## Projektstruktur

```
web/
├── index.html   # Oberfläche
├── style.css    # Styling (inkl. Dark Mode)
└── script.js    # Berechnung und DOM-Logik
```
