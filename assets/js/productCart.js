/**
 * PRODUCT CART.JS
 * 
 * Maneja la interacción de agregar productos al carrito
 * desde los checkboxes de las tarjetas de productos
 */

import { addToCart, removeFromCart, getCart } from './cart.js';
import { normalizeImgPath } from './utils.js';

// Export a helper to initialize cart checkboxes and observer from other modules
export function initCart() {
    // Initialize existing checkboxes
    initializeCartCheckboxes();
    // Set up observer for dynamic additions (e.g., after search renders)
    const observer = new MutationObserver(() => {
        initializeCartCheckboxes();
    });

    // Observe all possible product containers
    const containers = [
        document.querySelector('.productos-contenedor'),
        document.getElementById('search-results-container'),
        document.getElementById('featured-products-container') // Added for index page
    ].filter(Boolean); // Remove null values

    containers.forEach(container => {
        observer.observe(container, { childList: true, subtree: true });
    });
}

/**
 * Inicializar event listeners para checkboxes
 */
function startCartLogic() {
    initializeCartCheckboxes();

    // Escuchar cuando se agregan productos dinámicos
    const observer = new MutationObserver(() => {
        initializeCartCheckboxes();
    });

    // Observe all possible product containers
    const containers = [
        document.querySelector('.productos-contenedor'),
        document.getElementById('search-results-container'),
        document.getElementById('featured-products-container')
    ].filter(Boolean);

    containers.forEach(container => {
        observer.observe(container, { childList: true, subtree: true });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCartLogic);
} else {
    startCartLogic();
}

/**
 * Inicializar checkboxes de productos
 */
function initializeCartCheckboxes() {
    const checkboxes = document.querySelectorAll('.add-to-cart-checkbox');

    checkboxes.forEach(checkbox => {
        // Evitar agregar múltiples listeners
        if (checkbox.dataset.initialized) return;
        checkbox.dataset.initialized = 'true';

        const productCard = checkbox.closest('.producto');
        if (!productCard) return;

        // Verificar si el producto ya está en el carrito
        const productId = productCard.dataset.id;
        if (isProductInCart(productId)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (e) => {
            handleCheckboxChange(e, productCard);
        });

        // Hacer que toda la tarjeta sea cliqueable (opcional, mejora UX)
        productCard.style.cursor = 'pointer';
        productCard.addEventListener('click', (e) => {
            // Si el click fue en el checkbox o en el label, dejar que el evento 'change' lo maneje
            if (e.target.closest('label') || e.target.classList.contains('add-to-cart-checkbox')) {
                return;
            }

            // Simular click en el checkbox para activar el cambio
            checkbox.checked = !checkbox.checked;
            handleCheckboxChange({ target: checkbox }, productCard);
        });
    });
}

/**
 * Manejar cambio en checkbox
 */
function handleCheckboxChange(event, productCard) {
    const checkbox = event.target;
    const product = extractProductData(productCard);

    if (checkbox.checked) {
        // Agregar al carrito
        addToCart(product);
        showNotification(`✅ ${product.name} agregado al carrito`);
    } else {
        // Remover del carrito
        removeFromCart(product.id);
        showNotification(`❌ ${product.name} eliminado del carrito`);
    }
}



/**
 * Extraer datos del producto desde la tarjeta
 */
function extractProductData(productCard) {
    return {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        image: normalizeImgPath(productCard.dataset.image),
        brand: productCard.dataset.brand
    };
}

/**
 * Verificar si un producto está en el carrito
 */
function isProductInCart(productId) {
    const cart = getCart();
    return cart.items.some(item => item.id === productId);
}

/**
 * Mostrar notificación temporal
 */
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 10);

    // Ocultar y remover después de 2 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
