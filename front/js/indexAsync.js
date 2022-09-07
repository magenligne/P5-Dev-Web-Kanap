//L'utilisation de async(inutile pour "reponse" qui est une promesse et qui est donc déjà asynchrone) et de await permet au compilateur de continuer
// à executer la suite du code JS même si ce qui est attendu par la fonction asynchrone n'est pas encore arrivé et de revenir executer la fonction
//asynchrone lorsque ce qui est attendu sera arrivé.

let reponse =await fetch("http://localhost:3000/api/products");

//le resultat "reponse" d'une promesse étant une promesse, idem pour le resultat "listProductJson" de la preomesse "reponse":
let listProductJson=await reponse.json();
    
  
    for (let ProductJson of listProductJson) {
      let canapeLocal = new canape(ProductJson);
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
  
    
