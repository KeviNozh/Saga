// paypal.js - VERSIÓN CORREGIDA Y FUNCIONAL
let currentVIP = null;

// URL de tu Google Apps Script
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyqSQq11hdeTdeoV2LKK6TKcnjFgqEkDLwOqKc9iNjA7XNU5QxO8XICGfSwdEjYlncDpA/exec';

const vipConfig = {
    vip: { price: 19.99, name: 'VIP' },
    gold: { price: 39.99, name: 'VIP GOLD' },
    diamond: { price: 79.99, name: 'VIP DIAMOND' }
};

function initializePayPal(vipType) {
    console.log('🔄 Inicializando PayPal para:', vipType);
    currentVIP = vipType;
    const price = vipConfig[vipType].price;
    
    // Verificar que PayPal SDK esté cargado
    if (typeof paypal === 'undefined') {
        console.error('❌ PayPal SDK NO CARGADO');
        alert('Error: PayPal no se pudo cargar. Por favor recarga la página.');
        return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container) {
        console.error('❌ Contenedor PayPal no encontrado');
        return;
    }

    // Limpiar contenedor
    container.innerHTML = '<div style="text-align:center;padding:10px;color:#fff;">Cargando PayPal...</div>';

    console.log('✅ PayPal SDK cargado correctamente');
    console.log('💰 Precio:', price);

    // Renderizar botón PayPal
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 55
        },

        // Crear orden
        createOrder: function(data, actions) {
            console.log('📝 Creando orden de pago...');
            
            // Validar formulario antes de crear orden
            if (!validateFormSilent()) {
                alert('⚠️ Por favor completa todos los campos del formulario antes de continuar.');
                return Promise.reject('Formulario incompleto');
            }
            
            console.log('✅ Formulario validado');
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: `${vipConfig[vipType].name} - Saga Rust Server`,
                    custom_id: `vip_${vipType}_${Date.now()}`
                }],
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                    brand_name: 'Saga Rust',
                    user_action: 'PAY_NOW'
                }
            }).then(function(orderId) {
                console.log('✅ Orden creada:', orderId);
                return orderId;
            });
        },

        // Aprobar pago
        onApprove: function(data, actions) {
            console.log('💳 Capturando pago...', data.orderID);
            showLoadingModal();
            
            return actions.order.capture().then(function(details) {
                console.log('✅ PAGO COMPLETADO:', details);
                return processSuccessfulPayment(details, vipType);
            }).catch(function(error) {
                console.error('❌ Error al capturar:', error);
                hideLoadingModal();
                alert('Error al procesar el pago. Por favor contacta soporte.');
            });
        },

        // Cancelar pago
        onCancel: function(data) {
            console.log('❌ Pago cancelado por el usuario');
            alert('Pago cancelado. Puedes intentar nuevamente cuando quieras.');
        },

        // Error
        onError: function(err) {
            console.error('❌ ERROR PayPal:', err);
            hideLoadingModal();
            alert('Error en el proceso de pago. Por favor intenta nuevamente o contacta soporte.');
        },

        // Antes de abrir ventana
        onClick: function(data, actions) {
            console.log('🖱️ Click en botón PayPal');
            
            // Validar silenciosamente
            if (!validateFormSilent()) {
                alert('⚠️ Por favor completa:\n- Steam ID\n- Email\n- Nombre\n- Acepta términos y condiciones');
                return actions.reject();
            }
            
            return actions.resolve();
        }

    }).render('#paypal-button-container')
      .then(function() {
          console.log('✅ Botón PayPal renderizado correctamente');
          container.style.minHeight = 'auto';
      })
      .catch(function(error) {
          console.error('❌ Error al renderizar botón:', error);
          container.innerHTML = '<div style="color:red;padding:10px;">Error al cargar PayPal. Recarga la página.</div>';
      });
}

// Validación silenciosa (sin alertas)
function validateFormSilent() {
    const steamId = document.getElementById('steam-id')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const name = document.getElementById('name')?.value.trim();
    const terms = document.getElementById('terms')?.checked;

    if (!steamId || !email || !name || !terms) {
        console.warn('⚠️ Formulario incompleto');
        return false;
    }

    if (!validateEmail(email)) {
        console.warn('⚠️ Email inválido');
        return false;
    }

    console.log('✅ Validación exitosa');
    saveFormData();
    return true;
}

// Validación con alertas
function validateForm() {
    const steamId = document.getElementById('steam-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const terms = document.getElementById('terms').checked;

    if (!steamId || !email || !name) {
        alert('❌ Por favor completa todos los campos obligatorios:\n- Steam ID\n- Email\n- Nombre');
        return false;
    }

    if (!validateEmail(email)) {
        alert('❌ El email ingresado no es válido.\nEjemplo: usuario@email.com');
        return false;
    }

    if (!terms) {
        alert('❌ Debes aceptar los términos y condiciones para continuar.');
        return false;
    }

    saveFormData();
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    console.log('💾 Datos guardados temporalmente');
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
        status: details.status,
        payerEmail: details.payer.email_address,
        payerName: `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim(),
        timestamp: new Date().toISOString(),
        fechaLocal: new Date().toLocaleString('es-CL', { 
            timeZone: 'America/Santiago',
            dateStyle: 'full',
            timeStyle: 'long'
        })
    };

    console.log('💰 PAGO COMPLETADO:', paymentData);

    // Guardar localmente primero
    savePaymentToHistory(paymentData);

    // Enviar a Google Apps Script
    try {
        console.log('📤 Enviando a backend...');
        
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
            mode: 'no-cors'
        });

        console.log('✅ Datos enviados al servidor');
        
    } catch (error) {
        console.error('⚠️ Error al enviar al servidor:', error);
        console.log('💾 Datos guardados localmente como respaldo');
    }

    // Mostrar confirmación
    hideLoadingModal();
    showCustomConfirmation(paymentData);
    
    // Limpiar formulario
    localStorage.removeItem('sagaRustFormData');
    document.getElementById('billing-form').reset();
    
    // Resumen en consola
    showPaymentSummary(paymentData);
}

function savePaymentToHistory(paymentData) {
    let history = JSON.parse(localStorage.getItem('sagaRustPayments') || '[]');
    history.push(paymentData);
    localStorage.setItem('sagaRustPayments', JSON.stringify(history));
    console.log('💾 Pago guardado en historial local');
}

function showCustomConfirmation(paymentData) {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="success-icon">✓</span>
        <h2>¡Compra Exitosa!</h2>
        <p style="font-size: 1.2rem; margin: 10px 0;"><strong>VIP ${paymentData.vipTitle}</strong></p>
        
        <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Steam ID:</strong> ${paymentData.steamId}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${paymentData.email}</p>
            <p style="margin: 8px 0;"><strong>Transacción:</strong> ${paymentData.transactionId}</p>
            <p style="margin: 8px 0;"><strong>Monto:</strong> $${paymentData.amount} USD</p>
            <p style="margin: 8px 0;"><strong>Fecha:</strong> ${paymentData.fechaLocal}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #43a047, #66bb6a); padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 15px rgba(67,160,71,0.3);">
            <p style="color: #fff; margin: 0; font-size: 1.1rem;">
                <strong>✅ Pago Confirmado</strong><br><br>
                📧 Recibirás un email de confirmación en:<br>
                <strong>${paymentData.email}</strong><br><br>
                ⚡ Tu VIP será activado en las próximas <strong>24 horas</strong>
            </p>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn" onclick="closeModal()" style="background: var(--gold); flex: 1;">
                Entendido
            </button>
            <button class="btn" onclick="exportLastPayment()" style="background: #4CAF50; flex: 1;">
                📄 Exportar Recibo
            </button>
        </div>
        
        <p style="margin-top: 20px; font-size: 0.9rem; color: #aaa;">
            Guarda esta información para cualquier consulta
        </p>
    `;
    
    modal.classList.add('active');
}

function showPaymentSummary(paymentData) {
    console.log('%c💰 RESUMEN DEL PAGO', 'background: #4CAF50; color: white; font-size: 16px; padding: 10px;');
    console.log('================================');
    console.log('🎮 Steam ID:', paymentData.steamId);
    console.log('⭐ VIP:', paymentData.vipTitle);
    console.log('📧 Email:', paymentData.email);
    console.log('💳 Transaction ID:', paymentData.transactionId);
    console.log('💰 Monto: $' + paymentData.amount + ' USD');
    console.log('📅 Fecha:', paymentData.fechaLocal);
    console.log('================================');
}

function showLoadingModal() {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <div style="text-align: center;">
            <div style="border: 5px solid rgba(255,140,0,0.2); border-top: 5px solid var(--gold); border-radius: 50%; width: 80px; height: 80px; animation: spin 1s linear infinite; margin: 0 auto 30px;"></div>
            <h2 style="color: var(--gold); margin: 20px 0;">Procesando Pago...</h2>
            <p style="font-size: 1.1rem;">Por favor espera mientras confirmamos tu compra con PayPal</p>
            <p style="color: #aaa; margin-top: 20px;">No cierres esta ventana</p>
        </div>
    `;
    
    modal.classList.add('active');
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideLoadingModal() {
    // No cerramos el modal, solo lo reutilizamos para mostrar confirmación
}

function exportLastPayment() {
    const payments = JSON.parse(localStorage.getItem('sagaRustPayments') || '[]');
    if (payments.length === 0) {
        alert('❌ No hay pagos para exportar');
        return;
    }
    
    const lastPayment = payments[payments.length - 1];
    
    // Crear texto legible
    const receiptText = `
═══════════════════════════════════════
        SAGA RUST - RECIBO DE COMPRA
═══════════════════════════════════════

VIP ADQUIRIDO: ${lastPayment.vipTitle}
MONTO: $${lastPayment.amount} USD

INFORMACIÓN DEL COMPRADOR:
- Nombre: ${lastPayment.name}
- Email: ${lastPayment.email}
- Steam ID: ${lastPayment.steamId}
- Discord: ${lastPayment.discord}

DETALLES DE LA TRANSACCIÓN:
- ID Transacción: ${lastPayment.transactionId}
- ID Orden PayPal: ${lastPayment.paypalOrderId}
- Estado: ${lastPayment.status}
- Fecha: ${lastPayment.fechaLocal}

═══════════════════════════════════════
Conserva este recibo para cualquier consulta
Email: kevintooresgarrido2435@gmail.com
═══════════════════════════════════════
`;

    const blob = new Blob([receiptText], {type: 'text/plain;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `saga_rust_recibo_${lastPayment.transactionId}.txt`;
    link.click();
    
    alert('✅ Recibo exportado correctamente');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 SAGA RUST VIP SYSTEM', 'background: #d85c3a; color: white; font-size: 20px; padding: 10px;');
    console.log('✅ Sistema iniciado correctamente');
    console.log('📊 Backend:', BACKEND_URL);
    
    // Cargar datos guardados
    const savedData = localStorage.getItem('sagaRustFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('steam-id').value = data.steamId || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('name').value = data.name || '';
        document.getElementById('discord').value = data.discord || '';
        console.log('📝 Datos del formulario restaurados');
    }
    
    const paymentsCount = JSON.parse(localStorage.getItem('sagaRustPayments') || '[]').length;
    console.log('💾 Pagos registrados:', paymentsCount);
    
    console.log('\n🔧 COMANDOS DE CONSOLA:');
    console.log('- showAllPayments() : Ver todos los pagos');
    console.log('- exportLastPayment() : Exportar último recibo');
    console.log('- clearAllData() : Limpiar datos (dev only)');
});

// Función para ver todos los pagos (admin)
function showAllPayments() {
    const payments = JSON.parse(localStorage.getItem('sagaRustPayments') || '[]');
    console.table(payments);
    return payments;
}

// Función para limpiar datos (solo desarrollo)
function clearAllData() {
    if (confirm('⚠️ ¿Estás seguro de eliminar TODOS los datos guardados?')) {
        localStorage.removeItem('sagaRustPayments');
        localStorage.removeItem('sagaRustFormData');
        console.log('🧹 Todos los datos eliminados');
        alert('✅ Datos limpiados correctamente');
        location.reload();
    }
}