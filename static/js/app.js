// ============================================
// SHOP PARCEROS - JAVASCRIPT COMPLETO
// ============================================

const API_URL = 'http://127.0.0.1:8000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = localStorage.getItem('currentUser');
let cartItems = [];

// ============================================
// MAPEO DE ICONOS POR PRODUCTO
// ============================================
const productIcons = {
    'Laptop': 'fa-laptop',
    'MacBook': 'fa-laptop-code',
    'Mouse': 'fa-computer-mouse',
    'Teclado': 'fa-keyboard',
    'Monitor': 'fa-desktop',
    'SSD': 'fa-hard-drive',
    'Disco': 'fa-hdd',
    'Pendrive': 'fa-usb-drive',
    'Audífonos': 'fa-headphones',
    'Parlante': 'fa-volume-high',
    'Micrófono': 'fa-microphone',
    'Webcam': 'fa-video',
    'Consola': 'fa-gamepad',
    'Control': 'fa-gamepad',
    'Silla': 'fa-chair',
    'Hub': 'fa-plug',
    'Cable': 'fa-link',
    'Combo': 'fa-box'
};

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
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('checkoutBtn').addEventListener('click', showCheckout);
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
            
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();
            
            updateAuthUI();
            await loadCart();
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
            document.querySelector('[href="#loginTab"]').click();
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
// UTILIDADES
// ============================================
function getProductIcon(productName) {
    for (let [key, icon] of Object.entries(productIcons)) {
        if (productName.includes(key)) {
            return icon;
        }
    }
    return 'fa-box';
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(price);
}

function getProductCategory(productName) {
    const name = productName.toLowerCase();
    if (name.includes('laptop') || name.includes('macbook')) return 'laptop';
    if (name.includes('mouse') || name.includes('teclado') || name.includes('combo')) return 'periférico';
    if (name.includes('monitor')) return 'monitor';
    if (name.includes('audífonos') || name.includes('parlante') || name.includes('micrófono')) return 'audio';
    if (name.includes('consola') || name.includes('control') || name.includes('silla')) return 'gaming';
    return 'otro';
}

// ============================================
// PRODUCTOS
// ============================================
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        const products = await response.json();
        
        displayProducts(products);
        loadOffers(products);
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
    
    container.innerHTML = products.map(product => {
        const icon = getProductIcon(product.name);
        const category = getProductCategory(product.name);
        
        return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4 product-item" data-category="${category}">
            <div class="product-card-new">
                <div class="product-image-new">
                    <i class="fas ${icon}"></i>
                    ${product.stock < 10 ? '<div class="product-badge-low">¡Últimas unidades!</div>' : ''}
                </div>
                <div class="product-body-new">
                    <h5 class="product-title-new">${product.name}</h5>
                    <p class="product-description-new">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="product-price-new">${formatPrice(product.price)}</div>
                        <div class="product-stock-new">
                            <i class="fas fa-box"></i> ${product.stock}
                        </div>
                    </div>
                    <button class="btn btn-add-cart-new w-100" 
                        onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})" 
                        ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus me-2"></i> 
                        ${product.stock === 0 ? 'Sin Stock' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// ============================================
// OFERTAS
// ============================================
function loadOffers(products) {
    const container = document.getElementById('offersContainer');
    
    // Seleccionar 10 productos al azar para ofertas
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const offers = shuffled.slice(0, Math.min(10, products.length));
    
    container.innerHTML = offers.map(product => {
        const icon = getProductIcon(product.name);
        const originalPrice = parseFloat(product.price);
        const discount = Math.floor(Math.random() * 31) + 20; // 20-50% descuento
        const salePrice = Math.floor(originalPrice * (1 - discount / 100));
        
        return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="offer-card">
                <div class="offer-badge">${discount}% OFF</div>
                <div class="offer-image">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="offer-body">
                    <h5 class="offer-title">${product.name}</h5>
                    <p class="offer-description">${product.description}</p>
                    <div class="offer-prices">
                        <span class="offer-price-old">${formatPrice(originalPrice)}</span>
                        <span class="offer-price-new">${formatPrice(salePrice)}</span>
                    </div>
                    <div class="offer-stock mb-3">
                        <i class="fas fa-fire text-danger"></i> Solo ${product.stock} disponibles
                    </div>
                    <button class="btn btn-offer w-100" 
                        onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">
                        <i class="fas fa-bolt me-2"></i> ¡Comprar Ahora!
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// ============================================
// FILTROS
// ============================================
function filterProducts(category) {
    const items = document.querySelectorAll('.product-item');
    const buttons = document.querySelectorAll('.btn-filter');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.btn-filter').classList.add('active');
    
    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            if (item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        }
    });
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
            await loadCart();
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
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fs-1 text-muted mb-3"></i>
                <p class="fs-5 text-muted">Tu carrito está vacío</p>
            </div>
        `;
    } else {
        const total = cartItems.reduce((sum, item) => 
            sum + (parseFloat(item.product.price) * item.quantity), 0
        );
        
        cartContent.innerHTML = `
            ${cartItems.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.product.name}</h5>
                        <p class="mb-0 text-muted">Cantidad: ${item.quantity}</p>
                    </div>
                    <div class="text-end">
                        <div class="cart-item-price">${formatPrice(parseFloat(item.product.price) * item.quantity)}</div>
                        <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `).join('')}
            <div class="cart-total">
                <h4>Total: ${formatPrice(total)}</h4>
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
            await loadCart();
            
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (cartModal) {
                cartModal.hide();
            }
            
            setTimeout(() => {
                showCart();
            }, 300);
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
    
    document.getElementById('totalAmount').textContent = formatPrice(total);
    
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.hide();
    
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
            
            showAlert(`¡Pedido #${order.id} creado exitosamente! Total: ${formatPrice(parseFloat(order.total))}`, 'success');
            
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            if (checkoutModal) checkoutModal.hide();
            
            await loadCart();
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
// ALERTAS
// ============================================
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}