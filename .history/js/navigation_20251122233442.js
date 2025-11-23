// navigation.js - Sistema de navegación con BENEFICIOS REALES de Saga Rust

// Datos de configuración de VIPs
const vipData = {
    vip: {
        title: 'VIP (Básico)',
        price: '$19.99',
        priceValue: 19.99,
        color: '#8b3a9f',
        benefits: [
            'Puedes guardar más puntos de casa con /sethome',
            'Tienes más usos diarios del /home para volver a tu base',
            'El teletransporte tarda menos en completarse',
            'El tiempo para volver a usar /home es más corto',
            'Acceso a /skin, tag VIP y rol en Discord',
            'Incluye un kit VIP'
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
        priceValue: 39.99,
        color: '#ff8c00',
        benefits: [
            'Todo lo del VIP, pero mejorado',
            'Más puntos de casa guardados',
            'Más usos diarios del /home',
            'Teletransporte más rápido',
            'Menor tiempo para volver a usarlo',
            'Acceso a /skin, tag GOLD y beneficios ampliados',
            'Kit mejorado'
        ],
        features: [
            '30 días de acceso VIP GOLD',
            'Todos los beneficios VIP incluidos',
            'Acceso anticipado a nuevas características',
            'Prioridad máxima en el servidor',
            'Participación en sorteos exclusivos',
            'Insignia especial en el perfil'
        ]
    },
    diamond: {
        title: 'VIP DIAMOND',
        price: '$79.99',
        priceValue: 79.99,
        color: '#00bcd4',
        benefits: [
            'Todo lo del VIP GOLD',
            'Máxima cantidad de puntos de casa',
            'Muchísimos más usos diarios del /home',
            'Teletransporte aún más rápido',
            'Cooldown súper reducido',
            'Acceso a /skin, tag DIAMOND y ventajas exclusivas',
            'Kits especiales'
        ],
        features: [
            '30 días de acceso VIP DIAMOND',
            'Todos los beneficios VIP GOLD incluidos',
            'Acceso completo a todo el contenido premium',
            'Soporte VIP 24/7 con respuesta inmediata',
            'Regalos exclusivos cada semana',
            'Invitación a eventos privados con admins',
            'Influencia en futuras actualizaciones'
        ]
    }
};

// Función para seleccionar VIP y navegar a detalles
function selectVIP(vipType) {
    console.log('🎯 VIP seleccionado:', vipType);
    
    // Guardar selección en sessionStorage
    sessionStorage.setItem('selectedVIP', vipType);
    
    // Redirigir a página de detalles
    window.location.href = 'detalles.html';
}

// Función para cargar detalles en detalles.html
function loadVIPDetails() {
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType || !vipData[vipType]) {
        console.warn('⚠️ No hay VIP seleccionado, redirigiendo...');
        window.location.href = 'index.html';
        return;
    }
    
    const vip = vipData[vipType];
    console.log('📋 Cargando detalles de:', vip.title);
    
    // Actualizar título y precio
    document.getElementById('vip-title').textContent = vip.title;
    document.getElementById('vip-title').style.color = vip.color;
    document.getElementById('vip-price').textContent = vip.price;
    
    // Cargar beneficios
    const benefitsList = document.getElementById('vip-benefits-detail');
    benefitsList.innerHTML = '';
    vip.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
    
    // Cargar características
    const featuresList = document.getElementById('vip-features');
    featuresList.innerHTML = '';
    vip.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Personalizar botón
    const btn = document.getElementById('purchase-btn');
    btn.style.background = `linear-gradient(135deg, ${vip.color}, ${adjustColor(vip.color, 20)})`;
}

// Función para ir al checkout
function goToCheckout() {
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType) {
        alert('⚠️ Error: No hay VIP seleccionado');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('💳 Navegando a checkout con:', vipType);
    window.location.href = 'checkout.html';
}

// Función para cargar resumen en checkout.html
function loadCheckoutSummary() {
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType || !vipData[vipType]) {
        console.warn('⚠️ No hay VIP seleccionado');
        window.location.href = 'index.html';
        return;
    }
    
    const vip = vipData[vipType];
    console.log('💰 Cargando resumen de:', vip.title);
    
    // Actualizar resumen
    document.getElementById('summary-product').textContent = vip.title;
    document.getElementById('summary-price').textContent = vip.price;
    document.getElementById('summary-total').textContent = vip.price;
    
    // Cargar datos guardados del formulario
    loadSavedFormData();
}

// Cargar datos guardados del formulario
function loadSavedFormData() {
    const savedData = localStorage.getItem('sagaRustFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (document.getElementById('steam-id')) {
            document.getElementById('steam-id').value = data.steamId || '';
        }
        if (document.getElementById('email')) {
            document.getElementById('email').value = data.email || '';
        }
        if (document.getElementById('name')) {
            document.getElementById('name').value = data.name || '';
        }
        if (document.getElementById('discord')) {
            document.getElementById('discord').value = data.discord || '';
        }
        
        console.log('📝 Datos del formulario restaurados');
    }
}

// Funciones de navegación
function goBack() {
    window.location.href = 'index.html';
}

function goToDetails() {
    window.location.href = 'detalles.html';
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

// Función para cerrar modal y volver al inicio
function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Limpiar selección
    sessionStorage.removeItem('selectedVIP');
    
    // Volver al inicio
    window.location.href = 'index.html';
}

// Log de inicialización
console.log('🧭 Sistema de navegación cargado');
console.log('📦 VIP Types disponibles:', Object.keys(vipData));