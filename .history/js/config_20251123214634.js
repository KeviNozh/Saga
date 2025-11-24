// Configuración de la aplicación - PRODUCCIÓN
const CONFIG = {
    paypal: {
        clientId: 'AZAflCZaZ4xvrrfGJ9chFDHJ-V_dNH8Xju8lkVOPe2caCrzLosdcTqLvGqMVD665JhYkeb6jalWtRNI9',
        currency: 'USD',
        environment: 'standbox'
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