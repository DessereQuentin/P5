let prixTotal = 0;
let quantiteTotal = 0;
let contact;
let panier = JSON.parse(localStorage.getItem("panier"))
let reg1 = /^[A-Z][A-Za-z\é\è\ê\-]+$/
let reg2 = /^[a-zA-Z0-9\s\,\''\-]*$/
let reg3 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const serverURL = localStorage.getItem("serverURL")




fetch(serverURL)
  .then(response => response.json())
  .then(data => {
    afficherPanier(data)
  })

document.getElementsByClassName("cart__order__form")[0].addEventListener("submit", orderProduct)
/**document.getElementById("order").addEventListener("click", orderProduct)*/

function afficherPanier(produit) {

  const cart__items = document.getElementById("cart__items");
  var i
  var j

  for (j = 0; j < panier.length; j++) {

    var idkanap = panier[j][0]
    for (i = 0; i < produit.length; i++) {
      if (idkanap == produit[i]._id) {
        createCartItems(panier[j], produit[i])
      }
    }
  }
}

function createCartItems(cartitem, produititem) {

  article = document.createElement("article")
  article.classList.add("cart__item");
  article.setAttribute("data-id", cartitem[0])
  article.setAttribute("data-color", cartitem[1])
  cart__items.appendChild(article)

  cart__item__img = document.createElement("div")
  cart__item__img.classList.add("cart__item__img");
  article.appendChild(cart__item__img)

  e = document.createElement("img")
  e.src = produititem.imageUrl
  e.alt = "kanapé"
  cart__item__img.appendChild(e)

  cart__item__content = document.createElement("div")
  cart__item__content.classList.add("cart__item__content");
  article.appendChild(cart__item__content)

  cart__item__content__description = document.createElement("div")
  cart__item__content__description.classList.add("cart__item__content__description");
  cart__item__content.appendChild(cart__item__content__description)

  title = document.createElement("h2")
  title.innerHTML = produititem.name;
  cart__item__content__description.appendChild(title)

  color = document.createElement("p")
  color.innerHTML = cartitem[1]
  cart__item__content__description.appendChild(color)

  price = document.createElement("p")
  price.innerHTML = produititem.price + "€";
  cart__item__content__description.appendChild(price)

  cart__item__content__settings = document.createElement("div")
  cart__item__content__settings.classList.add("cart__item__content__settings")
  cart__item__content.appendChild(cart__item__content__settings)

  cart__item__content__settings__quantity = document.createElement("div")
  cart__item__content__settings__quantity.classList.add("cart__item__content__settings__quantity")
  cart__item__content__settings.appendChild(cart__item__content__settings__quantity)

  Qte = document.createElement("p")
  Qte.innerHTML = "Qté : "
  cart__item__content__settings__quantity.appendChild(Qte)

  itemQuantity = document.createElement("input")
  itemQuantity.type = "number";
  itemQuantity.classList.add("itemQuantity")
  itemQuantity.name = "itemQuantity";
  itemQuantity.min = 1
  itemQuantity.max = 100
  itemQuantity.value = cartitem[2]
  cart__item__content__settings__quantity.appendChild(itemQuantity)
  itemQuantity.addEventListener("change", setQuantity)


  cart__item__content__settings__delete = document.createElement("div")
  cart__item__content__settings__delete.classList.add("cart__item__content__settings__delete")
  cart__item__content__settings.appendChild(cart__item__content__settings__delete)

  deleteItems = document.createElement("p")
  deleteItems.classList.add("deleteItem")
  deleteItems.innerHTML = "Supprimer "
  cart__item__content__settings__delete.appendChild(deleteItems)
  deleteItems.addEventListener("click", deleteItem)

  prixTotal += produititem.price * cartitem[2]
  document.getElementById("totalPrice").innerHTML = prixTotal

  quantiteTotal = quantiteTotal + parseInt(itemQuantity.value)
  document.getElementById("totalQuantity").innerHTML = quantiteTotal
}

function setQuantity() {
  let article = this.closest(".cart__item")
  let cart__content = this.closest(".cart__item__content")
  let p = cart__content.childNodes[0].lastChild.innerHTML
  console.log(p)
  const price = p.substring(0, p.length - 1);
  console.log(price)
  let articleId = article.dataset.id
  let articleColor = article.dataset.color
  for (var i = 0; i < panier.length; i++) {
    if ((articleId == panier[i][0]) && (articleColor == panier[i][1])) {
      /**  quantiteTotal = quantiteTotal - panier[i][2] + parseInt(this.value)
       prixTotal = prixTotal + price * (parseInt(this.value) - panier[i][2])
       console.log(prixTotal)
       document.getElementById("totalQuantity").innerHTML = quantiteTotal
       document.getElementById("totalPrice").innerHTML = prixTotal*/
      panier[i][2] = this.value
      localStorage.setItem("panier", JSON.stringify(panier))
      window.location.reload();
    }
  }
}

function deleteItem() {
  let article = this.closest(".cart__item")
  let articleId = article.dataset.id
  let articleColor = article.dataset.color

  for (var i = 0; i < panier.length; i++) {
    if ((articleId == panier[i][0]) && (articleColor == panier[i][1])) {
      panier.splice(i, 1)
      localStorage.setItem("panier", JSON.stringify(panier))
      window.location.reload();
    }
  }
}

async function orderProduct(event) {
  event.preventDefault();
  getContact()
  console.log(getContact())

  if (getContact() == true) {
    let products = [];
    for (i = 0; i < panier.length; i++) { products.push(panier[i][0]) }
    console.log(products)


    let body = { contact: contact, products: products }
    console.log(JSON.stringify(body))
    let promise = await fetch(
      serverURL + "/order",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" }
      }
    )

      .then(response => response.json())
      .then(response => window.location = "confirmation.html?orderId=" + (response.orderId))

  }
}

function getContact() {
  let orderAllow ;
  let firstName = document.getElementById("firstName").value
  if (reg1.test(firstName) == false) {
    document.getElementById("firstNameErrorMsg").innerHTML = "caractères autorisés: Majuscules, minuscules, tirets, e avec accent";
  } else { document.getElementById("firstNameErrorMsg").innerHTML = "" }

  let lastName = document.getElementById("lastName").value
  if (reg1.test(lastName) == false) {
    document.getElementById("lastNameErrorMsg").innerHTML = "caractères autorisés: Majuscules, minuscules, tirets, e avec accent"
  } else { document.getElementById("lastNameErrorMsg").innerHTML = "" }

  let address = document.getElementById("address").value
  if (reg2.test(address) == false) {
    document.getElementById("addressErrorMsg").innerHTML = "caractères autorisés: Majuscules, minuscules, chiffres, tirets, e avec accent"
  } else { document.getElementById("addressErrorMsg").innerHTML = "" }

  let city = document.getElementById("city").value
  if (reg1.test(city) == false) {
    document.getElementById("cityErrorMsg").innerHTML = "caractères autorisés, Majuscules, minuscules, tirets, e avec accent"
  } else { document.getElementById("cityErrorMsg").innerHTML = "" }

  let email = document.getElementById("email").value
  if (reg3.test(email) == false) {
    document.getElementById("emailErrorMsg").innerHTML = "Mauvais format d'e-mail"
  } else { document.getElementById("emailErrorMsg").innerHTML = "" }

  if ((reg1.test(firstName)) && (reg1.test(lastName)) && (reg2.test(address)) && (reg1.test(city)) && (reg3.test(email)) == true) {
    contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    }

    orderAllow = true; 
  }
return orderAllow;
}