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
// function supprimeArticle(article) {
//   let panierSup = recupPanier();
//   panierSup = panierSup.filter((itemPanier) => (itemPanier.Id = !article.Id));
//   savePanier(panierSup);
// }

export function ajoutAuPanier({ id, qte, color }) {
  // 1 arg objet  avec 3 propriété
  // console.log(id);//ok
  let Panier = recupPanier(); //on recupère le tableau  d'objets du panier [clé:0, valeur:{id:"id",qte:"quantité",color:"couleur"}] dans localStorage au format Json
  Panier.push({ id, qte, color }); //on ajoute le produit au format Json. rq: .push marche sur tableau d'objet au format Json
  //programmer ici le test pour gérer les articles de même id et même couleur --> un seul objet dans le localstorage avec qte=qte1+qte2
  savePanier(Panier); //argument Panier est au format Json et on l'enregistre au format txt ds localstorage
}

function affichePanier() {
  let Panier = recupPanier();
  for (let idQteColor of Panier) {
    //on recupere chaque objet à afficher au panier dans l'api à partir de son id:
    let myPromise = fetch(
      "http://localhost:3000/api/products/" + idQteColor.id
    ); //le résultat de la promesse contient l'article voulu au format ?
    myPromise
      .then(function (result) {
        if (result) {
          return result.json();//on convertit l'objet au format Json
        }
      })
      .then((ProductJson) => {
        //le résultat du then précédent (objet au format json) étant lui-même une promesse, on lui applique un then à lui aussi
        //pour modifier le html:
        // console.log(ProductJson.name,idQteColor.qte,idQteColor.color); //ok
        document.querySelector(
          "#cart__items"
        ).innerHTML += ` <article class="cart__item" data-id=${idQteColor.id} data-color=${idQteColor.color}>
  <div class="cart__item__img">
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
  </div>
</article>`;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
window.addEventListener("load", affichePanier());//on appelle la fonction à s'exécuter au chargement de la page panier

// let monAjout=localStorage.monAjout;//monAjout vient de localStorage, c'est donc un objet linéaire en chaine de caractères
// console.log(monAjout);//ok "id,quantity,color"
// console.log(monAjout[0]);//4? du coup

//on transforme la chaine de caractère en tableau:
// let monAjoutTable=monAjout.split(",");
// console.log(monAjoutTable);//ok
// console.log(monAjoutTable[0]);//affiche l'id

//TEST DU LOCALSTORAGE POUR VOIR SI LE MËME ARTICLE DE MEME COULEUR EXISTE DEJA:
// for( let i = 0; i < localStorage.length; i++){
//     //soit cle chaque ligne indice i "Id,quantity,color" stocké dans localStorage
//     let cle=localStorage.key(i);
//     //on transforme cette ligne en tableau pour pouvoir comparer les id et couleur seulement:
//     let cleTable=cle.split(",");

//     if(cleTable[0]==monAjoutTable[0] && cleTable[2]==monAjoutTable[2]){//si un produit d'id égal est déja dans le panier,
//         //et si ce produit et aussi de même couleur, on ajoute la quantité déjà stockée à la quantité de mon ajout:
//            monAjoutTable[1]+=cleTable[1];
//             //on supprime la ligne indice i:
//        localStorage.removeItem("i");
//                     //    //on met à jour la ligne cle dans localStorage:
//                     //    let cleModifieeTxt = cleTable.toString();//on retransforme la ligne comparée en txt
//                     //    //on supprime l'ancienne et on remplace par la nouvelle:
//                     //    localStorage.removeItem("i");
//                     //    localStorage.setItem("i",cleModifieeTxt);

//     //et on modifie la quantité dans le panier:

//     }
//     else{
//sinon on ajoute l'article tel quel au panier:
//gestion localStorage:

// }

// for( let i = 0; i < localStorage.length; i++){
//     localStorage.key(i);
//     console.log(i);
// }
