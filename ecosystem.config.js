const path = require('path');
const productionFrontend = process.env.FRONTEND_MODE === 'production';

module.exports = {
    apps: [
        {
            name: 'three-tier-backend',
            script: 'index.js',
            cwd: path.join(__dirname, 'app-tier'),
            interpreter: 'node',
            watch: false
        },
        {
            name: 'three-tier-frontend',
            script: productionFrontend
                ? 'web-server.js'
                : path.join('node_modules', 'react-scripts', 'scripts', 'start.js'),
            cwd: productionFrontend
                ? path.join(__dirname, 'app-tier')
                : path.join(__dirname, 'web-tier'),
            interpreter: 'node',
            watch: false,
            env: {
                BROWSER: 'none',
                HOST: '0.0.0.0',
                PORT: 3000,
                FRONTEND_MODE: productionFrontend ? 'production' : 'development'
            }
        }
    ]
};