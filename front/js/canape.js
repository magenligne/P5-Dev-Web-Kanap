// Définition du plan de construction d'un objet de la classe "canape" à partir d'un objet json extrait du serveur via l'API

// class canape {
//     // constructor(_id,name,colors,price,description,imageUrl,altTxt){
//         constructor(productJson){
//         this._id=_id;
//         this.name=name;
//         this.colors=colors;
//         this.price=price;
//         this.description=description;
//         this.imageUrl=imageUrl;
//         this.altTxt=altTxt;
//     }
// }

// equivalent à:
class canape{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}
// la methode Object.assign permet d'assigner toutes les propriétés de l'objet json jsonProduct renvoyé par l'api à "this" qui représente 
// l'instance de la classe canape, qui est un objet canape, que l'on viendra de créer en utilisant ce constructeur (sans écraser 
// utilisation de &&: si jsonProduct est vrai, i.e ??, le résultat sera l'expression à droite de && (dans quel cas serait-il faux??).