// Ce fichier permet d'inspecter l'url de la page produit quand on clique sur les liens des canapés de la page acceuil.
// cet url contient l'id du canapé cliqué qu'on récupère pour construire et afficher
// la page produit correspondante.

import { ajoutAuPanier } from "./cart.js"; //import d'une fonction pour s'en servir dans ce fichier

//---------------------------------------------------RECUPERATION DE L'ID DANS L'URL-------------------------------------------------------------------
window.addEventListener("load", () => {
  // alert("Page chargée")//test chargement ok
  // console.log(window.location);//test:affiche l'url de la page

  //Nous allons créer un object de type URLSearchParams qui permet de récupérer des paramètres d'URL et lui passer en argument la chaine à droite du ?:
  let searchId = new URLSearchParams(window.location.search); //URL.search correspond à la chaine de caractère de l'url à droite du ?

  if (searchId.has("id")) {
    let canapId = searchId.get("id");
    //La méthode get("txt") appliquée à un objet de type URLSearchParam renvoie la valeur à droite du = dans une chaine de type txt=valeur.
    console.log(canapId); //ok

    //------------------Gestion d'une mauvaise URL: vérification de l'existence de l'id présent dans l'URL
    //-----------------on récupère la liste des id dans l'API:
    let listIDpanier = [];
    let Promise = fetch("http://localhost:3000/api/products");
    Promise.then(function (result) {
      if (result) {
        return result.json();
      }
    }).then((listProductJson) => {
      listIDpanier = listProductJson.map((elementPanier) => {
        return elementPanier._id;
      });
      console.log(listIDpanier);
      let idExist = listIDpanier.find((p) => p == canapId);
      //------------si l'id dans l'URL existe dans l'API, on traite l'affichage de la page:
      if (idExist != undefined) {
        console.log("l'id existe");
        //----------------------------------RECUPERATION DE L'ARTICLE ET SES CARACTERISTIQUES DANS L'API--------------------------------------------------
        let myPromise = fetch("http://localhost:3000/api/products/" + canapId); //le résultat de la promesse contient l'article voulu au format API
        myPromise
          .then(function (result) {
            if (result) {
              return result.json();
            }
          })
          .then((ProductJson) => {
            //---------------------------------------AFFICHAGE DU CHOIX DE COULEURS SPECIFIQUE A L'ARTICLE--------------------------------------------------------------
            for (let color of ProductJson.colors) {
              //pour chaque item du tableaux des couleurs de l'article, on ajoute cette couleurs aux autres dans le html de l'article.
              // console.log(color);
              document.querySelector(
                "#colors"
              ).innerHTML += ` <option value="${color}">${color}</option> `;
            }

            //------------------------------------AFFICHAGE DES AUTRES PROPRIETES--------------------------------------------------------------------------
            document.querySelector(
              ".item__img"
            ).innerHTML = `<img src=${ProductJson.imageUrl}>`;
            document.querySelector("#title").innerText = ProductJson.name;
            document.querySelector("#price").innerText = ProductJson.price;
            document.querySelector("#description").innerText =
              ProductJson.description;
          })

          .catch((error) => {
            console.log(error);
          });

        //-----------------------------ECOUTE DU CLICK POUR AJOUT AU PANIER  -----------------------------------------------------------------------

        let buttonAjoutPanier = document.getElementById("addToCart"); //on recupere le pointage du BOUTON dans le DOM de cart.html dans une variable
        buttonAjoutPanier.addEventListener(
          "click",
          () => {
            let searchId = new URLSearchParams(window.location.search); //URL.search correspond à la chaine de caractère de l'url à droite du ?
            let canapId = searchId.get("id");

            //récup de la quantité choisie par le user dans le DOM à condition qu'elle soit valide (comprise entre 1 et 100) sinon alerte et mise à 0:

            let quantity = document.getElementById("quantity").value;

            if (quantity <= 0 || quantity > 100) {
              alert("La quantité doit être un nombre entre 1 et 100.");
              console.log(quantity);
            } else {
              //récup de la couleur DOM si elle est choisie:
              let color = document.getElementById("colors").value;
              if (color != "") {
                //Ajout de l'objet {id,qte,color} au LocalStorage via la fonction ajoutAuPanier:
                let monAjout = { id: canapId, qte: quantity, color }; //objet js au format Json SANS guillemet permis car on est en JS
                ajoutAuPanier(monAjout);
                window.location = "cart.html";
              } else {
                alert("Sélectionner une couleur avant de commander");
              }
            }
          },
          false
        );
      }
      //si l'id n'existe pas:
      else {
        alert("Un problème est survenu, cliquez sur ok.");
        window.location = "index.html";
      }
    });
  }
  //s'il n'y a pas "id" dans l'URL de la page:
  else {
    alert("Un problème est survenu, cliquez sur ok.");
    window.location = "index.html";
  }
}); //fin de la fonction s"executant au load de la page
