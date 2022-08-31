let reponse =await fetch("http://localhost:3000/api/products");


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
  
    
