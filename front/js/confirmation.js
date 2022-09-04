let searchNDC = new URLSearchParams(window.location.search);
if (searchNDC.has("NDC")) {
    let NDC = searchNDC.get("NDC");
 //URL.search correspond à la chaine de caractère de l'url à droite du ?
console.log(NDC);
let baliseNDC=document.querySelector("#orderId");
baliseNDC.innerHTML=NDC;
}