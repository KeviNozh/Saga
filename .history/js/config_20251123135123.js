// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: 'Ae4y8pskNsADzerR0UEcN5WccZnZpzNGUwdMYG-IubRQqYqhQnW37l36trhr4nZ9Zv9PFYXdxTfh4a9p',
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