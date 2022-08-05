
let myPromise = fetch("http://localhost:3000/api/products");
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
        if(result){
    return result.json();
    }})
    .then(listProductJson=>{
        // console.log(listProductJson);
        for (let ProductJson of listProductJson) {
            // console.log(ProductJson);

            let canapeLocal = new canape(ProductJson);
            // console.log(canapeLocal);
            document.querySelector(".items").innerHTML+=` <a href="#">
            <article>
              <img src=${canapeLocal.imageUrl} alt=${canapeLocal.altTxt}>
              <h3 class="productName">"${canapeLocal.name}"</h3>
              <p class="productDescription">${canapeLocal.description}</p>
            </article>
          </a> `
        }
        })

    .catch(error=>{
    console.log(error);
    });
  