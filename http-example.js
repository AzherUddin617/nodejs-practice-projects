const { request } = require('https');

const req = request('https://www.google.com', (res) => {
    res.on('data', (chunk) => {
        console.log(`Chunk data: ${chunk}`);
    });
    res.on('end', () => {
        console.log("Nothing more to show");
    });
});

req.end();