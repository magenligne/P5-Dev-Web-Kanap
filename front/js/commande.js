import { recupPanier } from "./cart.js";

//AJOUT SUITE SOUTENANCE: test de la validité du champ à chaque saisie utilisateur sans attendre le click sur Commander-----------

let champs = document.querySelectorAll("input[required]");
// console.log(champs);
champs.forEach((champ) => {
  champ.addEventListener(
    "change",
    (Event) => {
      console.log(champ.name, champ.value); //ok
      validation(champ, champ.value);
    },
    false
  );
});

//------------------------------------------------------------------------------------------------------------------------------

//-----------------------------ECOUTE DU BOUTON COMMANDER, VERIFICATION DU FORMULAIRE ET RECUPERATION DANS LE LS----------------

let formulaire = document.querySelector(".cart__order__form");
console.log(formulaire.email.value);

formulaire.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    //-------------------------------------------------------------------------TEST DU FORMULAIRE
    let validForm = true; //FORMULAIRE valide, deviendra faux si un champ au moins est faux.
    //on recupère un tableau des champs du formulaire dont le renseignement est requis:
    let champs = document.querySelectorAll("input[required]");
    // console.log(champs);
    console.log("validForm est " + validForm + " avant le forEach");
    champs.forEach((champ) => {
      // console.log(champ.name,champ.value);//ok
      let resultatValidChamp = validation(champ, champ.value);
      console.log(resultatValidChamp);

      //si un champ est faux, on bloque la validation du formulaire:
      if (!resultatValidChamp) {
        validForm = false;
      }
    });
    console.log("validForm est " + validForm + " après le forEach");

    //----------------------------RECUPERATION DU PANIER DU LS ET EXTRACTION DU TABLEAU D' ID CORRESPONDANTS SI LE PANIER N'EST PAS VIDE
    console.log(recupPanier().length);
    if (recupPanier().length !== 0) {
      let listIDpanier = recupPanier().map((elementPanier) => {
        return elementPanier.id;
      });
      // console.log(listIDpanier);//ok
      //---------------------------------------RECUPERATION DU FORMULAIRE DANS UN OBJET JSON SI LE FORMULAIRE EST VALIDE
      if (validForm) {
        //on cree un objet JSON vide:
        let monContact = {};
        //on le remplit avec les couples nom de champ/valeur saisie:
        champs.forEach((champ) => {
          let nomChamp = champ.name;
          let valeurSaisie = champ.value;
          // console.log(valeurSaisie);
          monContact[nomChamp] = valeurSaisie;
        });
        // console.log(monContact);//ok

        //--------------CREATION D'UN OBJET JSON COMPOSE DE L'OBJET CONTACT ET DU TABLEAU D'ID COMME ATTENDU PAR L'API
        let objetAPI = {
          contact: monContact,
          products: listIDpanier,
        };
        console.log(objetAPI);
        //---------------------------REQUETE API=> obtention n° de commande et redirection page confirmation
        recupNcommande(objetAPI).then((reponseJson) => {
          let numDeCommande = reponseJson.orderId;
          console.log(reponseJson);
          //on utilise le format d'URL vu pour l'affichage d'une page produit "URL?clé=valeur":
          window.location = "confirmation.html?NDC=" + numDeCommande;
          console.log(numDeCommande); //ok

          //----------------------------on vide le panier LS et le panier affiché:
          localStorage.clear();
          document.querySelector("#cart__items").innerHTML = "";
        });
      } else {
        alert("Le formulaire est à compléter et/ou à corriger");
      }
    } else {
      alert("Le panier est vide");
    }
  },
  false
);

//CETTE FONCTION TESTE UN CHAMP.ELLE APPLIQUE LA REGEX SPECIALE SELON LE TYPE DE CHAMP ET RETOURNE TRUE OU FALSE SELON LA VALIDITE DU CHAMP TESTE
//ELLE AFFICHE AUSSI UN MESSAGE D ERREUR SI LE CHAMP EST FAUX.
function validation(champ, saisie) {
  let valid; //deviendra faux si un champ est faux
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
      alert(
        "Le champ Email doit être de type: caractères@caractères.caractères"
      );
      messageErreur.innerHTML += `Le champ Email doit être de type: caractères@caractères.caractères`;
    } else if (champ.id == "address") {
      alert(
        "Le champ Adresse ne doit contenir que des lettres, chiffres, ou les catactères , - ."
      );
      messageErreur.innerHTML += `Le champ Adresse ne doit contenir que des lettres, chiffres, ou les catactères ", - ."`;
    } else {
      alert(
        "Les champs Prénom Nom et Ville ne doivent contenir que des lettres."
      );
      messageErreur.innerHTML += `Les champs Prénom Nom et Ville ne doivent contenir que des lettres.`;
    }
    console.log(saisie + " n'est pas valide");

    return valid; //on renvoie valid en reponse de la fonction validation pour mettre à jour la variable validForm en début de code
  } else {
    messageErreur.innerHTML = "";
    console.log(saisie + " est valide");
    return valid;
  }
}

//FONCTION QUI POSTE UN OBJET JSON CONTACT ET UN TABLEAU D'ID  A L API et recupere un numero de commande
function recupNcommande(objetAPI) {
  return fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objetAPI),
  })
    .then(function (result) {
      if (result.ok) {
        console.log(result.ok);
        return result.json();
      }
      throw Error("Erreur de l'API");
    })

    .catch(function (erreur) {
      alert(erreur.message);
    });
}
