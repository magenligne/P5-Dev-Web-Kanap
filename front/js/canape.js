// Définition du plan de construction d'un objet de la classe "canape" à partir d'un objet json extrait du serveur via l'API

class canape {
    constructor(_id,name,colors,price,description,imageUrl,altTxt){
        this._id=_id;
        this.name=name;
        this.colors=colors;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this.altTxt=altTxt;
    }
}

// equivalent à:
// class canape{
//     constructor(jsonProduct){
//         jsonProduct && Object.assign(this, jsonProduct);
//     }
// }
