// Récupération bouton
var btnConnexion = document.getElementById("btnConnexion");

// Abonnement bouton
btnConnexion.addEventListener("click", connexion);

// Fonction connexion
function connexion(event){
    event.preventDefault();
    
    var erreur = document.getElementById("erreurCo");
    var mail = document.getElementById("emailCo").value;
    var mdpCo = document.getElementById("mdpCo").value;

    // Test validité du mail
    if (sessionStorage.getItem(mail) == undefined){
        erreur.innerHTML = "Ce compte n'existe pas.";
        return false;
    }

    // Test présence de mdp
    if(!mdpCo){
        erreur.innerHTML = "Mot de passe requis.";
        return false;
    }

    // Test si mot de passe correspond au mail saisi
    // var data = sessionStorage.getItem(mail);
    var data = sessionStorage.getItem(mail);

    if((JSON.parse(data)[2]) !== mdpCo){
        erreur.innerHTML = "Connexion refusée.";
        return false;
    }
    else{
        console.log("Connexion OK.");

        // Envoi de la paire mail/mdp en session storage
        sessionStorage.setItem("mail", mail);
        sessionStorage.setItem("mdp", mdpCo);

        // Vider la div erreur
        erreur.innerHTML = "";
    }

    // Redirection en fonction du niveau d'authorisation
    if(JSON.parse(data)[3] === "1" || JSON.parse(data)[3] === "2"){
        window.location.assign("page_admin.html");
    }
    else if(JSON.parse(data)[3] === "3"){
        window.location.assign("detail_adherent.html");
    }
};