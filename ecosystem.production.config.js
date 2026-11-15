const path = require('path');

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
            script: 'web-server.js',
            cwd: path.join(__dirname, 'app-tier'),
            interpreter: 'node',
            watch: false,
            env: {
                HOST: '0.0.0.0',
                PORT: 3000
            }
        }
    ]
};
