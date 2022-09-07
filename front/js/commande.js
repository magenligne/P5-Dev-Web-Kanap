import { recupPanier } from "./cart.js";

//-------------------------------------------------------ECOUTE? VERIFICATION ET RECUPERATION DANS LE LS DU FORMULAIRE
let formulaire = document.querySelector(".cart__order__form");
// console.log(formulaire.email.value);

formulaire.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    // console.log('coucou');

    //-------------------------------------------------------------------------TEST DU FORMULAIRE
    let validForm = true; //FORMULAIRE valide, deviendra faux si un champ au moins est faux.
    //on recupère un tableau des champs du formulaire dont le renseignement est requis:
    let champs = document.querySelectorAll("input[required]");
    // console.log(champs);

    champs.forEach((champ) => {
      // console.log(champ.name,champ.value);//ok
      //   validation(champ, champ.value);

      //si un champ est faux, on bloque la validation du formulaire:
      if (validation(champ, champ.value) == false) {
        validForm = false;
      }
    });
    // console.log(valid);

    //---------------------------------------RECUPERATION DU FORMULAIRE DANS UN OBJET JSON SI LE FORMULAIRE EST VALIDE
    if (validForm) {
      //on cree un objet JSON vide:
      let monContact = {};
      //on le remplit avec les couples nom de champ/valeur saisie:
      champs.forEach((champ) => {
        //    monContact.push(champ.name,champ.value);
        let nomChamp = champ.name;
        // console.log(nomChamp);

        let valeurSaisie = champ.value;
        // console.log(valeurSaisie);

        monContact[nomChamp] = valeurSaisie;
      });
      // console.log(monContact);//ok
      //----------------------------RECUPERATION DU PANIER DU LS ET EXTRACTION DU TABLEAU D' ID CORRESPONDANTS
      let listIDpanier = recupPanier().map((elementPanier) => {
        return elementPanier.id;
      });
      // console.log(listIDpanier);//ok
      //------------------------------CREATION D'UN OBJET JSON COMPOSE DE L'OBJET CONTACT ET DU TABLEAU D'ID COMME ATTENDU PAR L'API
      let objetAPI = {
        contact: monContact,
        products: listIDpanier,
      };
      //REQUETE API:
      recupNcommande(objetAPI);
    } else {
      alert("Votre panier est vide");
    }
  },
  false
);

//CETTE FONCTION TESTE UN CHAMP.ELLE APPLIQUE LA REGEX SPECIALE SELON LE TYPE DE CHAMP ET RETOURNE TRUE OU FALSE SELON LA VALIDITE DU CHAMP TESTE
//ELLE AFFICHE AUSSI UN MESSAGE D ERREUR SI LE CHAMP EST FAUX.
async function validation(champ, saisie) {
  let valid; //deviendra faux si un champ est faux
  // console.log(champ);
  // console.log(champ.type);

  if (champ.id == "email") {
    let regExMail = /^[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}$/i;
    valid = regExMail.test(saisie);
    // console.log(champ.name + " est de type email");
  } else if (champ.id == "address") {
    let regExAdresse = /^[0-9a-z][0-9a-z,.-]+/i;
    valid = regExAdresse.test(saisie);
  } else {
    let regExTxt = /^[a-z][a-z]+/i;
    valid = regExTxt.test(saisie);
  }
  // console.log(valid); //ok

  //---------------------------GESTION MESSAGES D'ERREUR-------------------------------------------------
  let messageErreur = champ.nextElementSibling; //il s'agit du paragraphe suivant chanque champ
  // console.log(champ.nextElementSibling);

  if (valid == false) {
    messageErreur.innerHTML = `Saisie invalide ou manquante.`;
    if (champ.type == "email") {
      messageErreur.innerHTML += `Le champ Email doit être de type: caractères@caractères.caractères`;
    } else if (champ.id == "address") {
      messageErreur.innerHTML += `Le champ Adresse ne doit contenir que des lettres, chiffres, ou les catactères ", - ."`;
    } else {
      messageErreur.innerHTML += `Les champs Prénom Nom et Ville ne doivent contenir que des lettres.`;
    }
    return valid;//on renvoie valid en reponse de la fonction validation pour mettre à jour la variable validForm en début de code
  } else {
    // console.log(saisie + " est valide");
    return valid;
  }
}

//FONCTION QUI POSTE UN OBJET JSON CONTACT ET UN TABLEAU D'ID  A L API et recupere un numero de commande
function recupNcommande(objetAPI) {
  let reponse = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objetAPI),
  })
    .then(function (result) {
      if (result) {
        return result.json();
      }
    })
    .then((reponseJson) => {
      // console.log(reponseJson);//ok objet contact, orderId et tableaux de produits commandés
      let numDeCommande = reponseJson.orderId;
      //on utilise le format d'URL vu pour l'affichage d'une page produit "URL?clé=valeur":
      window.location = "confirmation.html?NDC=" + numDeCommande;
      // console.log(numDeCommande);//ok
    })
    .catch(function (erreur) {
      console.log(erreur);
    });
}
