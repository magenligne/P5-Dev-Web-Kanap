// ce fichier permet d'inspecter l'url de la page produit quand on click sur les liens des canapés de la page acceuil.
// cet url contient l'id du canapé cliqué qu'on récupère pour construire et afficher
// la page produit correspondante.
// let canapId;
window.addEventListener("load", () => {
  // alert("Page chargée")//test chargement ok
  // console.log(window.location);//test:affiche l'url de la page
  //nous allons créer un object de type URLSearchParams qui permet de récupérer des paramètres d'URL et lui passer en argument la chaine à droite du ?
  let searchId = new URLSearchParams(window.location.search); //URL.search correspond à la chaine de caractère de l'url à droite du ?
  // console.log(searchId.has('id'));//test:renvoie true si il y a id dans la chaine à droite de ? dans l'url de la page produit.
  if (searchId.has("id")) {
    let canapId = searchId.get("id");

    // console.log(canapId);

    let myPromise = fetch("http://localhost:3000/api/products/" + canapId); //le résultat de la promesse contient l'article voulu au format txt API
    myPromise
      .then(function (result) {
        if (result) {
          return result.json();
        }
      })
      .then((ProductJson) => {//le résultat du then précédent (article au format json) étant lui-même une promesse, on lui applique un then à lui aussi
        // console.log(ProductJson);
        // console.log(ProductJson.name);
        //traitement des couleurs:
        for(let color of ProductJson.colors)//pour chaque item du tableaux des couleurs de l'article, on ajoute cette couleurs aux autres dans le html de l'article.
        {
            // console.log(color);
            document.querySelector("#colors").innerHTML += ` <option value="${color}">${color}</option> `

        }
        //ajout des autres propriété de l'article dans le html de la page produit:
        document.querySelector(".item__img").innerHTML = `<img src=${ProductJson.imageUrl}>`;
        document.querySelector("#title").innerText = ProductJson.name;
        document.querySelector("#price").innerText = ProductJson.price;
        document.querySelector("#description").innerText =
          ProductJson.description;
      })

      .catch((error) => {
        console.log(error);
      });
  }
});
//comment sortir les variables searchId et canapId pour éviter la répèt suivante?
let searchId = new URLSearchParams(window.location.search); //URL.search correspond à la chaine de caractère de l'url à droite du ?

let canapId = searchId.get("id");

console.log(canapId);
localStorage.Id=canapId;

let ajoutPanier = document.getElementById('addToCart');//on recupere le pointage du bouton dans le DOM dans une variable
ajoutPanier.addEventListener('click',() =>{
        // console.log('ajout au panier');
    //récup de la quantité:
    let quantity=document.getElementById("quantity").value;
    localStorage.quantite=quantity;
//récup de la couleur:
    let color=document.getElementById("colors").value;
    localStorage.couleur=color;
    // console.log(color);  
window.location="cart.html";
},false);

