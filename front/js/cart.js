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
// function supprimeArticle(article) {//article est un objet { id, qte, color } du LS
//   let panierSup = recupPanier();
//   panierSup = panierSup.filter((itemPanier) => (itemPanier.Id = !article.Id));
//   savePanier(panierSup);
// }

export function ajoutAuPanier({ id, qte, color }) {
  // 1 arg objet  avec 3 propriété
  // console.log(id);//ok
  let PanierA = recupPanier(); //on recupère le tableau  d'objets du panier [clé:0, valeur:{id:"id",qte:"quantité",color:"couleur"}] dans localStorage au format Json
let memeProduit = PanierA.find(p => p.id == id && p.color==color);
if(memeProduit != undefined){
//on ajoute la quantite en arg de ajoutAuPanier à la qte initiale
memeProduit.qte=(parseInt(memeProduit.qte,10)+parseInt(qte,10));
}
else{
PanierA.push({ id, qte, color });
}
savePanier(PanierA);

}
function qteTotale(){
  let panier=recupPanier();
  let qteTotale=0;
  for(let article of panier){
    qteTotale+=parseInt(article.qte,10);
  }
  // console.log(qteTotale) ;
    document.querySelector("#totalQuantity").innerText=qteTotale;
}

function affichePanier() {
  let Panier = recupPanier();
  let prixTotal=0;
// let qteTotale=0;
  for (let idQteColor of Panier) {
    //pour chaque article du panier:
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
prixTotal+=(ProductJson.price*parseInt(idQteColor.qte,10));
  document.querySelector("#totalPrice").innerText= prixTotal;
// console.log(prixTotal);//ok
})
      .catch((error) => {
        console.log(error);
      });
  }

}
window.addEventListener("load", affichePanier());//on appelle la fonction à s'exécuter au chargement de la page panier
window.addEventListener("load", qteTotale());//on appelle la fonction à s'exécuter au chargement de la page panier


// let supprimer = document.getElementsByClassName('deleteItem');//on recupere le pointage du BOUTON dans le DOM de cart.html dans une variable
// supprimer.addEventListener('click',() =>{
//   //il faudra recuperer l'objet{id,qte,color} à supprimer ds le LS et supprimer le html correspondant dans le dom
// supprimeArticle();
// },false);

// for( let i = 0; i < localStorage.length; i++){
//     localStorage.key(i);
//     console.log(i);
// }
