class Product {
    constructor(title, price, id, image) {
        this.title = title
        this.price = price
        this.id = id
        this.image = image
    }
}

class Cart {
    constructor() {
        this.products = []
        this.total = 0
    }

    addProduct(product) {
        this.products.push(product)
    }

    calculateTotal() {
        this.total = 0
        this.products.forEach((product) => {
            this.total += product.price
        })
    }

    showCart() {
        let textCart = "Carrito 🛒:\n\n"
        this.products.forEach((product) => {
            textCart += product.title + " - $" + product.price + "\n"
        })
        textCart += "\n Su total es: $" + this.total
        alert(textCart)
    }

    clearCart() {
        this.products = []
        this.total = 0
        this.showCart()
        saveCartToLocalStorage()
    }
}

const URLremota = "https://64b2df7c38e74e386d55ac04.mockapi.io/Productos"

let cart = new Cart()
let productsData

function generateProductHTML(product) {
    return `
        <div class="col-md-4">
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body product-details">
                    <h5 class="card-title product-title">${product.title}</h5>
                    <p class="card-text product-price">Precio: $${product.price}</p>
                    <button class="btn btn-primary product-button" id="addToCartBtn">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `
}

async function loadProducts() {
    const productContainer = document.getElementById('product-container')
    try {
      productsData = await fetchProducts()
      productsData.forEach((productData) => {
        const { title, price, id, image } = productData
        const product = new Product(title, price, id, image)
        const productHTML = generateProductHTML(product)
        productContainer.innerHTML += productHTML
      })
      setupAddToCartButtons()
    } catch (error) {
      console.error('Error loading products:', error)
    }
}
  

function addToCart(productToAdd) {
    cart.addProduct(productToAdd)
    cart.calculateTotal()
    cart.showCart()
    saveCartToLocalStorage()
}

function setupAddToCartButtons() {
    const addToCartBtns = document.querySelectorAll('.btn.btn-primary.product-button')
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const productToAdd = productsData[index]
            addToCart(productToAdd)
        })
    })
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart.products))
}

function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
        const savedCart = JSON.parse(cartData)
        savedCart.forEach((productData) => {
            const { title, price, id, image } = productData
            const product = new Product(title, price, id, image)
            cart.addProduct(product)
        })
        cart.calculateTotal()
    }
}

function displayErrorCard(message) {
    const errorHTML = `
      <div class="card-error">
        <h3>🔍 ${message}</h3>
      </div>
    `
    const productContainer = document.getElementById('product-container')
    productContainer.innerHTML = errorHTML
}

async function fetchProducts() {
    try {
      const response = await fetch(URLremota)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      displayErrorCard('No se pudo cargar la página. Por favor, inténtelo nuevamente más tarde...')
      return []
    }
} 

document.getElementById("cart-button").addEventListener("click", function() {
    cart.showCart()
})
document.getElementById("clear-cart-button").addEventListener("click", function() {
    cart.clearCart()
})

loadProducts()
setupAddToCartButtons()
loadCartFromLocalStorage()
