const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', ()=> {
    console.log("MongoDB Connection is ready!");
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function connectMongoose() {
    await mongoose.connect(MONGO_URL);
}

module.exports = {
    connectMongoose,
}