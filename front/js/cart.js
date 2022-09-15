//LS:CETTE FONCTION SAUVE UN TABLEAU D'OBJETS {ID,QTE,COULEUR} DANS LE LS AU FORMAT TXT
function savePanier(Panier) {
  //Panier est un tableau d'objet JS au format txt ex: indice: 0 valeur: {Id,qte,couleur}
  localStorage.setItem("monPanier", JSON.stringify(Panier)); //on sauve un Panier txt
}
//LS:CETTE FONCTION EXTRAIT LE PANIER ACTUEL DU LOCALSTORAGE ET LE TRANSFORME EN TABLEAU D OBJET JSON
export function recupPanier() {
  let panierRecup = localStorage.getItem("monPanier"); //panierRecup est un txt
  if (panierRecup == null) {
    return [];
  } else {
    return JSON.parse(panierRecup); //on recupere un tableau d'objet JSon ex: indice 0 {Id,qte,couleur}
  }
}
//LS:CETTE FONCTION AJOUTE L ARTICLE CLICKER DANS LE LS, SAUF S IL EXISTE DEJA, DANS CE CAS LA FONCTION MET A JOUR SA QUANTITE
export function ajoutAuPanier({ id, qte, color }) {
  // 1 arg objet  avec 3 propriété
  // console.log(id);//ok
  let PanierA = recupPanier(); //on recupère le tableau  d'objets du panier [clé:0, valeur:{id:"id",qte:"quantité",color:"couleur"}] dans localStorage au format Json
  console.log(PanierA);
  let memeProduit = PanierA.find((p) => p.id == id && p.color == color);
  if (memeProduit != undefined) {
    //on ajoute la quantite en arg de ajoutAuPanier à la qte initiale
    memeProduit.qte = parseInt(memeProduit.qte, 10) + parseInt(qte, 10);
    //parseInt(string,10) transforme une string en nombre en base 10
  } else {
    PanierA.push({ id, qte, color });
  }
  savePanier(PanierA);
}

//DANS CETTE FONCTION, POUR CHAQUE OBJET DU PANIER, ON CREER UN ARTICLE DANS LE DOM POUR L AFFICHER, ON ECOUTE LE CLICK SUR SUPPRIMER 
//ET LA MODIF DE QUANTITE ET ON LES GERE en cas de click.
function affichePanier() {
  let Panier = recupPanier();
  let prixTotal = 0;
  let qteTotale = 0;
  for (let idQteColor of Panier) {
    //pour chaque article du panier:
    //on recupere chaque objet à afficher au panier dans l'api à partir de son id:
    let myPromise = fetch(
      "http://localhost:3000/api/products/" + idQteColor.id
    ); //le résultat de la promesse contient l'article voulu au format ?
    myPromise
      .then(function (result) {
        if (result) {
          return result.json(); //on convertit l'objet au format Json
        }
      })
      .then((ProductJson) => {
        //---------------------------------------------------------CREATION D UN ARTICLE DOM (AFFICHAGE)
        let article = document.createElement("article");
        article.setAttribute("class", "cart__item");
        article.setAttribute("data-id", idQteColor.id);
        article.setAttribute("data-color", idQteColor.color);
        article.innerHTML = ` <div class="cart__item__img">
       <img src=${ProductJson.imageUrl} alt=${ProductJson.altTxt}>
       </div>
       <div class="cart__item__content">
         <div class="cart__item__content__description">
           <h2>${ProductJson.name}</h2>
           <p>${idQteColor.color}</p>
           <p>${ProductJson.price} euros</p>
         </div>
         <div class="cart__item__content__settings">
           <div class="cart__item__content__settings__quantity">
             <p>Qté : </p>
             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${idQteColor.qte}">
           </div>
           <div class="cart__item__content__settings__delete">
             <p class="deleteItem">Supprimer</p>
           </div>
         </div>
       </div> `;
        document.querySelector("#cart__items").appendChild(article);

//------------------------------------------------------------CALCUL QUANTITE TOTALE ET PRIX TOTAL
        qteTotale += parseInt(idQteColor.qte, 10);

        // console.log(qteTotale) ;
        document.querySelector("#totalQuantity").innerText = qteTotale;

        prixTotal += ProductJson.price * parseInt(idQteColor.qte, 10);
        document.querySelector("#totalPrice").innerText = prixTotal;
        // console.log(prixTotal);//ok

        //---------------------------------------------------ECOUTE ET GESTION DES SUPPRESSIONS
        let supprime = article.querySelector(".deleteItem");
        supprime.addEventListener(
          "click",
          () => {
            //suppression dans le DOM:
            article.remove();
            qteTotale -= parseInt(idQteColor.qte, 10);
            document.querySelector("#totalQuantity").innerText = qteTotale;
            prixTotal -= ProductJson.price * parseInt(idQteColor.qte, 10);
            document.querySelector("#totalPrice").innerText = prixTotal;
            //suppression dans le LS:
            supprimeLigne(idQteColor);
          },
          false
        );

        //-----------------------------------------------------ECOUTE ET GESTION DES MODIF DE QUANTITE
        let quantite = article.querySelector(".itemQuantity");
        quantite.addEventListener(
          "change",
          (Event) => {
            // console.log(Event.target.value);
            // console.log(qteTotale);
            if (Event.target.value >= 1 && Event.target.value < 101) {
              //on modifie la quantité de l'article dans le panier
              
              modifierQtePanier(idQteColor, Event.target.value);
              // //on recharge la page pour mise à jour qte et prix total:
              // window.location = "cart.html";

            }
            else{
              alert("La quantité doit être un nombre entre 1 et 100.");
            }
          },
          false
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  console.log(Panier);
}

//LS:CETTE FONCTION SUPPRIME UNE LIGNE ID/QUANTITE/COULEUR DU LOCALSTORAGE
function supprimeLigne(idQteColor) {
  let Panier = recupPanier();
  let indexPanier = Panier.findIndex((iqc) => iqc === idQteColor);

  console.log(indexPanier);//index négatif??
  Panier.splice(indexPanier, 1);
  console.log(Panier);
  savePanier(Panier);
}

//LS:CETTE FONCTION TROUVE LA LIGNE A MODIFIER DU LS ET REMPLACE SA QUANTITE PAR LA NOUVELLE
function modifierQtePanier(idQteColor, newQte) {

  let Panier = recupPanier();
  let articleQuiChange = Panier.find(
    (iqc) => iqc.id == idQteColor.id && iqc.color == idQteColor.color
  );
  let vieilleQte=articleQuiChange.qte;
  articleQuiChange.qte = newQte;

  let prixTotal=document.querySelector("#totalPrice");
  // console.log("selecteur prix total: ",prixTotal);
  // console.log("prix total précédent: ",prixTotal.innerText);

  
  // console.log("vieille qte: ",vieilleQte);
  // console.log("new qte: ",newQte);
  savePanier(Panier);
  // console.log(Panier);
  let qteTotale=document.querySelector("#totalQuantity");
  // console.log("qte totale innertext avant calcul: ",qteTotale.innerText);
  qteTotale.innerText= parseInt(qteTotale.innerText) - parseInt(vieilleQte) + parseInt(newQte);
  console.log("qte totale innertext: ",qteTotale.innerText);


  // console.log(document.querySelector(".cart__item__content__description p"));
  // console.log(document.querySelector(".cart__item__content__description p").nextElementSibling.innerText);
  let prixUnitaire=parseInt(document.querySelector(".cart__item__content__description p").nextElementSibling.innerText);

  prixTotal.innerText=parseInt(prixTotal.innerText)-(parseInt(vieilleQte)*prixUnitaire)+(parseInt(newQte)*prixUnitaire);
  // console.log("prix total: ",prixTotal.innerText);

}
window.addEventListener("load",()=>{
console.log(window.location);
if(window.location == "http://127.0.0.1:5500/front/html/cart.html"){
affichePanier(); //on appelle la fonction à s'exécuter au chargement de la page panier
}
});
