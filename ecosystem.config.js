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
            script: path.join('node_modules', 'react-scripts', 'scripts', 'start.js'),
            cwd: path.join(__dirname, 'web-tier'),
            interpreter: 'node',
            watch: false,
            env: {
                BROWSER: 'none'
            }
        }
    ]
};
