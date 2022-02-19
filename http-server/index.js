const http = require("http");

const PORT = 3000;

const friends = [
    {
        id: 0,
        name: 'Azher'
    },
    {
        id: 1,
        name: 'Newton'
    },
    {
        id: 2,
        name: 'Nicola'
    }
];

const server = http.createServer((req, res) => {
    const params = req.url.split('/');

    if (req.method === "POST") {
        if (params[1] === "friends") {
            req.on('data', (data) => {
                const friend = data.toString();
                console.log("Requist:", friend);
                friends.push(JSON.parse(friend));
            });
            req.pipe(res);
        }
    }
    else if (req.method === "GET") {

        if (params[1] === "friends") {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
    
            if (params.length === 3) {
                const friendIndex = +params[2];
                res.end(JSON.stringify(friends[friendIndex]));
            }
            else {
                res.end(JSON.stringify(friends));
            }
        }
        else if (params[1] === "messages") {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<body>');
            res.write('<ul>');
            res.write('<li>Hello Issac</li>');
            res.write('<li>How is things going on?</li>');
            res.write('</ul>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        }
        else if (params[1] === '') {
            res.setHeader('Content-Type', 'text/plain');
            res.end('Welcome');
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
});

server.listen(PORT, () => {
    console.log("Listning to port:", PORT);
})