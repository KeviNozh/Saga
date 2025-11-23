// script.js - Funciones generales (actualizado para páginas separadas)

// Completar compra (para métodos que NO sean PayPal)
function completePurchase() {
    console.log('🔄 Intentando completar compra...');
    
    const steamId = document.getElementById('steam-id')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const name = document.getElementById('name')?.value.trim();
    const terms = document.getElementById('terms')?.checked;
    
    if (!steamId || !email || !name) {
        alert('❌ Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    if (!terms) {
        alert('❌ Debes aceptar los términos y condiciones.');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (paymentMethod === 'paypal') {
        alert('⚠️ Por favor, utiliza el botón amarillo de PayPal arriba para completar tu compra de forma segura.');
        
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) {
            paypalContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            paypalContainer.style.animation = 'pulse 1s ease-in-out 3';
        }
        return;
    }
    
    const btn = document.querySelector('.btn-purchase');
    if (!btn) return;
    
    const originalText = btn.textContent;
    btn.textContent = 'Procesando...';
    btn.disabled = true;
    
    console.log('💳 Procesando compra con método:', paymentMethod);
    
    setTimeout(() => {
        alert('⚠️ Este método de pago aún no está disponible.\n\nPor favor usa PayPal para completar tu compra.');
        
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

// Efectos visuales para la página principal
function initializeAnimations() {
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
}

// Crear partículas de fondo
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

// Agregar estilos de animación
function addAnimationStyles() {
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
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
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎮 SAGA RUST VIP SYSTEM', 'background: #d85c3a; color: white; font-size: 18px; padding: 10px; font-weight: bold;');
    console.log('✅ Sistema cargado correctamente');
    console.log('📄 Página actual:', window.location.pathname);
    
    // Agregar estilos de animación
    addAnimationStyles();
    
    // Verificar PayPal SDK solo en checkout
    if (window.location.pathname.includes('checkout.html')) {
        if (typeof paypal !== 'undefined') {
            console.log('✅ PayPal SDK cargado');
        } else {
            console.warn('⚠️ PayPal SDK no detectado');
        }
    }
    
    // Inicializar animaciones en página principal
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initializeAnimations();
        createParticles();
    }
    
    // Prevenir envío del formulario con Enter en checkout
    const form = document.getElementById('billing-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('⚠️ Formulario submit bloqueado - usa el botón de PayPal');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

console.log('📦 script.js cargado');