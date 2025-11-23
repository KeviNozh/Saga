let currentVIP = null;

// ✅ URL de tu Google Apps Script
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyqSQq11hdeTdeoV2LKK6TKcnjFgqEkDLwOqKc9iNjA7XNU5QxO8XICGfSwdEjYlncDpA/exec';

// ✅ Configuración de precios ($0.10 USD)
const vipConfig = {
    vip: { price: 0.10, name: 'VIP (Básico)' },
    gold: { price: 0.10, name: 'VIP GOLD' },
    diamond: { price: 0.10, name: 'VIP DIAMOND' }
};

function initializePayPal(vipType) {
    console.log('🔄 Inicializando PayPal PRODUCCIÓN para:', vipType);
    currentVIP = vipType;
    const config = vipConfig[vipType];
    
    if (!config) {
        console.error('❌ Tipo VIP no válido:', vipType);
        showPaymentStatus('Error: Tipo de VIP no válido', 'error');
        return;
    }
    
    const price = config.price;

    if (typeof paypal === 'undefined') {
        console.error('❌ PayPal SDK NO CARGADO');
        showPaymentStatus('Error: PayPal no cargó. Recarga la página.', 'error');
        return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container) {
        console.error('❌ Contenedor PayPal no encontrado');
        return;
    }

    container.innerHTML = '<p style="text-align:center;color:#aaa;">Cargando PayPal...</p>';
    console.log('✅ PayPal SDK LIVE cargado - Precio: $' + price.toFixed(2));

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: isMobile ? 48 : 55,
            tagline: false
        },

        createOrder: function(data, actions) {
            console.log('📝 Creando orden de pago REAL - $' + price.toFixed(2));
            
            if (!validateFormSilent()) {
                showPaymentStatus('⚠️ Completa todos los campos obligatorios', 'warning');
                return Promise.reject(new Error('Formulario incompleto'));
            }
            
            saveFormData();
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: `${config.name} - Saga Rust Server`,
                    custom_id: `saga_${vipType}_${Date.now()}`
                }],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                    brand_name: 'Saga Rust',
                    user_action: 'PAY_NOW'
                }
            }).then(function(orderId) {
                console.log('✅ Orden REAL creada:', orderId);
                return orderId;
            }).catch(function(error) {
                console.error('❌ Error al crear orden:', error);
                showPaymentStatus('Error al crear la orden. Intenta nuevamente.', 'error');
                throw error;
            });
        },

        onApprove: function(data, actions) {
            console.log('💳 Capturando pago REAL...', data.orderID);
            showLoadingModal();
            
            return actions.order.capture().then(function(details) {
                console.log('✅ PAGO REAL COMPLETADO:', details);
                
                if (details.status === 'COMPLETED') {
                    return processSuccessfulPayment(details, vipType);
                } else {
                    throw new Error('Estado de pago: ' + details.status);
                }
            }).catch(function(error) {
                console.error('❌ Error al capturar:', error);
                hideLoadingModal();
                showPaymentStatus('Error al procesar pago. ID: ' + data.orderID, 'error');
            });
        },

        onCancel: function(data) {
            console.log('❌ Pago cancelado por el usuario');
            showPaymentStatus('Pago cancelado. Puedes intentar de nuevo.', 'warning');
        },

        onError: function(err) {
            console.error('❌ ERROR PayPal:', err);
            hideLoadingModal();
            showPaymentStatus('Error en el sistema de pago. Intenta de nuevo.', 'error');
        },

        onClick: function(data, actions) {
            if (!validateFormSilent()) {
                showPaymentStatus('⚠️ Completa: Steam ID, Email, Nombre y acepta términos', 'warning');
                return actions.reject();
            }
            hidePaymentStatus();
            return actions.resolve();
        }

    }).render('#paypal-button-container')
      .then(function() {
          console.log('✅ Botón PayPal LIVE renderizado - $0.10');
      })
      .catch(function(error) {
          console.error('❌ Error al renderizar botón:', error);
          container.innerHTML = `
              <div style="color:#ff6b6b;padding:20px;text-align:center;background:rgba(255,0,0,0.1);border-radius:8px;">
                  <p><strong>⚠️ Error al cargar PayPal</strong></p>
                  <p style="font-size:0.9rem;margin:10px 0;">Verifica tu conexión a internet</p>
                  <button onclick="location.reload()" class="btn" style="margin-top:10px;padding:10px 20px;">Recargar Página</button>
              </div>
          `;
      });
}

function validateFormSilent() {
    const steamId = document.getElementById('steam-id')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const name = document.getElementById('name')?.value.trim();
    const terms = document.getElementById('terms')?.checked;

    if (!steamId || !email || !name || !terms) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return true;
}

function saveFormData() {
    const formData = {
        steamId: document.getElementById('steam-id').value.trim(),
        email: document.getElementById('email').value.trim(),
        name: document.getElementById('name').value.trim(),
        discord: document.getElementById('discord').value.trim() || 'N/A',
        vipType: currentVIP,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('sagaRustFormData', JSON.stringify(formData));
    console.log('💾 Datos del formulario guardados');
}

async function processSuccessfulPayment(details, vipType) {
    const savedData = JSON.parse(localStorage.getItem('sagaRustFormData') || '{}');
    
    const paymentData = {
        vipType: vipType,
        vipTitle: vipConfig[vipType].name,
        steamId: savedData.steamId,
        email: savedData.email,
        name: savedData.name,
        discord: savedData.discord,
        paypalOrderId: details.id,
        transactionId: details.purchase_units[0].payments.captures[0].id,
        amount: details.purchase_units[0].amount.value,
        currency: details.purchase_units[0].amount.currency_code,
        status: details.status,
        payerEmail: details.payer.email_address,
        payerName: `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim(),
        payerId: details.payer.payer_id,
        timestamp: new Date().toISOString(),
        fechaLocal: new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', dateStyle: 'full', timeStyle: 'long' })
    };

    console.log('💰 PAGO REAL REGISTRADO - $0.10:', paymentData);
    savePaymentToHistory(paymentData);

    try {
        console.log('📤 Enviando datos al servidor...');
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
            mode: 'no-cors'
        });
        console.log('✅ Datos enviados al servidor');
    } catch (error) {
        console.error('⚠️ Error al enviar datos:', error);
    }

    hideLoadingModal();
    localStorage.removeItem('sagaRustFormData');
    showCustomConfirmation(paymentData);
}

function savePaymentToHistory(data) {
    let history = JSON.parse(localStorage.getItem('sagaRustPayments') || '[]');
    history.push(data);
    localStorage.setItem('sagaRustPayments', JSON.stringify(history));
    console.log('📝 Pago guardado en historial local');
}

function showCustomConfirmation(p) {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="success-icon">✓</span>
        <h2>¡Compra Exitosa!</h2>
        <p style="font-size:1.2rem;margin:10px 0;"><strong>${p.vipTitle}</strong></p>
        <div style="text-align:left;background:rgba(255,255,255,0.1);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="margin:8px 0;"><strong>Steam ID:</strong> ${p.steamId}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${p.email}</p>
            <p style="margin:8px 0;"><strong>Transacción:</strong> ${p.transactionId}</p>
            <p style="margin:8px 0;"><strong>Monto:</strong> $${p.amount} ${p.currency}</p>
        </div>
        <div style="background:linear-gradient(135deg,#43a047,#66bb6a);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="color:#fff;margin:0;font-size:1.1rem;">
                <strong>✅ Pago Confirmado</strong><br><br>
                📧 Confirmación enviada a:<br><strong>${p.email}</strong><br><br>
                ⚡ VIP activo en <strong>24 horas</strong>
            </p>
        </div>
        <button class="btn" onclick="closeModal()" style="background:var(--gold);width:100%;padding:15px;">Entendido</button>
    `;
    modal.classList.add('active');
}

function showLoadingModal() {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        <div style="text-align:center;">
            <div class="spinner"></div>
            <h2 style="color:var(--gold);margin:20px 0;">Procesando Pago...</h2>
            <p>Espera mientras confirmamos con PayPal</p>
            <p style="color:#aaa;margin-top:20px;font-size:0.9rem;">⚠️ No cierres esta ventana</p>
        </div>
    `;
    modal.classList.add('active');
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            .spinner {
                border: 5px solid rgba(255,140,0,0.2);
                border-top: 5px solid var(--gold);
                border-radius: 50%;
                width: 80px;
                height: 80px;
                animation: spin 1s linear infinite;
                margin: 0 auto 30px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideLoadingModal() {}

function showPaymentStatus(msg, type) {
    const el = document.getElementById('payment-status');
    if (!el) return;
    
    const colors = { 
        error: '#ff6b6b', 
        warning: '#ffa500', 
        success: '#4CAF50' 
    };
    
    el.style.display = 'block';
    el.style.background = `rgba(${type === 'error' ? '255,107,107' : type === 'warning' ? '255,165,0' : '76,175,80'},0.2)`;
    el.style.border = `2px solid ${colors[type]}`;
    el.style.color = '#fff';
    el.style.padding = '15px';
    el.style.borderRadius = '8px';
    el.style.marginTop = '15px';
    el.innerHTML = `<strong>${msg}</strong>`;
    
    if (type === 'warning') {
        setTimeout(() => hidePaymentStatus(), 5000);
    }
}

function hidePaymentStatus() {
    const el = document.getElementById('payment-status');
    if (el) el.style.display = 'none';
}

console.log('✅ paypal.js PRODUCCIÓN cargado');
console.log('💳 Client ID: AUNiQWQ... (LIVE)');
console.log('💰 Precio: $0.10 USD');