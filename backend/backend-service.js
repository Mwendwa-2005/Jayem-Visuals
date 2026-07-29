const { Service } = require('node-windows');

// Backend Service
const backendService = new Service({
    name: 'Willfred Photography Backend',
    description: 'Willfred Jayem Photography Backend Server',
    script: require('path').join(__dirname, 'server.js'),
    wait: 2,
    grow: 0.5,
    maxRestarts: 10
});

backendService.on('install', function() {
    backendService.start();
    console.log('✅ Backend service installed and started!');
});

backendService.install();
console.log('📦 Installing backend service...');