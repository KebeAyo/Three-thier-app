const path = require('path');
const express = require('express');

const app = express();
const frontendBuildPath = path.join(__dirname, '..', 'web-tier', 'build');
const port = Number(process.env.PORT) || 3000;

app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Frontend listening on port ${port}.`);
});
