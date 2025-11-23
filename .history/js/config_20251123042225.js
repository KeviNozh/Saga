// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: '
AUNiQWQRZnSr3KohXOJHkmI3NuV8bUl7nJWD5vOhvcVjLA-e8RQAPOh1E_fWORBaha2_pZNsG4dmO-P5',
        currency: 'USD',
        environment: 'production'
    },
    server: {
        endpoint: 'https://script.google.com/macros/s/AKfycbyqSQq11hdeTdeoV2LKK6TKcnjFgqEkDLwOqKc9iNjA7XNU5QxO8XICGfSwdEjYlncDpA/exec'
    },
    pricing: {
        vip: 0.10,
        gold: 0.10,
        diamond: 0.10
    }
};

console.log('⚙️ CONFIG cargado - PRODUCCIÓN - $0.10 USD');