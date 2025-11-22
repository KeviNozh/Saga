// Integración PayPal para Saga Rust
let paypalButtons = null;

function initializePayPal() {
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK no cargado');
        return;
    }

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer || !currentVIP) return;

    // Limpiar contenedor anterior
    paypalContainer.innerHTML = '';

    const vip = vipData[currentVIP];
    const price = parseFloat(vip.price.replace('$', ''));

    paypalButtons = paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 55
        },

        createOrder: function(data, actions) {
            // Validar formulario antes de proceder
            if (!validateForm()) {
                return;
            }

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'USD'
                    },
                    description: `VIP ${vip.title} - Saga Rust`,
                    custom_id: `vip_${currentVIP}`
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Pago completado:', details);
                processSuccessfulPayment(details);
            });
        },

        onError: function(err) {
            console.error('Error en PayPal:', err);
            alert('Error en el proceso de pago. Por favor, intenta nuevamente.');
        },

        onCancel: function(data) {
            console.log('Pago cancelado por el usuario');
        },

        onClick: function() {
            // Validar formulario al hacer clic en PayPal
            if (!validateForm()) {
                return false; // Prevenir que PayPal proceda
            }
        }

    });

    // Renderizar botones
    paypalButtons.render('#paypal-button-container');
}

function validateForm() {
    const steamId = document.getElementById('steam-id').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const terms = document.getElementById('terms').checked;

    if (!steamId || !email || !name) {
        alert('Por favor, completa todos los campos obligatorios.');
        return false;
    }

    if (!terms) {
        alert('Debes aceptar los términos y condiciones.');
        return false;
    }

    return true;
}

function processSuccessfulPayment(details) {
    // Obtener datos del formulario
    const steamId = document.getElementById('steam-id').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const discord = document.getElementById('discord').value;

    // Datos de la transacción
    const paymentData = {
        vipType: currentVIP,
        vipTitle: vipData[currentVIP].title,
        steamId: steamId,
        email: email,
        name: name,
        discord: discord,
        paypalOrderId: details.id,
        payerEmail: details.payer.email_address,
        payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
        amount: details.purchase_units[0].amount.value,
        status: details.status,
        createTime: details.create_time,
        transactionId: details.purchase_units[0].payments.captures[0].id
    };

    console.log('Pago exitoso procesado:', paymentData);

    // Aquí deberías enviar los datos a tu servidor
    // sendToServer(paymentData);

    // Mostrar confirmación
    showConfirmation();

    // Limpiar formulario
    document.getElementById('billing-form').reset();

    // Enviar email de confirmación (simulado)
    sendConfirmationEmail(paymentData);
}

function sendConfirmationEmail(paymentData) {
    // Simular envío de email
    console.log('Enviando email de confirmación a:', paymentData.email);
    console.log('Contenido del email:', {
        to: paymentData.email,
        subject: `Confirmación de compra - VIP ${paymentData.vipTitle}`,
        body: `Hola ${paymentData.name},\n\nTu compra del rango ${paymentData.vipTitle} ha sido procesada exitosamente.\n\nSteam ID: ${paymentData.steamId}\nMonto: $${paymentData.amount}\nID de transacción: ${paymentData.transactionId}\n\nGracias por tu compra!`
    });
}

// Inicializar PayPal cuando la página de checkout esté activa
document.addEventListener('DOMContentLoaded', function() {
    // Observar cambios para inicializar PayPal en la página de checkout
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const checkoutPage = document.getElementById('checkout-page');
                if (checkoutPage && checkoutPage.classList.contains('active')) {
                    // Pequeño delay para asegurar que el DOM esté listo
                    setTimeout(initializePayPal, 100);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});