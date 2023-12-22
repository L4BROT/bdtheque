var dataUser = sessionStorage.getItem(pseudo + "ad");

var dataCompte = sessionStorage.getItem(pseudo);

var prenom = JSON.parse(dataCompte)[0];
var nom = JSON.parse(dataCompte)[1];
var mdp = JSON.parse(dataCompte)[2];
var statut = JSON.parse(dataCompte)[3];

var cotisation = JSON.parse(dataUser)[0];
var amendes = JSON.parse(dataUser)[1];
var emprunt = JSON.parse(dataUser)[2];
var dateEmprunt = JSON.parse(dataUser)[3];

function getDateEcheance(dateReference, joursAvantEcheance) {
    var dateEcheance = new Date(dateReference);
    dateEcheance.setDate(dateEcheance.getDate() - joursAvantEcheance);
    return dateEcheance;
}

function afficherInfosAdherent(infos, utilisateur, adherent, pseudo) {
    var nomPrenom = document.getElementById("nomPrenom");
    var mail = document.getElementById("email");
    var cotisationsContainer = document.getElementById("cotisations");
    var amende = document.getElementById("amendes");
    var dateEmpruntDiv = document.getElementById("datesEmprunt");
    var listeEmprunt = document.getElementById("bdEmprunt");
    var statut = document.getElementById("role");
    statut.innerHTML = "Adhérent";

    var joursAvantEcheance = 15;
    var aujourdhui = new Date();
    var cotisationAdherent = cotisation;
    var dateCotisation = new Date(cotisationAdherent); // Converti la date de cotisation en objet Date
    
    // Ajouter un an à la date de cotisation
    dateCotisation.setFullYear(dateCotisation.getFullYear() + 1);

    // Calculer la date limite de paiement (15 jours avant la date de cotisation)
    var dateEcheanceCotisation = getDateEcheance(dateCotisation, joursAvantEcheance);

    // Déclarer dateEcheanceCotisation ici
    var divParent = document.createElement("div");
    divParent.classList.add("d-flex", "justify-content-between");

    if (aujourdhui >= dateEcheanceCotisation) {
        divParent.innerHTML = `<p class="card-text">${cotisation}</p>`;

        var btnRegler = document.createElement("button");
        btnRegler.classList.add("btn", "btn-success", "mb-2");
        btnRegler.textContent = "Régler cotisation";
        btnRegler.style.fontSize = "15px";
        btnRegler.style.padding = "5px 10px";

        btnRegler.addEventListener("click", function () {

            var aujourdhui = new Date();
            const DATE_FORMAT = formatageDate(aujourdhui);

            pseudo = pseudo + "ad";

            // Attribution de la date du jour dans cotisation
            attribution = sessionStorage.getItem(pseudo);
            attribution = JSON.parse(attribution);
            attribution[0] = DATE_FORMAT;
            attribution = JSON.stringify(attribution);
            sessionStorage.setItem(pseudo, attribution);

            alert("cotisation réglée");
            cotisationsContainer.innerHTML = DATE_FORMAT;
            btnRegler.remove();
        });

        divParent.appendChild(btnRegler);
    } else {
        divParent.innerHTML = `<p class="card-text">${cotisation}</p>`;
    }

    cotisationsContainer.innerHTML = '';
    cotisationsContainer.appendChild(divParent);

    nomPrenom.innerHTML = nom + " " + prenom;
    mail.innerHTML = infos;
    amende.innerHTML = amendes;
    dateEmpruntDiv.innerHTML = dateEmprunt;
    listeEmprunt = emprunt;
}

function creerBoutonPerte(bdEmpruntee, bdDiv) {
    var btnPerte = document.createElement("button");
    btnPerte.classList.add("btn", "btn-danger", "btn-sm", "mt-auto");
    btnPerte.textContent = "Déclarer une perte";
    btnPerte.style.fontSize = "15px";
    btnPerte.style.padding = "5px 10px";
    btnPerte.style.position = "absolute";
    btnPerte.style.bottom = "10px";

    btnPerte.addEventListener("click", function () {
        alert("Déclaration perte de la BD : " + bdEmpruntee.titre);
    });

    bdDiv.querySelector(".card-body").appendChild(btnPerte);
}

function executeScript(pseudo, utilisateur, adherent, albums, auteurs, series) {
    var pseudo = sessionStorage.getItem("mail");
    var dataUser = sessionStorage.getItem(pseudo + "ad");
    var emprunt = JSON.parse(dataUser)[2];
    var detailsBd = document.getElementById("bdEmprunt");

    if(emprunt != ""){
        var idsBdSelect = JSON.parse(emprunt);
        
        for (i in idsBdSelect){
            idsBdSelect[i] = idFromCodeBarre(idsBdSelect[i]);
        }
    }
    
    if (detailsBd){
        var infos = pseudo;
        afficherInfosAdherent(infos, utilisateur, adherent, pseudo);

        if(emprunt != ""){
            idsBdSelect.forEach(function (idBd) {
                var bdEmpruntee = albums.get(idBd);
                if (bdEmpruntee) {
                    afficherDetailsBD(idBd, detailsBd, SRC_ALBUM);
                    creerBoutonPerte(bdEmpruntee, detailsBd.lastElementChild);
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Passer les paramètres nécessaires à la fonction principale
    executeScript(pseudo, utilisateur, adherent, albums, auteurs, series);
});
