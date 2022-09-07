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
            article.remove();
            qteTotale -= parseInt(idQteColor.qte, 10);
            document.querySelector("#totalQuantity").innerText = qteTotale;
            prixTotal -= ProductJson.price * parseInt(idQteColor.qte, 10);
            document.querySelector("#totalPrice").innerText = prixTotal;
            supprimeLigne(idQteColor);
          },
          false
        );

        //-----------------------------------------------------ECOUTE ET GESTION DES MODIF DE QUANTITE
        let quantite = article.querySelector(".itemQuantity");
        quantite.addEventListener(
          "change",
          (Event) => {
            console.log(Event.target.value);
            // console.log(qteTotale);
            if (Event.target.value >= 1) {
              //on modifie la quantité de l'article dans le panier
              modifierQtePanier(idQteColor, Event.target.value);
              // //on recharge la page pour mise à jour qte et prix total:
              window.location = "cart.html";
            //   if(Event.target.value>idQteColor.qte){
            //   let difference = Event.target.value-parseInt(idQteColor.qte,10);
            //   console.log(Event.target.value+"-"+parseInt(idQteColor.qte,10)+"="+difference);

            //   qteTotale += difference;
            //   document.querySelector("#totalQuantity").innerText = qteTotale;
            //   prixTotal += ProductJson.price * difference;
            //   document.querySelector("#totalPrice").innerText = prixTotal;

            // }
            //   else{
            //     let difference = parseInt(idQteColor.qte,10)-Event.target.value;
            //     console.log(parseInt(idQteColor.qte,10)+"-"+Event.target.value+"="+difference);
  
            //     qteTotale -= difference;
            //     document.querySelector("#totalQuantity").innerText = qteTotale;
            //     prixTotal -= ProductJson.price * difference;
            //     document.querySelector("#totalPrice").innerText = prixTotal;    
            //   }

            }
            //si la quantité est nulle, on supprime l'article du DOM et du LS:
            else {
              article.remove();
              qteTotale -= parseInt(idQteColor.qte, 10);
              document.querySelector("#totalQuantity").innerText = qteTotale;
              prixTotal -= ProductJson.price * parseInt(idQteColor.qte, 10);
              document.querySelector("#totalPrice").innerText = prixTotal;

              supprimeLigne(idQteColor);
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
  articleQuiChange.qte = newQte;
  // console.log(idQteColor.qte);
  // console.log(newQte);
  savePanier(Panier);
  console.log(Panier);
}

window.addEventListener("load", affichePanier()); //on appelle la fonction à s'exécuter au chargement de la page panier
