// ============================================
// SHOP PARCEROS - JAVASCRIPT
// ============================================

const API_URL = 'http://127.0.0.1:8000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = localStorage.getItem('currentUser');
let cartItems = [];

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateAuthUI();
    setupEventListeners();
    
    if (authToken) {
        loadCart();
    }
});

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register Form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Cart Button
    document.getElementById('cartBtn').addEventListener('click', showCart);
    
    // Checkout Button
    document.getElementById('checkoutBtn').addEventListener('click', showCheckout);
    
    // Checkout Form
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

// ============================================
// AUTENTICACIÓN
// ============================================
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.access;
            currentUser = username;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', username);
            
            showAlert('¡Bienvenido ' + username + '!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            updateAuthUI();
            loadCart();
        } else {
            showAlert('Usuario o contraseña incorrectos', 'danger');
        }
    } catch (error) {
        showAlert('Error al iniciar sesión', 'danger');
        console.error(error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    
    if (password !== password2) {
        showAlert('Las contraseñas no coinciden', 'danger');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, password2 })
        });
        
        if (response.ok) {
            showAlert('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
            
            // Cambiar a la pestaña de login
            document.querySelector('[href="#loginTab"]').click();
            
            // Limpiar formulario
            document.getElementById('registerForm').reset();
        } else {
            const data = await response.json();
            showAlert(JSON.stringify(data), 'danger');
        }
    } catch (error) {
        showAlert('Error al registrarse', 'danger');
        console.error(error);
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    cartItems = [];
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    updateAuthUI();
    updateCartCount();
    
    showAlert('Sesión cerrada correctamente', 'info');
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const usernameSpan = document.getElementById('username');
    
    if (authToken && currentUser) {
        authSection.classList.add('d-none');
        userSection.classList.remove('d-none');
        usernameSpan.textContent = currentUser;
    } else {
        authSection.classList.remove('d-none');
        userSection.classList.add('d-none');
    }
}

// ============================================
// PRODUCTOS
// ============================================
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        const products = await response.json();
        
        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productsContainer').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Error al cargar productos</div></div>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No hay productos disponibles</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-lg-3">
            <div class="product-card">
                <div class="product-image">
                    <i class="fas fa-laptop"></i>
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    <div class="product-stock">
                        <i class="fas fa-box"></i> Stock: ${product.stock}
                    </div>
                    <button class="btn btn-add-cart w-100" onclick="addToCart(${product.id}, '${product.name}', ${product.price})" 
                        ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// CARRITO
// ============================================
async function addToCart(productId, productName, productPrice) {
    if (!authToken) {
        showAlert('Debes iniciar sesión para agregar productos', 'warning');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/cart/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        
        if (response.ok) {
            showAlert(`${productName} agregado al carrito`, 'success');
            loadCart();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Error al agregar al carrito', 'danger');
        }
    } catch (error) {
        showAlert('Error al agregar al carrito', 'danger');
        console.error(error);
    }
}

async function loadCart() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_URL}/cart/`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const cart = await response.json();
            cartItems = cart.items || [];
            updateCartCount();
        }
    } catch (error) {
        console.error('Error al cargar carrito:', error);
    }
}

function showCart() {
    if (!authToken) {
        showAlert('Debes iniciar sesión para ver el carrito', 'warning');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
        return;
    }
    
    const cartContent = document.getElementById('cartContent');
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
    } else {
        const total = cartItems.reduce((sum, item) => 
            sum + (parseFloat(item.product.price) * item.quantity), 0
        );
        
        cartContent.innerHTML = `
            ${cartItems.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.product.name}</h5>
                        <p class="mb-0">Cantidad: ${item.quantity}</p>
                    </div>
                    <div class="text-end">
                        <div class="cart-item-price">$${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</div>
                        <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `).join('')}
            <div class="cart-total">
                <h4>Total: $${total.toFixed(2)}</h4>
            </div>
        `;
    }
    
    new bootstrap.Modal(document.getElementById('cartModal')).show();
}

async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_URL}/cart/remove/${itemId}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            showAlert('Producto eliminado del carrito', 'success');
            loadCart();
            showCart();
        }
    } catch (error) {
        showAlert('Error al eliminar del carrito', 'danger');
        console.error(error);
    }
}

function updateCartCount() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// ============================================
// CHECKOUT
// ============================================
function showCheckout() {
    if (cartItems.length === 0) {
        showAlert('Tu carrito está vacío', 'warning');
        return;
    }
    
    const total = cartItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
    );
    
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    
    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const shippingAddress = document.getElementById('shippingAddress').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ shipping_address: shippingAddress })
        });
        
        if (response.ok) {
            const order = await response.json();
            
            showAlert(`¡Pedido #${order.id} creado exitosamente! Total: $${parseFloat(order.total).toFixed(2)}`, 'success');
            
            bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
            
            // Limpiar carrito
            cartItems = [];
            updateCartCount();
            
            // Limpiar formulario
            document.getElementById('checkoutForm').reset();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Error al crear pedido', 'danger');
        }
    } catch (error) {
        showAlert('Error al procesar el pedido', 'danger');
        console.error(error);
    }
}

// ============================================
// UTILIDADES
// ============================================
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}