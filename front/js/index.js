// ce fichier permet de récupérer les données sur les canapés dans l'api,
// les traite pour les convertir en lien a html dans la classe items de index.html,
//  ce qui permet de les afficher dans la page acceuil (via StyleSheet.css). 


// d'abord on récupère la liste de données de l'api au format json en faisant une requete grace à fetch,
// et cette requette on la met dans une variable pour l'utiliser comme promesse.
let myPromise = fetch("http://localhost:3000/api/products");

// comment utiliser cela?:
// myPromise((resolve,reject)=>{
//     let responseFromServer;
//     if(responseFromServer){
//     resolve("Données récupérées");
//     } else {
//     reject("Echec de récupération des données");
//     }
//     }  );

    myPromise
    .then(function (result){
            // à l'endroit de result se trouve le résultat de la promesse 
            // (ici de notre fetch) au format Texte . Pour l'utiliser en JS,
            // il faut convertir ce résultat au format JSON en faisant result.json(), si le result existe .

        if(result){
    return result.json();
    }})
    .then(listProductJson=>{
      // à l'endroit de listProductJson se trouve le résultat du then précédent,
      // ici result.json qui est la liste des canapés au format json, et qu'on nomme 
      // donc listProductJson.
        // console.log(listProductJson);
        for (let ProductJson of listProductJson) {
            // console.log(ProductJson);
// pour chaque objet json de la liste on crée un objet js canape rempli à l'aide du constructeur
            let canapeLocal = new canape(ProductJson);
            // console.log(canapeLocal);
            // document.querySelector(".items") récupère dans le dom le contenu de la classe "items"
            // ensuite avec la méthode .innerHTML on remplace ce contenu html par ce qui suit le =.
            // enfin grâce au += on concatène ce qui suit avec ce qui existe déjà au lien de remplacer.
            document.querySelector(".items").innerHTML+=` <a href="./product.html?id=${canapeLocal._id}">
            <article>
              <img src=${canapeLocal.imageUrl} alt=${canapeLocal.altTxt}>
              <h3 class="productName">"${canapeLocal.name}"</h3>
              <p class="productDescription">${canapeLocal.description}</p>
            </article>
          </a> `
        }
        // let listItems=(document.querySelectorAll(".items a"));
        // console.log(listItems);
        // return listItems;
        })

        // le backtick pour délimiter une chaîne permet 1/de faire du multiligne et
        // 2/d'utiliser des ${} pour passer des variables dans la chaîne.

    .catch(error=>{
    console.log(error);
    });

   


    




  