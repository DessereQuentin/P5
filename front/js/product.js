let str = window.location.href
let url = new URL(str);
let itemid = url.searchParams.get("id");

const itemURL = localStorage.getItem("serverURL") + "/" + itemid;
fetch(itemURL)
    .then(response => response.json())
    .then(data => {
        loadText(data)
        loadColors(data)
        loadPhoto(data)
    })




/** fonction generant le panier */
document.getElementById("addToCart").addEventListener("click", addPanier)


function addPanier() {
    let i;
    let found = false;
    let color = document.getElementById("colors").value
    let  quantity = document.getElementById("quantity").value
    if ((color == "") || (quantity == 0)) {
        window.alert("Veuillez renseigner tout les champs")
        return
    }
    if ((quantity > 100) || (quantity < 1)) {
        window.alert("Veuillez choisir une quantité entre 1 et 100")
        return
    }

    let panier = JSON.parse(localStorage.getItem("panier"))
    if (panier == null) {
        panier = [];
    }

    for (i = 0; i < panier.length; i++) {
        if ((itemid == panier[i][0]) && (color == panier[i][1])) {
            panier[i][2] = quantity
            found = true;
            break;
        }
    }
    if (found == false) {
       panier.push([itemid, color, quantity])
   
    }
    localStorage.setItem("panier", JSON.stringify(panier))
}



/* fonction generant, titre, description et prix*/
function loadText(produit) {

    const title = document.getElementById("title");
    title.innerHTML = produit.name;

    const description = document.getElementById("description");
    description.innerHTML = produit.description;


    document.getElementById("price").innerHTML = produit.price;

}

/* fonction generant le choix de couleurs*/
function loadColors(produit) {
    const colors = document.getElementById("colors");
    for (i = 0; i < produit.colors.length; i++) {
        elemoption = document.createElement("option")
        elemoption.innerHTML = produit.colors[i];
        colors.appendChild(elemoption)
    }
}
/* fonction generant la photo*/
function loadPhoto(produit) {
    const item__img = document.getElementsByClassName("item__img")[0];
    image = document.createElement("img")
    image.src = produit.imageUrl
    image.alt = produit.altTxt
    item__img.appendChild(image)
}




