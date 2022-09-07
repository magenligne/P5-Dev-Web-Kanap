//--------------------RECUPERATION DANS L'URL DU NUMERO DE COMMANDE ET AFFICHAGE DANS LA PAGE--------------------
let searchNDC = new URLSearchParams(window.location.search);
if (searchNDC.has("NDC")) {
    let NDC = searchNDC.get("NDC");
 //URL.search correspond à la chaine de caractère de l'url à droite du ?.
 //La méthode get appliquée à un objet URLSearchParam renvoie la string à droite du = à droite de l'argument
console.log(NDC);
let baliseNDC=document.querySelector("#orderId");
baliseNDC.innerHTML=NDC;
}