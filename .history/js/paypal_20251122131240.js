// Integración PayPal
let paypalButtonsInitialized = false;

function initializePayPal(price, vipType) {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
        },
        
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toString(),
                        currency_code: 'USD'
                    },
                    description: `VIP ${vipType.toUpperCase()} - Saga Rust`
                }]
            });
        },
        
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Procesar pago exitoso
                processSuccessfulPayment(details, vipType);
            });
        },
        
        onError: function(err) {
            console.error('Error en PayPal:', err);
            alert('Error en el proceso de pago. Por favor, intenta nuevamente.');
        },
        
        onCancel: function(data) {
            console.log('Pago cancelado por el usuario');
        }
        
    }).render('#paypal-button-container');
    
    paypalButtonsInitialized = true;
}

function processSuccessfulPayment(details, vipType) {
    // Obtener datos del formulario
    const steamId = document.getElementById('steam-id').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const discord = document.getElementById('discord').value;
    
    // Datos para enviar al servidor
    const paymentData = {
        vipType: vipType,
        steamId: steamId,
        email: email,
        name: name,
        discord: discord,
        paypalOrderId: details.id,
        payerEmail: details.payer.email_address,
        payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
        amount: details.purchase_units[0].amount.value,
        status: details.status,
        createTime: details.create_time
    };
    
    console.log('Pago exitoso:', paymentData);
    
    // Aquí deberías enviar los datos a tu servidor
    // sendToServer(paymentData);
    
    // Mostrar confirmación
    showConfirmation();
    
    // Opcional: Enviar email de confirmación
    sendConfirmationEmail(paymentData);
}

function sendConfirmationEmail(paymentData) {
    // Aquí integrarías con tu servicio de email
    console.log('Enviando email de confirmación a:', paymentData.email);
}

// Integración con tu sistema existente
document.addEventListener('DOMContentLoaded', function() {
    // Reemplazar el botón de compra original con PayPal
    overridePurchaseButton();
});

function overridePurchaseButton() {
    // Observar cambios en las páginas para inicializar PayPal cuando sea necesario
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const checkoutPage = document.getElementById('checkout-page');
                if (checkoutPage && checkoutPage.classList.contains('active')) {
                    setTimeout(initializeCheckoutPayPal, 500);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function initializeCheckoutPayPal() {
    const paypalContainer = document.getElementById('paypal-button-container');
    const purchaseBtn = document.querySelector('.btn-purchase');
    
    if (paypalContainer && purchaseBtn && currentVIP) {
        // Ocultar botón original y mostrar PayPal
        purchaseBtn.style.display = 'none';
        
        const vip = vipData[currentVIP];
        const price = parseFloat(vip.price.replace('$', ''));
        
        // Inicializar botones de PayPal
        if (!paypalButtonsInitialized) {
            initializePayPal(price, currentVIP);
        }
        
        // Mover el contenedor de PayPal al lugar correcto
        const orderSummary = document.querySelector('.order-summary');
        const secureNotice = document.querySelector('.secure-notice');
        
        if (orderSummary && secureNotice) {
            orderSummary.insertBefore(paypalContainer, secureNotice);
        }
    }
}

// Función para procesar pago manual (fallback)
function completePurchase() {
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
    
    // Si PayPal no está disponible, mostrar mensaje
    if (typeof paypal === 'undefined') {
        alert('Sistema de pago no disponible. Por favor, contacta con un administrador.');
        return;
    }
    
    // Mostrar que debe usar PayPal
    alert('Por favor, utiliza el botón de PayPal para completar tu compra de forma segura.');
}