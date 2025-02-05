const url = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json";
const cartSection = document.querySelector(".cart-section");
let products = [];


// Function to generate cart summary and items
function generateCart(cartProducts) {
    cartSection.innerHTML=null
    
    const cartLeft = document.createElement("div");
    cartLeft.classList.add("cart-left");
  
    const cartSummary = document.createElement("div");
    cartSummary.classList.add("cart-summary");
  
    const productLabel = document.createElement("span");
    productLabel.textContent = "Product";
    cartSummary.appendChild(productLabel);
  
    const priceLabel = document.createElement("span");
    priceLabel.textContent = "Price";
    cartSummary.appendChild(priceLabel);
  
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = "Quantity";
    cartSummary.appendChild(quantityLabel);
  
    const subtotalLabel = document.createElement("span");
    subtotalLabel.textContent = "Subtotal";
    cartSummary.appendChild(subtotalLabel);
  
    const removeColumn = document.createElement("span");
    removeColumn.classList.add("cart-column", "remove");
    cartSummary.appendChild(removeColumn);
  
    cartLeft.appendChild(cartSummary);
  
    cartProducts.forEach((product,index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
  

      const cartProduct = document.createElement("div");
      cartProduct.classList.add("cart-product");
  

      const productImg = document.createElement("img");
      productImg.src = product.image; 
      productImg.alt = "Product";
      productImg.classList.add("product-image");
      cartProduct.appendChild(productImg);
  
      const productName = document.createElement("span");
      productName.classList.add("product-name");
      productName.textContent = product.title;
      cartProduct.appendChild(productName);
  
      cartItem.appendChild(cartProduct);
  
      
      const cartPrice = document.createElement("span");
      cartPrice.classList.add("cart-price");
      cartPrice.textContent = `₹${product.price}`; 
      cartItem.appendChild(cartPrice);
  
      
      const cartQuantity = document.createElement("input");
      cartQuantity.type = "number";
      cartQuantity.classList.add("cart-quantity");
      cartQuantity.value = product.quantity; 
      cartQuantity.min = "1";
      cartItem.appendChild(cartQuantity);
      cartQuantity.addEventListener("change",(e)=>{
       
       changeQuantity(index,e,products);
      })
  
      
      const cartSubtotal = document.createElement("span");
      cartSubtotal.classList.add("cart-subtotal");
      cartSubtotal.textContent = `₹${(product.price * product.quantity).toFixed(2)}`; 
      cartItem.appendChild(cartSubtotal);
  
     
      const cartRemove = document.createElement("img");
      cartRemove.classList.add("cart-remove");
      cartRemove.src = "./asset/trash.png"; 
      cartRemove.alt = "remove";
      cartRemove.addEventListener("click",(e)=>{
        products = products.filter((product,i)=>i!=index)
        localStorage.setItem("cart",JSON.stringify(products));
        generateCart(products);
        
      })
      cartItem.appendChild(cartRemove);
  
      cartLeft.appendChild(cartItem);
    });
  
    
    cartSection.appendChild(cartLeft); 
    generateCartTotals(products);
  }
    
  const changeQuantity = (index,e,products)=>{
    console.log("hi")
    products[index]["quantity"]= Number(e.target.value);
    products[index]["final_price"]= products[index]["quantity"] * products[index]["price"] ;
    localStorage.setItem("cart",JSON.stringify(products))
    generateCart(products);
  }

function generateCartTotals(cartProducts) {
    
    let subtotal = 0;
    let total = 0;

    cartProducts.forEach(product => {
        subtotal += product.final_price; 
        total += product.final_price; 
    });

    
    subtotal = (subtotal / 100).toFixed(2);
    total = (total / 100).toFixed(2);


    const cartRight = document.createElement("div");
    cartRight.classList.add("cart-right");

    
    const cartHeading = document.createElement("h2");
    cartHeading.classList.add("cart-heading");
    cartHeading.textContent = "Cart Totals";
    cartRight.appendChild(cartHeading);

    
    const cartTotal = document.createElement("div");
    cartTotal.classList.add("cart-total");


    const subtotalDiv = document.createElement("div");
    const subtotalLabel = document.createElement("h3");
    subtotalLabel.textContent = "Subtotal";
    const subtotalValue = document.createElement("p");
    subtotalValue.textContent = `₹${subtotal}`;
    subtotalValue.classList.add("sub-total-value")
    subtotalDiv.appendChild(subtotalLabel);
    subtotalDiv.appendChild(subtotalValue);
    cartTotal.appendChild(subtotalDiv);

    // Total
    const totalDiv = document.createElement("div");
    const totalLabel = document.createElement("h3");
    totalLabel.textContent = "Total";
    totalLabel.classList.add("total-label")
    const totalValue = document.createElement("p");
    totalValue.textContent = `₹${total}`;
    totalValue.classList.add("total-value")
    totalDiv.appendChild(totalLabel);
    totalDiv.appendChild(totalValue);
    cartTotal.appendChild(totalDiv);

    
    cartRight.appendChild(cartTotal);

    
    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.textContent = "Proceed to Checkout";
    cartRight.appendChild(checkoutBtn);

    
    cartSection.appendChild(cartRight);
}



const fetchProducts = async()=>{
   try {
       const response = await fetch(url);
       products = await response.json()
       products = products.items
    localStorage.setItem("cart",JSON.stringify(products))
    
   } catch (error) {
    console.error(error)
   }
    
}




window.addEventListener("DOMContentLoaded",async (e)=>{
    products = JSON.parse(localStorage.getItem("cart"));
    if(!products || !products.length)
        await fetchProducts();
    generateCart(products)

})


