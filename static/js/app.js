// ============================================
// SHOP PARCEROS - JAVASCRIPT CORREGIDO
// ============================================

const API_URL = 'https://shop-parceros-production.up.railway.app/api';
let authToken = localStorage.getItem('authToken');
let currentUser = localStorage.getItem('currentUser');
let cartItems = [];

// ============================================
// MAPEO DE IMÃGENES REALES POR PRODUCTO
// ============================================
const productImages = {
    'HP Pavilion': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
    'MacBook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    'Lenovo': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    'Dell': 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500',
    'ASUS': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    'Acer': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    'Mouse Logitech MX': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    'Teclado MecÃ¡nico': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
    'Mouse Gamer Razer': 'https://images.unsplash.com/photo-1610821672523-5d00ff6b0a8b?w=500',
    'Teclado Logitech K380': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    'Combo Teclado': 'https://images.unsplash.com/photo-1587302525834-1b9f06eb6d5a?w=500',
    'Mouse Pad': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
    'Webcam Logitech C920': 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=500',
    'Webcam 4K Razer': 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500',
    'Monitor Samsung': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    'Monitor LG': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500',
    'Monitor Gamer ASUS': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
    'Monitor Dell': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500',
    'SSD Kingston': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    'Disco Duro': 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500',
    'SSD Samsung': 'https://images.unsplash.com/photo-1551058622-6f90b2331738?w=500',
    'Pendrive': 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500',
    'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'HyperX Cloud': 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500',
    'JBL Flip': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    'MicrÃ³fono Blue Yeti': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
    'PlayStation 5': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
    'Control Xbox': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500',
    'Silla Gamer': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500',
    'Volante Logitech': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    'Hub USB-C': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    'Cable HDMI': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
};

// ============================================
// INICIALIZACIÃ“N
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
// AUTENTICACIÃ“N
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
            
            showAlert('Â¡Bienvenido ' + username + '!', 'success');
            
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();
            
            updateAuthUI();
            await loadCart();
        } else {
            showAlert('Usuario o contraseÃ±a incorrectos', 'danger');
        }
    } catch (error) {
        showAlert('Error al iniciar sesiÃ³n', 'danger');
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
        showAlert('Las contraseÃ±as no coinciden', 'danger');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, password2 })
        });
        
        if (response.ok) {
            showAlert('Â¡Registro exitoso! Ahora puedes iniciar sesiÃ³n', 'success');
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
    
    showAlert('SesiÃ³n cerrada correctamente', 'info');
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
function getProductImage(productName) {
    for (let [key, imageUrl] of Object.entries(productImages)) {
        if (productName.includes(key)) {
            return imageUrl;
        }
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
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
    if (name.includes('mouse') || name.includes('teclado') || name.includes('combo') || name.includes('webcam')) return 'perifÃ©rico';
    if (name.includes('monitor')) return 'monitor';
    if (name.includes('audÃ­fonos') || name.includes('parlante') || name.includes('micrÃ³fono')) return 'audio';
    if (name.includes('consola') || name.includes('control') || name.includes('silla') || name.includes('volante')) return 'gaming';
    return 'otro';
}

// ============================================
// PRODUCTOS - CORREGIDO PARA RESPUESTA PAGINADA
// ============================================
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        const data = await response.json();
        
        // Manejar respuesta paginada de Django REST Framework
        const products = data.results || data;
        
        if (!Array.isArray(products)) {
            console.error('La respuesta no es un array:', data);
            throw new Error('Formato de respuesta invÃ¡lido');
        }
        
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
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No hay productos disponibles</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const imageUrl = getProductImage(product.name);
        const category = getProductCategory(product.name);
        
        return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4 product-item" data-category="${category}">
            <div class="product-card-new">
                <div class="product-image-real" style="background-image: url('${imageUrl}');">
                    ${product.stock < 10 ? '<div class="product-badge-low">Â¡Ãšltimas unidades!</div>' : ''}
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
// OFERTAS - CORREGIDO
// ============================================
function loadOffers(products) {
    const container = document.getElementById('offersContainer');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center text-white">No hay ofertas disponibles</p></div>';
        return;
    }
    
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const offers = shuffled.slice(0, Math.min(10, products.length));
    
    container.innerHTML = offers.map(product => {
        const imageUrl = getProductImage(product.name);
        const originalPrice = parseFloat(product.price);
        const discount = Math.floor(Math.random() * 31) + 20;
        const salePrice = Math.floor(originalPrice * (1 - discount / 100));
        
        return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="offer-card">
                <div class="offer-badge">${discount}% OFF</div>
                <div class="offer-image-real" style="background-image: url('${imageUrl}');"></div>
                <div class="offer-body">
                    <h5 class="offer-title">${product.name}</h5>
                    <p class="offer-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="offer-prices">
                        <span class="offer-price-old">${formatPrice(originalPrice)}</span>
                        <span class="offer-price-new">${formatPrice(salePrice)}</span>
                    </div>
                    <div class="offer-stock mb-3">
                        <i class="fas fa-fire text-danger"></i> Solo ${product.stock} disponibles
                    </div>
                    <button class="btn btn-offer w-100" 
                        onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})"
                        ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-bolt me-2"></i> ${product.stock === 0 ? 'Agotado' : 'Â¡Comprar Ahora!'}
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
        showAlert('Debes iniciar sesiÃ³n para agregar productos', 'warning');
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
        showAlert('Debes iniciar sesiÃ³n para ver el carrito', 'warning');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
        return;
    }
    
    const cartContent = document.getElementById('cartContent');
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fs-1 text-muted mb-3"></i>
                <p class="fs-5 text-muted">Tu carrito estÃ¡ vacÃ­o</p>
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
        showAlert('Tu carrito estÃ¡ vacÃ­o', 'warning');
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
            
            showAlert(`Â¡Pedido #${order.id} creado exitosamente! Total: ${formatPrice(parseFloat(order.total))}`, 'success');
            
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