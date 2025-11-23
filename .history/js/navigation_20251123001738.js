// navigation.js - Sistema de navegación Saga Rust

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
            'Kit mejorado',
            'Descuentos del 20% en la tienda'
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
        priceValue: 79.99,
        color: '#00bcd4',
        benefits: [
            'Todo lo del VIP GOLD',
            'Máxima cantidad de puntos de casa',
            'Muchísimos más usos diarios del /home',
            'Teletransporte aún más rápido',
            'Cooldown súper reducido',
            'Acceso a /skin, tag DIAMOND y ventajas exclusivas',
            'Kits especiales',
            'Invitación a eventos privados con admins'
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

function selectVIP(vipType) {
    console.log('🎯 VIP seleccionado:', vipType);
    sessionStorage.setItem('selectedVIP', vipType);
    window.location.href = 'detalles.html';
}

function loadVIPDetails() {
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType || !vipData[vipType]) {
        console.warn('⚠️ No hay VIP seleccionado');
        window.location.href = 'index.html';
        return;
    }
    
    const vip = vipData[vipType];
    console.log('📋 Cargando:', vip.title);
    
    const titleEl = document.getElementById('vip-title');
    const priceEl = document.getElementById('vip-price');
    
    if (titleEl) {
        titleEl.textContent = vip.title;
        titleEl.style.color = vip.color;
    }
    if (priceEl) priceEl.textContent = vip.price;
    
    const benefitsList = document.getElementById('vip-benefits-detail');
    if (benefitsList) {
        benefitsList.innerHTML = '';
        vip.benefits.forEach(b => {
            const li = document.createElement('li');
            li.textContent = b;
            benefitsList.appendChild(li);
        });
    }
    
    const featuresList = document.getElementById('vip-features');
    if (featuresList) {
        featuresList.innerHTML = '';
        vip.features.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            featuresList.appendChild(li);
        });
    }
    
    const btn = document.getElementById('purchase-btn');
    if (btn) {
        btn.style.background = `linear-gradient(135deg, ${vip.color}, ${adjustColor(vip.color, 20)})`;
    }
}

function goToCheckout() {
    const vipType = sessionStorage.getItem('selectedVIP');
    if (!vipType) {
        alert('⚠️ Error: No hay VIP seleccionado');
        window.location.href = 'index.html';
        return;
    }
    console.log('💳 Navegando a checkout:', vipType);
    window.location.href = 'checkout.html';
}

function loadCheckoutSummary() {
    const vipType = sessionStorage.getItem('selectedVIP');
    
    if (!vipType || !vipData[vipType]) {
        console.warn('⚠️ No hay VIP seleccionado');
        window.location.href = 'index.html';
        return;
    }
    
    const vip = vipData[vipType];
    console.log('💰 Resumen:', vip.title);
    
    const productEl = document.getElementById('summary-product');
    const priceEl = document.getElementById('summary-price');
    const totalEl = document.getElementById('summary-total');
    
    if (productEl) productEl.textContent = vip.title;
    if (priceEl) priceEl.textContent = vip.price;
    if (totalEl) totalEl.textContent = vip.price;
    
    loadSavedFormData();
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('sagaRustFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const fields = { 'steam-id': 'steamId', 'email': 'email', 'name': 'name', 'discord': 'discord' };
            Object.entries(fields).forEach(([id, key]) => {
                const el = document.getElementById(id);
                if (el && data[key]) el.value = data[key];
            });
        } catch (e) { console.error('Error datos:', e); }
    }
}

function goBack() { window.location.href = 'index.html'; }
function goToDetails() { window.location.href = 'detalles.html'; }

function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.remove('active');
    sessionStorage.removeItem('selectedVIP');
    window.location.href = 'index.html';
}

console.log('🧭 navigation.js cargado');