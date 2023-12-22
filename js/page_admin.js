// Bouton inscription
var btnInscription = document.getElementById("btnInscription");
btnInscription.addEventListener("click", inscription);

// Gestion afficher/masquer tableau de bord 
// Masquer les éléments par défaut
var affichageForm = document.getElementById("affichageForm");
affichageForm.style.display = "none";

var listUser = document.getElementById("listUser");
listUser.style.display = "none";

var detailUser = document.getElementById("detailUser");
detailUser.style.display = "none";

var divPret = document.getElementById("divPret");
divPret.style.display = "none";

var divRetour = document.getElementById("divRetour");
divRetour.style.display = "none";

var inscriptionLink = document.getElementById("inscriptionLink");
inscriptionLink.addEventListener("click", showInscription);

var listUserLink = document.getElementById("listUserLink");
listUserLink.addEventListener("click", showUsers);

var detailUserLink = document.getElementById("detailUserLink");
detailUserLink.addEventListener("click", showDetailUsers);

var pretLink = document.getElementById("pretLink");
pretLink.addEventListener("click", showPret);

var retourLink = document.getElementById("retourLink");
retourLink.addEventListener("click", showRetour);

var pretBtn = document.getElementById("pretBtn");
pretBtn.addEventListener("click", validerPret);

var btnSearchPret = document.getElementById("btnSearchPret");
btnSearchPret.addEventListener("click", afficheBD);

var divAffichagePret = document.getElementById("affichagePret");
var affichageErrPret = document.getElementById("affichageErrPret");
affichageErrPret.style.display = "none";

var refreshBtn = document.getElementById("refreshBtn");
refreshBtn.addEventListener("click", refreshFunc);

var selectUserPret = document.getElementById("selectUserPret");
selectUserPret.addEventListener("change", selectUserFunc);
var listSelection = [];

var selectUserRetour = document.getElementById("selectUserRetour");
selectUserRetour.addEventListener("change", selectUserRet);

var affichageErrRetour = document.getElementById("affichageErrRetour");

var btnDataFlush = document.getElementById("dataFlush");
btnDataFlush.addEventListener("click", dataFlush);

var retourBtn = document.getElementById("retourBtn");
retourBtn.addEventListener("click", validerRetour);

function validerRetour(){
    var valeur = document.getElementById("selectUserRetour").value;

    if(valeur == "Choisir un adhérent"){
        return
    }

    data = sessionStorage.getItem(valeur + "ad");
    var selection = JSON.parse(data)[2];

    if(selection == ""){
        return
    }

    selection = JSON.parse(selection);

    for (i in selection){
        id = idFromCodeBarre(selection[i]);
        sessionStorage.setItem(selection[i], id);
    }

    data = JSON.parse(data);    
    data[2] = "";
    data[3] = "";
    data = JSON.stringify(data);
    sessionStorage.setItem(valeur + "ad", data);

    alert("Retour validé pour : " + valeur);

    var listeEmprunt = document.getElementById("bdRetour");
    listeEmprunt.innerHTML = "Aucun emprunt.";
}

function selectUserRet(){
    var valeur = document.getElementById("selectUserRetour").value;
    var listeEmprunt = document.getElementById("bdRetour");

    if(valeur == "Choisir un adhérent"){
        listeEmprunt.innerHTML = "Aucun emprunt.";
        return
    }

    listeEmprunt.style.display = "none";
    listeEmprunt.innerHTML = "";

    data = sessionStorage.getItem(valeur + "ad");

    var idsBdSelect = JSON.parse(data)[2];

    if(idsBdSelect === ""){
        listeEmprunt.style.display = "block";
        listeEmprunt.innerHTML = "Aucun emprunt.";
        return
    }
    
    idsBdSelect = JSON.parse(idsBdSelect);
    listeEmprunt.style.display = "block";

    for (i in idsBdSelect){
        idsBdSelect[i] = idFromCodeBarre(idsBdSelect[i]);
    }

    idsBdSelect.forEach(function (idBd) {
        var bdEmpruntee = albums.get(idBd);
        if (bdEmpruntee) {
            afficherDetailsBD(idBd, listeEmprunt);
        }
    });
}

function refreshFunc(){
    listSelection = [];
    divAffichagePret.innerHTML = "";
    selectUserPret.value = "Choisir un adhérent";
    var valeur = document.getElementById("inputEmprunt");
    valeur.value = "";
    affichageErrPret.style.display = "none";
}

function afficheBD(event){
    event.preventDefault();
    var codeBarre = document.getElementById("inputEmprunt").value;
    var valeur = document.getElementById("inputEmprunt");
    var idSelection = idFromCodeBarre(codeBarre);
    if(divAffichagePret.innerHTML == ""){
        alert("Veuillez séléctionner un adhérent.");
        // var valeur = document.getElementById("inputEmprunt");
        valeur.value = "";
    }
    else{
        var listeSession = [];

        for (let i=0; i<sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            if(key.length <= 2){
                listeSession.push(key);
            }
        }

        if(!albums.get(idSelection)){
            affichageErrPret.style.display = "block";
            affichageErrPret.innerHTML = "L'ID : " + valeur + " n'existe pas.";
            valeur.value = "";
        }
        else{
            if(nbExemplaireDispo(codeBarre) == "0"){
                affichageErrPret.style.display = "block";
                affichageErrPret.innerHTML = "Il n'y a pas d'exemplaire disponible pour : " + albums.get(idSelection).titre;
                var valeur = document.getElementById("inputEmprunt");
                valeur.value = "";
            }
            else{
                affichageErrPret.style.display = "none";
                if(listSelection[0] === undefined){
                    listSelection[0] = codeBarre;
                    divAffichagePret.innerHTML += "<br>" + idSelection + " - " + albums.get(idSelection).titre + " / " + nbExemplaireDispo(codeBarre) + " restant(s).";
                    valeur.value = "";
                }
                else if(listSelection[1] === undefined){
                    if(idFromCodeBarre(listSelection[0]) === idFromCodeBarre(codeBarre)){
                        affichageErrPret.style.display = "block";
                        affichageErrPret.innerHTML = "BD déjà sélectionnée.";
                        valeur.value = "";
                    }
                    else{
                        listSelection[1] = codeBarre;
                        divAffichagePret.innerHTML += "<br>" + idSelection + " - " + albums.get(idSelection).titre + " / " + nbExemplaireDispo(codeBarre) + " restant(s).";
                        valeur.value = "";
                    }
                }
                else if(listSelection[2] === undefined){
                    if(idFromCodeBarre(listSelection[0]) === idFromCodeBarre(codeBarre) || idFromCodeBarre(listSelection[1]) === idFromCodeBarre(codeBarre)){
                        affichageErrPret.style.display = "block";
                        affichageErrPret.innerHTML = "BD déjà sélectionnée.";
                        valeur.value = "";
                    }
                    else{
                        listSelection[2] = codeBarre;
                        divAffichagePret.innerHTML += "<br>" + idSelection + " - " + albums.get(idSelection).titre + " / " + nbExemplaireDispo(codeBarre) + " restant(s).";
                        valeur.value = "";
                    }
                }
                else{
                    affichageErrPret.style.display = "block";
                    affichageErrPret.innerHTML = "Sélection maximale atteinte.";
                    valeur.value = "";
                }
            }
        }
    }
}

function selectUserFunc(){
    var valeur = document.getElementById("selectUserPret").value;
    listSelection = [];
    affichageErrPret.style.display = "none";
    divAffichagePret.innerHTML = "";
    divAffichagePret.innerHTML = "<strong>" + valeur + "</strong>";
    var saisie = document.getElementById("inputEmprunt");
    saisie.value = "";
}

function validerPret(){
    var thisOne = document.getElementById("selectUserPret").value;
    if(thisOne === "Choisir un adhérent"){
        alert("Veuillez choisir un adhérent pour valider la sélection.");
    }
    else if(listSelection[0] === undefined){
        alert("Veuillez compléter la sélection pour valider.");
    }
    else{
        for (i in listSelection){
            sessionStorage.removeItem(listSelection[i]);
        }

        var madate = new Date();
        var date = formatageDate(madate);

        var user = thisOne;
        thisOne = thisOne + "ad";

        attribution = sessionStorage.getItem(thisOne);

        attribution = JSON.parse(attribution);
        listSelection = JSON.stringify(listSelection);

        if(attribution[2] != ""){
            affichageErrPret.style.display = "block";
            affichageErrPret.innerHTML = "Un emprunt est déjà en cours pour cet utilisateur.";
            return
        }

        attribution[2] = listSelection;
        attribution[3] = date;

        attribution = JSON.stringify(attribution);

        sessionStorage.setItem(thisOne, attribution);

        alert("Prêt validé pour : " + user);

        listSelection = [];
        divAffichagePret.innerHTML = "";
        affichageErrPret.style.display = "none";
        selectUserPret.value = "Choisir un adhérent";
        var valeur = document.getElementById("inputEmprunt");
        valeur.value = "";
    }
}

function showPret(){
    listUser.style.display = "none";
    affichageForm.style.display = "none";
    detailUser.style.display = "none";
    divRetour.style.display = "none";
    divPret.style.display = "block";

    var selectUser = document.getElementById("selectUserPret");
    var firstLine = true;

    // Tri des adherents parmi les utilisateurs et affichage liste déroulante

    selectUser.innerHTML = "";

    var listeMail = [];

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeMail.push(key);
    }

    var listeUsers = [];

    for(i in listeMail){
        if (listeMail[i].substring(listeMail[i].length - 2) == "ad"){
            listeMail[i] = listeMail[i].substring(0, (listeMail[i].length - 2));
            listeUsers.push(listeMail[i]);
        }
    }

    listeUsers.sort();

    for(i in listeUsers){
        if(firstLine === true){
            option = document.createElement("option");
            option.innerHTML = "Choisir un adhérent";
            selectUser.appendChild(option);
            firstLine = false;
        }

        option = document.createElement("option");
        option.value = listeUsers[i];
        option.innerHTML = listeUsers[i];
        selectUser.appendChild(option);
    }
}

function showRetour(){
    listUser.style.display = "none";
    affichageForm.style.display = "none";
    detailUser.style.display = "none";
    divRetour.style.display = "block";
    divPret.style.display = "none";
    affichageErrRetour.style.display = "none";

    var listeEmprunt = document.getElementById("bdRetour");
    listeEmprunt.style.display = "none";

    var firstLine = true;

    // Tri des adherents parmi les utilisateurs et affichage liste déroulante
    selectUserRetour.innerHTML = "";

    var listeMail = [];

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeMail.push(key);
    }

    var listeUsers = [];

    for(i in listeMail){
        if (listeMail[i].substring(listeMail[i].length - 2) == "ad"){
            listeMail[i] = listeMail[i].substring(0, (listeMail[i].length - 2));
            listeUsers.push(listeMail[i]);
        }
    }

    listeUsers.sort();

    for(i in listeUsers){
        if(firstLine === true){
            option = document.createElement("option");
            option.innerHTML = "Choisir un adhérent";
            selectUserRetour.appendChild(option);
            firstLine = false;
        }

        option = document.createElement("option");
        option.value = listeUsers[i];
        option.innerHTML = listeUsers[i];
        selectUserRetour.appendChild(option);
    }
}

function showInscription(){
    listUser.style.display = "none";
    affichageForm.style.display = "block";
    detailUser.style.display = "none";
    divRetour.style.display = "none";
    divPret.style.display = "none";
}

function showUsers(){
    listUser.style.display = "block";
    affichageForm.style.display = "none";
    detailUser.style.display = "none";
    divRetour.style.display = "none";
    divPret.style.display = "none";

    var corpsTableau = document.getElementById("tableauAffichage");
    corpsTableau.innerHTML = "";

    // TRI les employés parmis les utilisateurs
    var listeMail = [];

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeMail.push(key);
    }

    var listeUsers = [];

    for(i in listeMail){
        
        var data = sessionStorage.getItem(listeMail[i]);

        if(listeMail[i] != "mail" && listeMail[i] != "mdp"){
            level = JSON.parse(data)[3];

            if(level === "1" || level === "2"){
                listeUsers.push(listeMail[i]);
            }
        }
    }

    // Remplissage tableau depuis la liste de mails
    for (i in listeUsers){
        var data = sessionStorage.getItem(listeUsers[i]);

        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        td1.innerHTML = JSON.parse(data)[0];
        td2.innerHTML = JSON.parse(data)[1];
        td3.innerHTML = listeUsers[i];

        if(JSON.parse(data)[3] === "1"){
            td4.innerHTML = "Admin";
        }
        else if(JSON.parse(data)[3] === "2"){
            td4.innerHTML = "Gestionnaire";
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        corpsTableau.appendChild(tr);
    };
}

function showDetailUsers(){
    listUser.style.display = "none";
    affichageForm.style.display = "none";
    detailUser.style.display = "block";
    divRetour.style.display = "none";
    divPret.style.display = "none";

    var selectUser = document.getElementById("selectUserMailDetail");
    var firstLine = true;

    // Tri des adherents parmi les utilisateurs et affichage liste déroulante

    selectUser.innerHTML = "";

    var listeMail = [];

    for (let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        listeMail.push(key);
    }

    var listeUsers = [];

    for(i in listeMail){
        if (listeMail[i].substring(listeMail[i].length - 2) == "ad"){
            listeMail[i] = listeMail[i].substring(0, (listeMail[i].length - 2));
            listeUsers.push(listeMail[i]);
        }
    }

    listeUsers.sort();

    for(i in listeUsers){
        if(firstLine === true){
            option = document.createElement("option");
            option.innerHTML = "Choisir un adhérent";
            selectUser.appendChild(option);
            firstLine = false;
        }

        option = document.createElement("option");
        option.value = listeUsers[i];
        option.innerHTML = listeUsers[i];
        selectUser.appendChild(option);
    }
}

// Gestion affichage individuel des utilisateurs

var detailAutoChange = document.getElementById("selectUserMailDetail");
detailAutoChange.addEventListener("change", detailUserFunc);

function detailUserFunc(event){
    event.preventDefault();

    var user = document.getElementById("selectUserMailDetail").value;
    var infos = user + "ad";

    var nomPrenom = document.getElementById("nomPrenom");
    var mail = document.getElementById("emailDetail");
    var statut = document.getElementById("roleDetail");
    var paiement = document.getElementById("cotisations");
    var amende = document.getElementById("amendes");
    var dateEmprunt = document.getElementById("datesEmprunt")
    var listeEmprunt = document.getElementById("bdEmprunt");

    var data = sessionStorage.getItem(user); 

    nomPrenom.innerHTML = JSON.parse(data)[0];
    nomPrenom.innerHTML += " " + JSON.parse(data)[1];

    //Afficher les infos de l'adhérent
    mail.innerHTML = user;

    if(JSON.parse(data)[3] === "1"){
        statut.innerHTML = "Admin";
    }
    else if(JSON.parse(data)[3] === "2"){
        statut.innerHTML = "Gestionnaire";
    }
    else if(JSON.parse(data)[3] === "3"){
        statut.innerHTML = "Adhérent";
    }

    data = sessionStorage.getItem(infos);
    
    if(JSON.parse(data)[0] == ""){
        paiement.innerHTML = "<br>";
    }
    else{
        paiement.innerHTML = JSON.parse(data)[0];
    }

    if(JSON.parse(data)[1] == ""){
        amende.innerHTML = "<br>";
    }
    else{
        amende.innerHTML = JSON.parse(data)[1];
    }

    if(JSON.parse(data)[3] == ""){
        dateEmprunt.innerHTML = "Aucun emprunt";
    }
    else{
        dateEmprunt.innerHTML = JSON.parse(data)[3];
    }

    if(JSON.parse(data)[2] == ""){
        listeEmprunt.innerHTML = "Aucun emprunt";
    }
    else{
        listeEmprunt.innerHTML = "";
        var idsBdSelect = JSON.parse(data)[2];
        idsBdSelect = JSON.parse(idsBdSelect);

        for (i in idsBdSelect){
            idsBdSelect[i] = idFromCodeBarre(idsBdSelect[i]);
        }

        idsBdSelect.forEach(function (idBd) {
            var bdEmpruntee = albums.get(idBd);
            if (bdEmpruntee) {
                afficherDetailsBD(idBd, listeEmprunt);
            }
        });
    }
}

// Fonction inscription
function inscription(event){
    event.preventDefault();

    // Récupératoin valeur formulaire et div affichage erreur
    var erreur = document.getElementById("erreurCrea");
    var email = document.getElementById("email").value;
    var prenom = document.getElementById("prenom").value;
    var nom = document.getElementById("nom").value;
    var mdp = document.getElementById("mdp").value;
    var mdpConf = document.getElementById("mdpConf").value;
    var role = document.getElementById("role").value;

    // Regex format mail et mdp
    var regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Test si présence du mail
    if (!email){
        erreur.innerHTML = "Une adresse mail est requise.";
        return false;
    }
    // Test format du mail
    else if (!regexMail.test(email)) {
        erreur.innerHTML = "Le format du mail n'est pas correct.";
        return false;
    }
    else{
        // Boucle for affichage Mails utilisateurs
        var listeMail = [];

        utilisateur.forEach((value, key) => {
            listeMail.push(key);
        });

        // Test si mail déjà enregistré
        for (i in listeMail){
            existant = listeMail[i];
            if (email === existant){
                erreur.innerHTML = "Ce mail est déjà associé à un compte.";
                return false;
            }
        }
    }
    
    // Test longueur prénom
    if (prenom.length < 2) {
        erreur.innerHTML = "Le prénom doit contenir au moins 2 caractères.";
        return false;
    }

    // Test longueur nom
    if (nom.length < 2) {
        erreur.innerHTML = "Le nom doit contenir au moins 2 caractères.";
        return false;
    }

    // Test si pas de mot de passe
    if (!mdp){
        erreur.innerHTML = "Mot de passe requis.";
        return false;
    }
    // Test longueur mdp
    else if (mdp.length < 8){
        erreur.innerHTML = "Le mot de passe doit contenir au moins 8 caractères.";
        return false;
    }
    // Test format mdp
    else if(!regexMdp.test(mdp)){
        erreur.innerHTML = "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre, et contenir 8 caractères minimum.";
        return false;
    }

    // Test présence confirmation mdp
    if (!mdpConf){
        erreur.innerHTML = "La confirmation de mot de passe est nécessaire.";
        return false;
    }
    // Test égalité mdp et mdp confirmation
    else if (mdp !== mdpConf){
        erreur.innerHTML = "La confirmation n'est pas identique au mot de passe.";
        return false;
    }

    // Message pop up confirmation de création de compte
    alert("Un compte à été crée avec l'adresse mail : " + email);

    // Création effective du compte

    var data = ["", "", "", ""]

    data[0] = prenom;
    data[1] = nom;
    data[2] = mdp;
    data[3] = role;

    console.log(data);

    sessionStorage.setItem(email, JSON.stringify(data));

    if(data[3] === "3"){
        data[0] = "";
        data[1] = "";
        data[2] = "";
        data[3] = "";

        email = (email + "ad");
        
        sessionStorage.setItem(email, JSON.stringify(data));
    }

    // Vider la div erreur
    erreur.innerHTML = "";
    document.getElementById("crea").submit();
};