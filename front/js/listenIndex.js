// ce fichier permet d'inspecter l'url de la page produit quand on click sur les liens des canapés de la page acceuil.
// cet url contient l'id du canapé cliqué qu'on récupère pour construire et afficher
// la page produit correspondante. 

window.addEventListener('load',()=>{
    // alert("Page chargée")//test chargement ok
    // console.log(window.location);//test:affiche l'url de la page
    //nous allons créer un object de type URLSearchParams qui permet de récupérer des paramètres d'URL et lui passer en argument la chaine à droite du ?
    let searchId=new URLSearchParams(window.location.search);//URL.search correspond à la chaine de caractère de l'url à droite du ?
    // console.log(searchId.has('id'));//test:renvoie true si il y a id dans la chaine à droite de ? dans l'url de la page produit.
    if(searchId.has('id')){
let canapId=searchId.get('id');
console.log(canapId);
    }else{
        window.location.pathname='index.html';
    }
},false);