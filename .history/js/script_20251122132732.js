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
    if (!currentVIP) return;
    
    const vip = vipData[currentVIP];
    document.getElementById('summary-product').textContent = vip.title;
    document.getElementById('summary-price').textContent = vip.price;
    document.getElementById('summary-total').textContent = vip.price;
    
    showPage('checkout-page');
}

// Volver a la página principal
function showMainPage() {
    showPage('main-page');
    currentVIP = null;
}

// Volver a detalles desde checkout
function showVIPDetailsBack() {
    if (currentVIP) {
        showPage('vip-details');
    } else {
        showMainPage();
    }
}

// Cambiar entre páginas
function showPage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar página seleccionada
    document.getElementById(pageId).classList.add('active');
    
    // Scroll al inicio
    window.scrollTo(0, 0);
}

// Completar compra
function completePurchase() {
    // Validar formulario
    const steamId = document.getElementById('steam-id').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const terms = document.getElementById('terms').checked;
    
    if (!steamId || !email || !name) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    if (!terms) {
        alert('Debes aceptar los términos y condiciones.');
        return;
    }
    
    // Obtener método de pago
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Si el método es PayPal, usar el botón de PayPal
    if (paymentMethod === 'paypal') {
        alert('Por favor, utiliza el botón de PayPal para completar tu compra de forma segura.');
        return;
    }
    
    // Para otros métodos de pago, procesar manualmente
    const btn = document.querySelector('.btn-purchase');
    const originalText = btn.textContent;
    btn.textContent = 'Procesando...';
    btn.disabled = true;
    
    // Simular delay de procesamiento
    setTimeout(() => {
        console.log('Compra procesada:', {
            vip: currentVIP,
            steamId,
            email,
            name,
            paymentMethod
        });
        
        // Mostrar modal de éxito
        showConfirmation();
        
        // Resetear botón
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Limpiar formulario
        document.getElementById('billing-form').reset();
    }, 2000);
}

// Mostrar confirmación
function showConfirmation() {
    document.getElementById('confirmation-modal').classList.add('active');
}

// Cerrar modal
function closeModal() {
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
    // Animación de entrada para las cards
    const cards = document.querySelectorAll('.vip-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Partículas de fondo (opcional)
    createParticles();
});

// Crear efecto de partículas sutiles
function createParticles() {
    const container = document.body;
    const particleCount = 20;
    
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
        const duration = 10 + Math.random() * 20;
        
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
            particle.style.top = (startY - progress * 100) + 'px';
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