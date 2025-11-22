// script.js - VERSIÓN CORREGIDA CON PAYPAL

// Datos de los VIP
const vipData = {
    vip: {
        title: 'VIP',
        price: '$19.99',
        color: '#8b3a9f',
        benefits: [
            'Acceso a áreas exclusivas del servidor',
            'Soporte prioritario en Discord',
            'Tag VIP personalizado en el servidor',
            'Acceso a eventos especiales semanales',
            'Kit de inicio VIP',
            'Reducción de cooldown en comandos'
        ],
        features: [
            '30 días de acceso VIP',
            'Renovación automática opcional',
            'Acceso inmediato tras la compra',
            'Soporte técnico 24/7',
            'Sin compromiso de permanencia'
        ]
    },
    gold: {
        title: 'VIP GOLD',
        price: '$39.99',
        color: '#ff8c00',
        benefits: [
            'Todos los beneficios del VIP estándar',
            'Acceso anticipado a nuevas características',
            'Tag VIP GOLD con efectos especiales',
            'Descuentos del 20% en la tienda del servidor',
            'Regalo mensual exclusivo',
            'Kit de inicio VIP GOLD mejorado',
            'Prioridad máxima en el servidor',
            'Comandos exclusivos VIP GOLD'
        ],
        features: [
            '30 días de acceso VIP GOLD',
            'Skin exclusiva para el juego',
            'Doble de recursos en kits',
            'Acceso a zona VIP GOLD',
            'Participación en sorteos exclusivos',
            'Insignia especial en el perfil'
        ]
    },
    diamond: {
        title: 'VIP DIAMOND',
        price: '$79.99',
        color: '#00bcd4',
        benefits: [
            'Todos los beneficios VIP GOLD',
            'Acceso completo a todo el contenido premium',
            'Tag VIP DIAMOND con animaciones únicas',
            'Soporte VIP 24/7 con respuesta inmediata',
            'Regalos exclusivos cada semana',
            'Invitación a eventos privados con admins',
            'Personalización avanzada del perfil',
            'Comandos administrativos limitados'
        ],
        features: [
            '30 días de acceso VIP DIAMOND',
            'Skins exclusivas coleccionables',
            'Triple de recursos en todos los kits',
            'Zona VIP DIAMOND privada',
            'Acceso beta a nuevas características',
            'Sorteos exclusivos con premios mayores',
            'Rol especial en Discord',
            'Influencia en futuras actualizaciones'
        ]
    }
};

let currentVIP = null;

// Mostrar detalles del VIP seleccionado
function showVIPDetails(vipType) {
    currentVIP = vipType;
    const vip = vipData[vipType];
    
    console.log('📋 Mostrando detalles de:', vipType);
    
    // Actualizar contenido
    document.getElementById('vip-title').textContent = vip.title;
    document.getElementById('vip-title').style.color = vip.color;
    document.getElementById('vip-price').textContent = vip.price;
    
    // Actualizar beneficios
    const benefitsList = document.getElementById('vip-benefits-detail');
    benefitsList.innerHTML = '';
    vip.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
    
    // Actualizar características
    const featuresList = document.getElementById('vip-features');
    featuresList.innerHTML = '';
    vip.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Actualizar botón
    const btn = document.getElementById('purchase-btn');
    btn.style.background = `linear-gradient(135deg, ${vip.color}, ${adjustColor(vip.color, 20)})`;
    
    // Cambiar página
    showPage('vip-details');
}

// Mostrar checkout
function showCheckout() {
    if (!currentVIP) {
        console.error('❌ No hay VIP seleccionado');
        alert('Error: No se ha seleccionado ningún VIP');
        return;
    }
    
    console.log('💳 Mostrando checkout para:', currentVIP);
    
    const vip = vipData[currentVIP];
    document.getElementById('summary-product').textContent = vip.title;
    document.getElementById('summary-price').textContent = vip.price;
    document.getElementById('summary-total').textContent = vip.price;
    
    // Cambiar a página de checkout
    showPage('checkout-page');
    
    // CRÍTICO: Inicializar PayPal después de mostrar la página
    setTimeout(() => {
        console.log('🔄 Inicializando botón de PayPal...');
        
        // Verificar que la función existe
        if (typeof initializePayPal === 'function') {
            initializePayPal(currentVIP);
        } else {
            console.error('❌ ERROR: initializePayPal no está definida');
            console.log('Verifica que paypal.js se haya cargado correctamente');
            
            // Mostrar error al usuario
            const container = document.getElementById('paypal-button-container');
            if (container) {
                container.innerHTML = `
                    <div style="background: #ff5252; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <strong>⚠️ Error al cargar PayPal</strong><br>
                        Por favor recarga la página e intenta nuevamente.<br>
                        Si el problema persiste, contacta soporte.
                    </div>
                `;
            }
        }
    }, 300); // Pequeño delay para asegurar que el DOM está listo
}

// Volver a la página principal
function showMainPage() {
    console.log('🏠 Volviendo a página principal');
    showPage('main-page');
    currentVIP = null;
}

// Volver a detalles desde checkout
function showVIPDetailsBack() {
    if (currentVIP) {
        console.log('⬅️ Volviendo a detalles de:', currentVIP);
        showPage('vip-details');
    } else {
        showMainPage();
    }
}

// Cambiar entre páginas
function showPage(pageId) {
    console.log('📄 Cambiando a página:', pageId);
    
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar página seleccionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error('❌ Página no encontrada:', pageId);
    }
    
    // Scroll al inicio
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Completar compra (para métodos que NO sean PayPal)
function completePurchase() {
    console.log('🔄 Intentando completar compra...');
    
    // Validar formulario
    const steamId = document.getElementById('steam-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const terms = document.getElementById('terms').checked;
    
    if (!steamId || !email || !name) {
        alert('❌ Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    if (!terms) {
        alert('❌ Debes aceptar los términos y condiciones.');
        return;
    }
    
    // Obtener método de pago
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Si el método es PayPal, redirigir al botón
    if (paymentMethod === 'paypal') {
        alert('⚠️ Por favor, utiliza el botón amarillo de PayPal arriba para completar tu compra de forma segura.');
        
        // Hacer scroll al botón de PayPal
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) {
            paypalContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Resaltar el botón
            paypalContainer.style.animation = 'pulse 1s ease-in-out 3';
        }
        return;
    }
    
    // Para otros métodos de pago (tarjeta, crypto)
    const btn = document.querySelector('.btn-purchase');
    const originalText = btn.textContent;
    btn.textContent = 'Procesando...';
    btn.disabled = true;
    
    console.log('💳 Procesando compra con método:', paymentMethod);
    
    // Simular delay de procesamiento
    setTimeout(() => {
        console.log('✅ Compra procesada (simulada):', {
            vip: currentVIP,
            steamId,
            email,
            name,
            paymentMethod
        });
        
        alert('⚠️ Este método de pago aún no está disponible.\n\nPor favor usa PayPal para completar tu compra.');
        
        // Resetear botón
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

// Mostrar confirmación
function showConfirmation() {
    console.log('✅ Mostrando confirmación de compra');
    document.getElementById('confirmation-modal').classList.add('active');
}

// Cerrar modal
function closeModal() {
    console.log('❌ Cerrando modal');
    document.getElementById('confirmation-modal').classList.remove('active');
    showMainPage();
}

// Función auxiliar para ajustar color
function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// Efectos visuales adicionales
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎮 SAGA RUST VIP SYSTEM', 'background: #d85c3a; color: white; font-size: 18px; padding: 10px; font-weight: bold;');
    console.log('✅ Frontend cargado correctamente');
    
    // Verificar que PayPal SDK está cargado
    if (typeof paypal !== 'undefined') {
        console.log('✅ PayPal SDK cargado');
    } else {
        console.warn('⚠️ PayPal SDK no detectado (se cargará cuando sea necesario)');
    }
    
    // Animación de entrada para las cards
    const cards = document.querySelectorAll('.vip-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
    
    // Partículas de fondo (opcional)
    createParticles();
    
    // Agregar animación de pulso para botones PayPal
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7);
            }
            50% { 
                transform: scale(1.05); 
                box-shadow: 0 0 20px 10px rgba(255, 140, 0, 0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Crear efecto de partículas sutiles
function createParticles() {
    const container = document.body;
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'rgba(255, 140, 0, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '0';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = 15 + Math.random() * 15;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        container.appendChild(particle);
        
        animateParticle(particle, duration);
    }
}

function animateParticle(particle, duration) {
    const startY = parseFloat(particle.style.top);
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / (duration * 1000);
        
        if (progress < 1) {
            particle.style.top = (startY - progress * 150) + 'px';
            particle.style.opacity = 1 - progress;
            requestAnimationFrame(animate);
        } else {
            particle.style.top = startY + 'px';
            particle.style.opacity = 0.3;
            start = null;
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('confirmation-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Prevenir envío del formulario con Enter
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billing-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('⚠️ Formulario submit bloqueado - usa el botón de PayPal');
        });
    }
});