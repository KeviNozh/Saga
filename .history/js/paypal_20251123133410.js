let currentVIP = null;
let externalValidator = null;

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwndsJpm3xCyhkWlAyugC2_J0DHq9KxxXKHY2H-97qtAYzzwJT5wDoeK_4GxDzbA4WOoA/exec';

const vipConfig = {
    vip: { price: 0.10, name: 'VIP (Básico)' },
    gold: { price: 0.10, name: 'VIP GOLD' },
    diamond: { price: 0.10, name: 'VIP DIAMOND' }
};

function initializePayPal(vipType, validatorFunction = null) {
    console.log('🎯 Inicializando PayPal:', vipType);
    currentVIP = vipType;
    externalValidator = validatorFunction;
    
    const config = vipConfig[vipType];
    
    if (!config) {
        console.error('❌ VIP no válido');
        return;
    }
    
    const price = config.price;

    if (typeof paypal === 'undefined') {
        console.error('❌ PayPal SDK no cargado');
        return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container) {
        console.error('❌ Contenedor no encontrado');
        return;
    }

    container.innerHTML = '<p style="text-align:center;color:#aaa;">Cargando PayPal...</p>';
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 55
        },

        createOrder: function(data, actions) {
            console.log('💰 Creando orden:', price);
            
            // Validar campos básicos
            if (externalValidator && !externalValidator()) {
                return Promise.reject(new Error('Validación fallida'));
            }
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: `${config.name} - Saga Rust`
                }]
            });
        },

        onApprove: function(data, actions) {
            console.log('✅ Pago aprobado:', data.orderID);
            
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(255, 165, 0, 0.2)';
                statusDiv.style.border = '2px solid #ffa500';
                statusDiv.style.color = '#ffa500';
                statusDiv.innerHTML = '<strong>🔄 Procesando y asignando rol...</strong>';
            }
            
            return actions.order.capture().then(function(details) {
                console.log('🎉 Pago capturado');
                
                const formData = {
                    steamId: document.getElementById('steam-id').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    name: document.getElementById('name').value.trim(),
                    discord: document.getElementById('discord').value.trim().split('#')[0], // Limpiar el username
                    vipType: vipType,
                    vipTitle: config.name,
                    transactionId: data.orderID,
                    paypalOrderId: details.id,
                    amount: price.toFixed(2),
                    status: 'COMPLETED',
                    payerEmail: details.payer.email_address,
                    payerName: `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim()
                };
                
                console.log('📤 Enviando datos:', formData);
                return enviarDatosPago(formData);
            });
        },

        onError: function(err) {
            console.error('❌ Error PayPal:', err);
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(255, 0, 0, 0.2)';
                statusDiv.style.border = '2px solid #ff0000';
                statusDiv.style.color = '#ff0000';
                statusDiv.innerHTML = '<strong>❌ Error en el pago</strong>';
            }
        },

        onCancel: function() {
            console.log('🚫 Pago cancelado');
        }

    }).render('#paypal-button-container')
      .then(function() {
          console.log('✅ Botón PayPal renderizado');
      })
      .catch(function(error) {
          console.error('❌ Error renderizando:', error);
          container.innerHTML = `
              <div style="color:#ff6b6b;padding:20px;text-align:center;">
                  <p><strong>⚠️ Error al cargar PayPal</strong></p>
                  <button onclick="location.reload()" class="btn">Recargar</button>
              </div>
          `;
      });
}

async function enviarDatosPago(formData) {
    try {
        console.log('📤 Enviando a servidor:', formData);
        
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const text = await response.text();
        console.log('📡 Respuesta:', text);
        
        const result = JSON.parse(text);
        console.log('✅ Resultado:', result);
        
        if (result.success) {
            const statusDiv = document.getElementById('payment-status');
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(76, 175, 80, 0.2)';
                statusDiv.style.border = '2px solid #4CAF50';
                statusDiv.style.color = '#4CAF50';
                
                let discordMsg = '⏳ Procesando';
                if (result.discordStatus === 'ROL_ASIGNADO') {
                    discordMsg = '✅ Asignado';
                } else if (result.discordStatus === 'ERROR_ASIGNACION') {
                    discordMsg = '⚠️ Revisar manualmente';
                }
                
                statusDiv.innerHTML = `
                    <strong>✅ ¡Compra exitosa!</strong><br>
                    <small>Rol Discord: ${discordMsg}</small>
                `;
            }
            
            setTimeout(() => {
                showSuccessModal(formData, result);
            }, 1500);
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        const statusDiv = document.getElementById('payment-status');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.style.background = 'rgba(255, 0, 0, 0.2)';
            statusDiv.style.border = '2px solid #ff0000';
            statusDiv.style.color = '#ff0000';
            statusDiv.innerHTML = `<strong>❌ Error:</strong><br><small>${error.message}</small>`;
        }
    }
}

function showSuccessModal(data, result) {
    const modal = document.getElementById('confirmation-modal');
    const content = modal.querySelector('.modal-content');
    
    let discordStatusMsg = '⏳ Procesando rol de Discord...';
    let discordColor = '#ffa500';
    
    if (result.discordStatus === 'ROL_ASIGNADO') {
        discordStatusMsg = '✅ Rol de Discord asignado automáticamente';
        discordColor = '#4CAF50';
    } else if (result.discordStatus === 'ERROR_ASIGNACION') {
        discordStatusMsg = '⚠️ Rol pendiente - Contacta soporte con tu Transaction ID';
        discordColor = '#ff6b6b';
    }
    
    content.innerHTML = `
        <span class="success-icon">✓</span>
        <h2>¡Compra Exitosa!</h2>
        <p style="font-size:1.2rem;margin:10px 0;"><strong>${data.vipTitle}</strong></p>
        <div style="text-align:left;background:rgba(255,255,255,0.1);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="margin:8px 0;"><strong>Steam ID:</strong> ${data.steamId}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:8px 0;"><strong>Discord:</strong> ${data.discord}</p>
            <p style="margin:8px 0;"><strong>Transacción:</strong> ${data.transactionId}</p>
            <p style="margin:8px 0;"><strong>Monto:</strong> $${data.amount} USD</p>
        </div>
        <div style="background:${discordColor};padding:20px;border-radius:8px;margin:20px 0;">
            <p style="color:#fff;margin:0;font-size:1rem;">
                ${discordStatusMsg}
            </p>
        </div>
        <div style="background:linear-gradient(135deg,#43a047,#66bb6a);padding:20px;border-radius:8px;margin:20px 0;">
            <p style="color:#fff;margin:0;font-size:1.1rem;">
                <strong>✅ Pago Confirmado</strong><br><br>
                📧 Confirmación enviada a:<br><strong>${data.email}</strong>
            </p>
        </div>
        <button class="btn" onclick="closeModal()" style="background:#ff8c00;width:100%;padding:15px;">Entendido</button>
    `;
    modal.classList.add('active');
}

console.log('✅ paypal.js cargado - Asignación directa');