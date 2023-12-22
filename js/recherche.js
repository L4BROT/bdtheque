// PROGRAMME PRINCIPAL

window.onload = function () {

    const NB_CARROUSEL = 10;

    // Déclaration des variables
    var resulatRecherche = document.getElementById("searchResult");
    var blockRecherche = document.getElementById("searchIndex");
    var blockCarrousel = document.getElementById("carrousel");
    var carousselDynamique = document.getElementById("dynCarrousel");
    var introTxt = document.getElementById("introTxt");
    var dispo = document.getElementById('dispo');

    // ADDEVENTLISTENERS

    // Sélection et abonnements des inputs recherches
    inputRecherche.forEach((iSearch) => {
        iSearch.addEventListener("input", function(e) {
            var searchValue = e.target.value; // Ciblage du input qui cherche
            switchSearch(bConnect);
            rechercheTxt(searchValue); // Affiche la liste de BD
        });
    })

    // Ajoute un gestionnaire d'événement "click" aux vignettes
    resulatRecherche.addEventListener("click", function(e) {
        idImg = e.target.getAttribute("id"); // Recuperation de la source du click 
        infosBd(idImg); // Affichage de la fiche détaillée
    });

    // Fermeture de la modal
    document.addEventListener('click', function(e) {
        var modal = document.getElementById('infosBD');
        if (e.target.id === 'fermerModal') { // Vérifie si le clic provient bouton "Fermer" de la modal
            modal.parentNode.removeChild(modal); // Destruction de la modal
        }
    });

    setTimeout(() => {tirageCarrousel()}, "200");
    afficheSelectOptions(); // Initialisation des select : auteurs et séries

    // FONCTIONS

    // Modifie la page index en mode recherche
    function switchSearch (bC) {
        blockRecherche.classList.add("fixed-bottom"); // Fixe le block de recherche
        blockCarrousel.classList.add("d-none"); // Fais disparaitre le carrousel
        introTxt.classList.add("d-none"); // Fais disparaitre l'introTxt
        cadreConnecte.setAttribute("class", "d-none");
    }

    // Construit des liens cliquables "auteurs"
    function lienAuteurs () {
        var resultat = "";
        let tAuteur = idAuteur.nom.split(",");
        for (let i in tAuteur) {
            resultat += '<a href="index.html?auteur=' 
            + tAuteur[i].trim().toLowerCase() + '" title="Voir tous les albums de : ' 
            + tAuteur[i] + '">' 
            + tAuteur[i] + '</a>';
            if (i < tAuteur.length - 1) {
                resultat += ", ";
            }
        }
        return resultat;
    }

    function tirageCarrousel () {
        let tTirage = [];
        let tirageID;
        var longMap = albums.size; // Obtenir la longueur de la map
        while (tTirage.length < NB_CARROUSEL) {
            // Tirage au sort des ID
            tirageID = Math.floor(Math.random() * longMap).toString();
            if (!tTirage.includes(tirageID) && albums.has(tirageID)) {
                tTirage.push(tirageID);
            }
        }

        let resultat = "";
        for (var idx in tTirage) {
            // Recupération des données
            recuperationDonnees(tTirage[idx]);
            let actif = idx < 1 ? " active" : "";
            let atr = lienAuteurs(); // construction des liens

            resultat += '<div class="carousel-item'
                        + actif +'"><div class="col-12 col-sm-auto"><img src="' 
                        + imgSrc + '" alt="' 
                        + titreAlbm + '" /></div><div class="col-12 col-sm-8 carousel-caption d-md-block"><h3>' 
                        + titreAlbm + '</h3><p>Série : <a href="index.html?serie=' 
                        + numSerie + '">' 
                        + nomSerie + '</a><br />Auteurs : ' 
                        + atr + '</p></div></div>';
        }
        carousselDynamique.innerHTML = '<div class="carousel-inner">' + resultat + '</div>';
    }

    // Affiche les résultats des BD en mosaique
    function rechercheTxt (txt) {
        // Initialisation
        let listeAlbum = '<h1>Vos résultats de recherche pour : <span id="txtOption">' + txt + '</span></h1><div id="nbBD" class="mb-3"></div>'; // Initialisation listeSerie
        let nbBd = 0;
        let map = triMap(albums, "titre");
        map.forEach((album, id) => {
            // Vérifier si le texte de recherche est présent dans le titre de l'album
            if (album.titre.toLowerCase().indexOf(txt.toLowerCase()) !== -1) {
                listeAlbum += afficheMiniatureAlbum(id);
                nbBd++;
            }
        });
            // Si aucun album trouvé
            if (nbBd === 0) {
                listeAlbum = "Aucun album trouvé pour la recherche";
            } else {
                var departDiff = "<strong>" + nbBd + "</strong> BD touvées</div>";
            }
            resulatRecherche.innerHTML = listeAlbum; // Affichage de la mosaique de résultats
            document.getElementById("nbBD").innerHTML = departDiff;
    }

    // Affichage des vignettes Boostrap prend l'ID de l'album en parametre
    function afficheMiniatureAlbum (id) {
        // Recupération des données
        recuperationDonnees(id);
        // Création du contenu
        listeAlbum = '<div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"><div class="listeAlbum card"><img data-bs-toggle="modal" id="' 
                        + id + '" class="card-img-top" alt="' 
                        + titreAlbm + '" src="' 
                        + imgSrc + '" /><h3>' 
                        + titreAlbm + '</h3></div></div>';
    
        return listeAlbum;
    }
    
    // Recherche les BD en fonction des listes déroulantes
    function afficheSelectOptions () {
        var serieId = "";
        var auteurNom = "";
        var tUrl = decoupeUrl (); // tableau des parametres d'URL

        if (tUrl !== undefined) { // Si tUrl contient des clés / valeurs
            for (let i = 0; i < tUrl.length; i++) { // Parcourir tous les éléments du tableau tUrl
                
                var dansTab = tUrl[i]; // Accéder à l'élément intérieur du tableau

                // Vérifie si "auteur" est présent dans l'élément intérieur
                // if (dansTab.includes("tri")) {
                //     triMode = dansTab[1]; // Mode de tri
                //     break;
                // } else {
                //     triMode = 1;
                // }
                
                if (dansTab.includes("serie")) {
                    serieId = dansTab[1]; // ID de la série
                    break;
                } else if (dansTab.includes("auteur")) {
                    auteurNom = dansTab[1]; // Nom de l'auteur
                    break;
                }
            }

            // Initialisation
            switchSearch(bConnect);
            var listeAlbum = '<h1>Vos résultats de recherche pour : <span id="txtOption"></span></h1><div id="nbBD" class="mb-3"></div>'; // Initialisation listeSerie
            var nbBd = 0;
            let map = triMap(albums, "titre");
            
            if (serieId) { // Recherche des albums par séries

                var optSerie = series.get(serieId).nom;

                map.forEach((album, id) => {
                    if (serieId == album.idSerie) {
                        listeAlbum += afficheMiniatureAlbum(id);
                        nbBd++;
                    }
                });

            } else if (auteurNom) { // Recherche des albums par auteurs

                var optSerie = auteurNom;

                map.forEach((album, id) => {
                    var autNom = auteurs.get(album.idAuteur).nom.toLowerCase();
                    let tAuteur = autNom.split(",");
                        if (tAuteur.some(auteur => auteur.trim() === optSerie)) {
                            listeAlbum += afficheMiniatureAlbum(id);
                            nbBd++;
                        }
                });

            }

            if (nbBd === 0) { // Si aucun album trouvé
                listeAlbum = "Aucun album trouvé pour la recherche";
            } else {
                var departDiff = "<strong>" + nbBd + "</strong> BD touvées</div>";
            }

            resulatRecherche.innerHTML = listeAlbum; // Affichage de la mosaique de résultats
            document.getElementById("nbBD").innerHTML = departDiff;
            document.getElementById("txtOption").innerHTML = optSerie;
        }
    }

    // Affiche le détail des informations d'une BD
    function infosBd (id) {
        recuperationDonnees(id, SRC_ALBUM); // Recupération des données
        let atr = lienAuteurs(); // construction des liens
        let nbDispo = nbExemplaireFromId(id);
        let classDispo = "";
        let txtDispo = "";

        if (nbDispo > "0") {
            classDispo += "text-success";
            txtDispo += "Disponible, il reste " + nbDispo + " exemplaire(s)";
        } else {
            classDispo += "text-danger";
            txtDispo += "Indisponible";
        }

        // Création du contenu
        var contenu = '<div class="modal" id="infosBD" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h3 class="modal-title">' 
        + nomSerie + '</h3><button type="button" id="fermerModal" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button></div><div class="row"><div class="col-7 p-4"><h5>' 
        + titreAlbm + '</h5></div><div class="col-5 text-end p-4">Série n°' 
        + numSerie + '</div></div><div class="text-center"><div class="mb-2">Auteur : ' 
        + atr + '</div><img class="" title="' 
        + titreAlbm + '" src="' 
        + imgSrc + '" /></div><div class="row p-3"><div class="col-9 text-start px-4"><span class="' 
        + classDispo + '">' 
        + txtDispo + '</span></div><div class="col-3 text-end px-4"><button type="button" id="fermerModal" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div></div></div>';

        // Crée un élément div pour contenir la modal
        var modalContainer = document.createElement('div');
        modalContainer.innerHTML = contenu;

        // Ajoute la modal au corps du document
        document.body.appendChild(modalContainer.firstChild);

        var modal = document.getElementById('infosBD');

        // Affiche la modal
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        modal.style.display = 'block';
        modal.classList.add('fade');
    }

}; // FIN fonction ONLOAD