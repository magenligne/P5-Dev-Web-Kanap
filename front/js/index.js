// Ce fichier permet de récupérer les données sur les canapés dans l'api,
// les traite pour les convertir en lien a html dans la classe items de index.html,
//  pour les afficher dans la page d'acceuil (via Style.css).

// D'abord, on récupère la liste de données de l'api au format json en faisant 1 requete grace à fetch (fonction asynchrone),
// et le résultat de cette requette est mise dans une variable "myPromise" pour l'utiliser comme promesse car fetch renvoie tjrs une promesse.
let myPromise = fetch("http://localhost:3000/api/products");


myPromise
  .then(function (result) {
    // à l'endroit de result se trouve le résultat de la promesse
    // il faut convertir ce résultat au format JSON en faisant result.json(), si le result existe .

    if (result) {
      return result.json();
    }
  })
  .then((listProductJson) => {
    // à l'endroit de listProductJson se trouve le résultat du then précédent (qui est aussi une promesse),
    // ici result.json est la liste des canapés au format json, et on le nomme donc listProductJson.
    // console.log(listProductJson);//ok
    for (let ProductJson of listProductJson) {
      // console.log(ProductJson);//ok
      // Pour chaque objet json de la liste on crée un objet js canape rempli à l'aide du constructeur canape() définit dans canape.js
      let canapeLocal = new canape(ProductJson);
      // console.log(canapeLocal);
      
      // document.querySelector(".items") récupère dans le dom le contenu de la classe "items".
      // ensuite avec la méthode .innerHTML on remplace ce contenu html par ce qui suit le =.
      // enfin grâce au += on concatène ce qui suit avec ce qui existe déjà au lieu de le remplacer.
      document.querySelector(
        ".items"
      ).innerHTML += ` <a href="./product.html?id=${canapeLocal._id}">
            <article>
              <img src=${canapeLocal.imageUrl} alt=${canapeLocal.altTxt}>
              <h3 class="productName">${canapeLocal.name}</h3>
              <p class="productDescription">${canapeLocal.description}</p>
            </article>
          </a> `;
    }
    // let listItems=(document.querySelectorAll(".items a"));
    // console.log(listItems);//ok
  })

  // le backtick pour délimiter une chaîne permet 1/de faire du multiligne et
  // 2/d'utiliser des ${} pour passer des variables dans la chaîne.

  .catch((error) => {
    console.log(error);
  });
