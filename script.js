let printTextButton = document.getElementById("print-text")
printTextButton.addEventListener("click", reactionPrintText);

let printPRNButton = document.getElementById("print-prn")
printPRNButton.addEventListener("click", reactionPrintPRN);

function reactionPrintText() {
    printText("Bro");
    document.getElementById("ausgabe").textContent = "Text drucken!"
}

function reactionPrintPRN() {
    printPRN("Fcary_gutesFormat.prn"); //Dateipfad zu Druckdatei
    document.getElementById("ausgabe").textContent = "PRN Datei drucken!"
}

let zebraPrinter = null;

function initZebraPrinter() {
    if (typeof BrowserPrint === "undefined") {
        console.warn("BrowserPrint nicht geladen.");
        return;
    }

    BrowserPrint.getDefaultDevice("printer", function (printer) {
        zebraPrinter = printer;
        console.log("🖨️ Zebra-Standarddrucker erkannt:", printer.name);
    }, function (err) {
        console.error("❌ Fehler beim Zebra-Druckerabruf:", err);
    });
}

function printPRN(filePath) {
    if (!zebraPrinter) {
        console.warn("❗ Zebra-Drucker ist nicht initialisiert.");
        return;
    }

    fetch(filePath)
        .then((res) => res.text())
        .then((content) => {
            zebraPrinter.send(content,
                () => console.log("✅ PRN Gedruckt!"),
                err => console.error("❌ Druckfehler:", err)
            );
        })
        .catch((e) => console.error(e));
}

function printText(text) {
    if (!zebraPrinter) {
        console.warn("❗ Zebra-Drucker ist nicht initialisiert.");
        return;
    }

    // Umlaute ersetzen und harte Umbrüche entfernen
    const cleaned = replaceUmlauts(text.replace(/\n+/g, ' ').trim());

    // ZPL: ^FB = Field Block → Zebra übernimmt Umbrüche, zentriert
    const zpl = `^XA
^CI28
^FO50,50
^A0N,30,30
^FB350,10,0,C,0
^FD${cleaned}^FS
^XZ`;

    zebraPrinter.send(zpl,
        () => console.log("✅ Gedruckt:\n" + text),
        err => console.error("❌ Druckfehler:", err)
    );
}

function replaceUmlauts(text) {
    return text
        .replace(/Ä/g, "Ae")
        .replace(/Ö/g, "Oe")
        .replace(/Ü/g, "Ue")
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss");
}

document.addEventListener("DOMContentLoaded", () => {
    initZebraPrinter();
});