const http = require('http');

require('dotenv').config();

const app = require('./app');

const { connectMongoose } = require('./services/mongo');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await connectMongoose();

    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, ()=> {
        console.log(`Listening on PORT: ${PORT}`);
    });
}

startServer();