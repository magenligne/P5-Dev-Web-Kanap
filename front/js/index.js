
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
            let canapeLocal = new canape(ProductJson);
            document.querySelector(".items").innerHTML+=` <a href="./product.html?id=42">
            <article>
              <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">Kanap name1</h3>
              <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
          </a> `
        }
        })

    .catch(error=>{
    console.log(error);
    });
  