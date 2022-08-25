function savePanier(Panier) {
  //Panier est un tableau d'objet JS au format txt ex: indice 0 {Id,qte,couleur}
  localStorage.setItem("monPanier", JSON.stringify(Panier)); //on sauve un Panier txt
}
function recupPanier() {
  let panierRecup = localStorage.getItem("monPanier"); //panierRecup est un txt
  if (panierRecup == null) {
    return [];
  } else {
    return JSON.parse(panierRecup); //on recupere un tableau d'objet JS ex: indice 0 {Id,qte,couleur}
  }
}

export function ajoutAuPanier({ id, qte, color }) {
  // 1 arg objet  avec 3 propriété
  // console.log(id);//ok
  let PanierA = recupPanier(); //on recupère le tableau  d'objets du panier [clé:0, valeur:{id:"id",qte:"quantité",color:"couleur"}] dans localStorage au format Json
  let memeProduit = PanierA.find((p) => p.id == id && p.color == color);
  if (memeProduit != undefined) {
    //on ajoute la quantite en arg de ajoutAuPanier à la qte initiale
    memeProduit.qte = parseInt(memeProduit.qte, 10) + parseInt(qte, 10);
  } else {
    PanierA.push({ id, qte, color });
  }
  savePanier(PanierA);
}

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

        qteTotale += parseInt(idQteColor.qte, 10);

        // console.log(qteTotale) ;
        document.querySelector("#totalQuantity").innerText = qteTotale;

        prixTotal += ProductJson.price * parseInt(idQteColor.qte, 10);
        document.querySelector("#totalPrice").innerText = prixTotal;
        // console.log(prixTotal);//ok

        //gestion des suppressions:
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
            // let indexPanier=Panier.findIndex(iqc=>iqc===idQteColor);
            // console.log(indexPanier);
            // Panier.splice(indexPanier,1);
            // console.log(Panier);
            // savePanier(Panier);
          },
          false
        );

//gestion des modif de qte:
let quantite = article.querySelector(".itemQuantity");
quantite.addEventListener(
  'change',
  (Event) => {
    qteTotale -= parseInt(idQteColor.qte, 10);
    prixTotal -= ProductJson.price * parseInt(idQteColor.qte, 10);

    console.log(Event.target.value);
    qteTotale += parseInt(Event.target.value, 10);
    prixTotal += ProductJson.price * parseInt(Event.target.value, 10);

    document.querySelector("#totalQuantity").innerText = qteTotale;

    document.querySelector("#totalPrice").innerText = prixTotal;
    // supprimeLigne(idQteColor);
    // let indexPanier=Panier.findIndex(iqc=>iqc===idQteColor);
    // console.log(indexPanier);
    // Panier.splice(indexPanier,1);
    // console.log(Panier);
    // savePanier(Panier);
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

function supprimeLigne(idQteColor) {
  let Panier = recupPanier();
  let indexPanier = Panier.findIndex((iqc) => iqc === idQteColor);

  console.log(indexPanier);
  Panier.splice(indexPanier, 1);
  console.log(Panier);
  savePanier(Panier);
}

window.addEventListener("load", affichePanier()); //on appelle la fonction à s'exécuter au chargement de la page panier
