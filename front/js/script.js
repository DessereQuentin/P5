const serverURL="http://localhost:3000/api/products"
localStorage.setItem("serverURL","http://localhost:3000/api/products")


 fetch(serverURL)
.then(response => response.json())
.then(data =>{
    loadItems(data);
  })
 


function loadItems(listOfItems){
 
    const items = document.getElementById("items");
 
    for (let i=0; i< listOfItems.length; i++) {
        loadOneItem(items, listOfItems[i]);
    }
}
 
function loadOneItem(items, item){
 
   lien = document.createElement("a")
   lien.href="./product.html?id=" + item._id;
   items.appendChild(lien);
   article = document.createElement("article")
   lien.appendChild(article)
   e = document.createElement("img")
   e.src = item.imageUrl
   e.alt = item.altTxt
   article.appendChild(e)
   e = document.createElement("h3")
   e.classList.add("ProductName");
    e.innerHTML = item.name;
   article.appendChild(e)
   e = document.createElement("p")
    e.innerHTML = item.description;
   article.appendChild(e)

   
}
    


 


  

