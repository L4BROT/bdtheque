// Fonctions autonomes globales du site

// Déclaration des constantes
const SRC_ALBUM_MINI = "ressources/albumsMini/"; // emplacement des images des albums en petit
const SRC_ALBUM = "ressources/albums/"; // emplacement des images des albums en grand

// Déclaration des variables
var headerSearch = document.querySelector(".search"); // Sélectionnez l'élément avec la classe "search"
var inputRecherche = document.querySelectorAll(".searchInput");
var btnProfil = document.getElementById("monProfil");
var affichageUser = document.getElementById("affichageUser");
var btnDeconnexion = document.getElementById("deconnexion");
var statut = document.getElementById("statut");
var tri = document.getElementById("tri");
var cadreConnecte = document.getElementById("connect");

var pseudo = sessionStorage.getItem("mail");
var mot2pass = sessionStorage.getItem("mdp");
var url = decodeURI(window.location.href); // Récuperation de l'URL courante
var bConnect = isConnect(pseudo); // Vérifie si connection OK

// Initialisation des variables données
var numSerie;
var nomSerie;
var idAuteur;
var nomAuteur;
var titreAlbm;
var prixBd;
var albumNum;
var imgSrc;

initialisation();


// ADDEVENTLISTENERS

// Transition au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("transPage");
});

// Fonction redirection icone mon profil
btnProfil.addEventListener("click", redirection);

// Bloc deconnexion
btnDeconnexion.addEventListener("click", deconnexion);

// Ajoute un gestionnaire d'événement "click" à l'élément "header-search"
headerSearch.addEventListener("click", function() {
    var floatSearch = document.getElementById("searchBar");
    changeVisibilite(floatSearch); // Basculez la visibilité de l'élément "float-search"
    // Définir le focus sur l'input text
    inputRecherche[0].focus();
});


// FONCTIONS

function initialisation () {
    initConnexion();
    listeAuteurs();
    listeSerie();
    dataBase();
    dataBaseAd();
    databaseExemplaires();
}

// Prend le pseudo en parametre et retourne un boolean
function isConnect (p) {
    if (p !== null) {return true;}
    else {return false;}
}

function initConnexion () {
    if (!bConnect){
        btnProfil.classList.remove("text-success-emphasis");
        if (url.includes("index")) {
            cadreConnecte.setAttribute("class", "col col-lg-4 d-none d-lg-block bg-cont");
        }

        if (url.includes("page_admin") || url.includes("detail_adherent")){
            window.location.assign("connexion.html");
        }
    }
    else{
        btnProfil.classList.add("text-success-emphasis");
        statut.setAttribute("class", "fixed-top d-flex justify-content-between");
        if (url.includes("index")) {cadreConnecte.setAttribute("class", "d-none");}

        var resConnect = "Connecté : " + pseudo;
        var dataUser = sessionStorage.getItem(pseudo);
        let jsonUser = JSON.parse(dataUser)[3];

        if (jsonUser === null){resConnect += "\nAucun niveau d'authorisation";} 
        else {
            if (jsonUser === "1"){resConnect += " / Admin";}
            else if (jsonUser === "2"){resConnect += " / Gestionnaire";}
            else if (jsonUser === "3"){resConnect += " / Adhérent";}
        }
        affichageUser.innerHTML = resConnect;
    }
}

// Vidage du session storage
function dataFlush(){
    sessionStorage.clear();
    alert("La base de donnée à été supprimée, le site va redémarrer sur les données des maps.");
    location.reload();
}

// Recupération des données
function recuperationDonnees (id,src = SRC_ALBUM_MINI) {
    var album = albums.get(id);
    numSerie = album.idSerie;
    nomSerie = series.get(numSerie).nom;
    idAuteur = auteurs.get(album.idAuteur);
    nomAuteur = idAuteur.nom;
    titreAlbm = album.titre;
    albumNum = album.numero;
    imgSrc = nomSerie + "-" + albumNum + "-" + titreAlbm;
    imgSrc = src + imgSrc.replace(/'|!|\?|\.|"|:|\$/g, "") + ".jpg";
    if (!url.includes("index")) {
        prixBd = album.prix;
    }   
}

function databaseExemplaires(){
    var listeExemplaires = [];
    var listeSession = [];

    exemplaire.forEach((value, key) => {
        listeExemplaires.push(key);
    });

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeSession.push(key);
    }

    if(listeSession.length == "12" || listeSession.length == "14"){
        exemplaire.forEach((value, key) => {
            listeExemplaires.push(key);
        });

        for (i in listeExemplaires){
            exemplaireUnique(i);
        }
        console.log("Map exemplaire OK.");
    }
    else{
        console.log("Map exemplaire déjà chargée en session storage.");
    }
}

// Passage de la map utilisateur en session storage
function dataBase(){

    var listeMail = [];

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeMail.push(key);
    }

    if(listeMail.length <= "3"){

        listeMail = [];

        utilisateur.forEach((value, key) => {
            listeMail.push(key);
        });

        for (i in listeMail){
            var data = ["", "", "", ""]

            data[0] = utilisateur.get(listeMail[i]).prenom;
            data[1] = utilisateur.get(listeMail[i]).nom;
            data[2] = utilisateur.get(listeMail[i]).mdp;
            data[3] = utilisateur.get(listeMail[i]).role;

            sessionStorage.setItem(listeMail[i], JSON.stringify(data));
        }
        console.log("Map utilisateurs OK.");
    }
    else{
        console.log("Map utilisateur déjà chargée en session storage.");
    }
}

// Passage de la map adherent en local storage
function dataBaseAd(){

    var listeMail = [];

    adherent.forEach((value, key) => {
        listeMail.push(key);
    });

    // Ajout de "ad" en fin de key, pour differencier de l'autre map
    if(sessionStorage.getItem(listeMail[0] + "ad") === null){

        for (i in listeMail){
            var data = ["", "", "", ""]

            data[0] = adherent.get(listeMail[i]).cotisation;
            data[1] = adherent.get(listeMail[i]).amendes;
            data[2] = adherent.get(listeMail[i]).emprunt;
            data[3] = adherent.get(listeMail[i]).dateEmprunt;

            sessionStorage.setItem(listeMail[i] + "ad", JSON.stringify(data));
        }
        console.log("Map adherent OK.");
    }
    else{
        console.log("Map adherent déjà chargée en session storage.");
    }
}

// Découpage des URL pour extration clés/valeurs
function decoupeUrl (u = url) {
    let cherche = u.indexOf("?"); // Cherche le "?" dans l'url
    if (cherche !== -1) { // Si "cherche" n'est pas vide
        // Traitement des clé - valeur
        var cv = u.split("?");
        var tCle = cv[1].split("&");
        var tcleVal = [];
            for (let i in tCle) {
                var tcleV = tCle[i].split("=");
                tcleVal.push(tcleV);
            }  
        return tcleVal;
    }
}

// Basculez la visibilité de élément HTML accessible par document.getElementById
function changeVisibilite (elmt, dis = "inline") {
    if (elmt.style.display === "none" || elmt.style.display === "") {
        elmt.style.display = dis;
    } else {
        elmt.style.display = "none";
    }
}

/* Trie une map, prends en parametres la map et 
l'élément de comparaison (clé), tri alphabetique par défaut */
function triMap (map, cmp, tri = 1) {
    let tTri = Array.from(map);
    switch (tri) {
        case 1: // Tri croissant
            tTri.sort((a, b) => a[1][cmp].localeCompare(b[1][cmp]));
            break;
        case 2: // Tri décroissant
            tTri.sort((a, b) => b[1][cmp].localeCompare(a[1][cmp]));
            break;
    }

    return new Map(tTri);
}

// Prend une map en parametre et retourne un tableau classé alphabetique
function triAuteurs (map) {
    let tTri = [];
    let auteursRencontres = new Set();
    map.forEach((auteur) => {
        let tAuteur = auteur.nom.split(",");
        tAuteur.forEach((nomAuteur) => {
            nomAuteur = nomAuteur.trim();
            if (!auteursRencontres.has(nomAuteur)) {
                auteursRencontres.add(nomAuteur);
                tTri.push(nomAuteur);
            }
        });
    });
    return tTri.sort(); // Trie aphabétique
}

// Génère la liste déroulante "Auteurs"
function listeAuteurs () {
    var navAuteur = document.getElementById("navAuteur");
    let tTriAuteurs = [];
    let lAuteurs = '<a class="nav-link dropdown-toggle liens" data-bs-toggle="dropdown" aria-expanded="false">Auteurs</a><ul class="dropdown-menu">';

    tTriAuteurs = triAuteurs(auteurs);

    for (let i in tTriAuteurs) {
        // Utiliser une liste pour stocker les résultats au lieu d'une chaîne
        lAuteurs += '<li><a class="dropdown-item hover_liens" href="index.html?auteur=' 
        + tTriAuteurs[i].toLowerCase() + '">'
        + tTriAuteurs[i] +'</a></li>';
    }
    lAuteurs += "</ul>";
    navAuteur.innerHTML = lAuteurs;
}

// Génère la liste déroulante "Series"
function listeSerie () {
    var navSerie = document.getElementById("navSerie");
    var lSeries = '<a class="nav-link dropdown-toggle liens" data-bs-toggle="dropdown" aria-expanded="false">Séries</a><ul class="dropdown-menu">';
    
    var serieTries = triMap(series, "nom");
    
    serieTries.forEach((serie, id) => {
        lSeries += '<li><a class="dropdown-item hover_liens" href="index.html?serie=' 
        + id + '">'
        + serie.nom+'</a></li>';
    });

    lSeries += "</ul>";
    navSerie.innerHTML = lSeries;
}

// Redirection a la connection en fonction du role
function redirection(){
    let redir = "";
    if (!bConnect){redir = "connexion";} 
    else {
        var user = sessionStorage.getItem(pseudo);
        var dataUser = JSON.parse(user)[3];
        if (dataUser === "1" || dataUser === "2"){
            redir = "page_admin";
        } else if (dataUser === "3"){
            redir = "detail_adherent";
        }
    }
    window.location.assign(redir + ".html");
}

function deconnexion(){
    sessionStorage.removeItem("mdp");
    sessionStorage.removeItem("mail");
    alert("Vous avez été déconnecté.");
    window.location.assign("index.html");
}

// Fonction affichage BD détail adherents
function afficherDetailsBD (bdEmpruntee, listeEmprunt, src = SRC_ALBUM_MINI) {

    recuperationDonnees(bdEmpruntee, src);

    var bdDiv = document.createElement("div");
    bdDiv.classList.add("card", "bg-cont", "mb-2");

    bdDiv.innerHTML = `
    <div class="row">
        <div class="card-body col-6 ps-5 py-4">
            <p class="text-white">Série: ${nomSerie}</p>
            <p class="text-white">Titre: ${titreAlbm}</p>
            <p class="text-white">Auteur(s): ${nomAuteur}</p>
            <p class="text-white">Numéro de la BD: ${albumNum}</p>
            <p class="text-white" style="margin-bottom: 30px;">Prix: ${prixBd}</p>
        </div>
        <div class="card-body col-6 d-none d-md-flex justify-content-center align-items-center" id="bdImage${bdEmpruntee.id}">
            <img src="${imgSrc}" alt="Image de la BD" style="max-width: 40%; max-height: 100%;">
        </div>
    </div>
    `;
    listeEmprunt.appendChild(bdDiv);
}

function formatageDate(d) {
    const OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return new Intl.DateTimeFormat('fr-FR', OPTIONS).format(d);
}

// Donner un codeBarre exemplaire et ressort le nombre disponible
function nbExemplaireDispo(codeBarre){
    listeSession = [];
    nombreDispo = [];

    valeur = sessionStorage.getItem(codeBarre);

    for (let i=0; i<sessionStorage.length; i++){
        let key = sessionStorage.key(i);
        listeSession.push(key);
    }

    for (i in listeSession){
        if(sessionStorage.getItem(listeSession[i]) === valeur){
            nombreDispo.push("1");
        }
    }
    
    return nombreDispo.length;
}

function exemplaireIsDispo (id) {
    var val = sessionStorage.getItem(id);
    if (val) {return true;} else {return false;}
}

// Prend en parametre le ID d'un album
function exemplaireUnique (id) {
    let lettreMin = 97; // Debut les lettres de l'alphabet en minuscules
    // chargement map exemplaire
    let ex = exemplaire.get(id);
    if (ex) {
        let quantiteEx = ex.quantite;
        // Génére le resultat
        for (let i = lettreMin; i <= parseInt(quantiteEx - 1) + lettreMin; i++) {
            let lettre = String.fromCharCode(i);
            codeBarre = id + lettre;
            sessionStorage.setItem(codeBarre, id);
        }
    }
}

// Donner un codeBarre exemplaire et ressort l'ID de la BD
function idFromCodeBarre(codeBarre){
    if(codeBarre.length == "2"){
        codeBarre = codeBarre.substring(0, 1);
        return codeBarre;
    }
    else if(codeBarre.length == "3"){
        codeBarre = codeBarre.substring(0, 2);
        return codeBarre;
    }
}

// Donner un id exemplaire et ressort le nombre disponible
function nbExemplaireFromId(id){
    listeSession = [];
    nombreDispo = [];

    for (let i=0; i<sessionStorage.length; i++){
        let key = sessionStorage.key(i);
        listeSession.push(key);
    }

    for (i in listeSession){
        if(sessionStorage.getItem(listeSession[i]) === id){
            nombreDispo.push("1");
        }
    }
    
    return nombreDispo.length;
}