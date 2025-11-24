// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: 'AUBjE73ieu_WgG0qIiWCpU7V5IamTkX8bY9xfo80i2xrKJheuDE9ZFCVp_otxw93jibFxNnqGiMLv6Ja',
        currency: 'USD',
        environment: 'sandbox'
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