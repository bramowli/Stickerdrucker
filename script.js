let devices = [];
let selected_device = null;

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

function initselected_device() {
    if (typeof BrowserPrint === "undefined") {
        console.warn("BrowserPrint nicht geladen.");
        return;
    }

    //Get the default device from the application as a first step. Discovery takes longer to complete.
    BrowserPrint.getDefaultDevice("printer", function (device) {

        //Add device to list of devices and to html select element
        selected_device = device;
        devices.push(device);
        var html_select = document.getElementById("selected_device");
        var option = document.createElement("option");
        option.text = device.name;
        html_select.add(option);

        //Discover any other devices available to the application
        BrowserPrint.getLocalDevices(function (device_list) {
            for (var i = 0; i < device_list.length; i++) {
                //Add device to list of devices and to html select element
                var device = device_list[i];
                if (!selected_device || device.uid != selected_device.uid) {
                    devices.push(device);
                    var option = document.createElement("option");
                    option.text = device.name;
                    option.value = device.uid;
                    html_select.add(option);
                }
            }

        }, function () { alert("Error getting local devices") }, "printer");

    }, function (error) {
        alert(error);
    })

    /*BrowserPrint.getDefaultDevice("printer", function (printer) {
        selected_device = printer;
        console.log("🖨️ Zebra-Standarddrucker erkannt:", printer.name);
    }, function (err) {
        console.error("❌ Fehler beim Zebra-Druckerabruf:", err);
    });*/
}

function printPRN(filePath) {
    if (!selected_device) {
        console.warn("❗ Zebra-Drucker ist nicht initialisiert.");
        return;
    }

    fetch(filePath)
        .then((res) => res.text())
        .then((content) => {
            selected_device.send(content,
                () => console.log("✅ PRN Gedruckt!"),
                err => console.error("❌ Druckfehler:", err)
            );
        })
        .catch((e) => console.error(e));
}

function printText(text) {
    if (!selected_device) {
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

    selected_device.send(zpl,
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
    initselected_device();
});