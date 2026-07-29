const { Service } = require('node-windows');

// Frontend Service - using a simple HTTP server
const frontendService = new Service({
    name: 'Willfred Photography Frontend',
    description: 'Willfred Jayem Photography Frontend Server',
    script: require('path').join(__dirname, '..', 'backend', 'node_modules', 'node-windows', 'bin', 'http-server.js'),
    args: ['--port', '3000'],
    wait: 2,
    grow: 0.5,
    maxRestarts: 10
});

frontendService.install();
console.log('📦 Installing frontend service...');