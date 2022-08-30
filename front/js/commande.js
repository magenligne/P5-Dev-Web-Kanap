//-------------------------------------------------------ECOUTE VERIFICATION ET RECUPERATION DANS LE LS DU FORMULAIRE
let formulaire = document.querySelector(".cart__order__form");
// console.log(formulaire.email.value);

formulaire.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    // console.log('coucou');

    //-------------------------------------------------------------------------TEST DU FORMULAIRE
    let validForm = true; //deviendra faux si un champ au moins est faux

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

    //-----------------------------------------------------------RECUPERATION DU FORMULAIRE DANS LE LS SI LE FORMULAIRE EST VALIDE 
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
      //on stocke l'objet monContact dans un item du localstorage:
      localStorage.setItem("contact", JSON.stringify(monContact)); //on sauve une version  txt de l'objet
      //dans le LS il y a un objet Panier et un objet contact.
    }
  },
  false
);

//CETTE FONCTION TESTE UN CHAMP.ELLE APPLIQUE LA REGEX SPECIALE SELON LE TYPE DE CHAMP ET RETOURNE TRUE OU FALSE SELON LA VALIDITE DU CHAMP TESTE
//ELLE AFFUCHE AUSSI UN MESSAGE D ERREUR SI LE CHAMP EST FAUX.
function validation(champ, saisie) {
  let valid; //deviendra faux si un champ est faux
  // console.log(champ.type);

  if (champ.type == "email") {
    let regExMail = /^[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}$/i;
    valid = regExMail.test(saisie);
    console.log(champ.name + " nest pas un txt");
  } else if (champ.type == "text") {
    let regExTxt = /^[a-z][a-z]+/i;
    valid = regExTxt.test(saisie);
    // console.log(valid);
    // return result;
  }

  console.log(valid); //ok
  let messageErreur = champ.nextElementSibling;
  // console.log(champ.nextElementSibling);

  if (valid == false) {
    messageErreur.innerHTML = `Saisie invalide.`;
    if ((champ.type = "text")) {
      messageErreur.innerHTML += `Les champs Prénom à Ville ne doivent contenir que des lettres.`;
    } else if ((champ.type = "email")) {
      messageErreur.innerHTML += `Le champ Email doit être de type: caractères@caractères.caractères`;
    }

    console.log(saisie + "n'est pas valide");
    return valid; //NE MARCHE PAS...
  } else {
    console.log(saisie + "est valide");
    return valid;
  }
}

//FONCTION QUI POSTE UN OBJET CONTACT ET UN TABLEAU DE ID/QTE/COULEUR A L API et recupere un numero de commande
function recupNcommande(contact,panier){
    
}
