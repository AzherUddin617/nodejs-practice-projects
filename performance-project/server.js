const express = require('express');
// const cluster = require('cluster');
// const os = require('os');

const app = express();

function delay (ms) {
    const startTime = Date.now();
    while (Date.now() - startTime < ms) {}
}

app.get('/', (req, res) => {
    res.send(`Performance Project: ${process.pid}`);
});

app.get('/timer', (req, res) => {
    delay(9000);
    res.send(`Ding ding ding: ${process.pid}`);
});

// if (cluster.isMaster) {
//     console.log('Master running...');
//     const WORKER_COUNT = os.cpus().length;
//     for (let i=0; i<WORKER_COUNT; i++) {
//         cluster.fork();
//     }
// } else {
//     console.log('Worker running...');
//     app.listen(3000);
// }

app.listen(3000);