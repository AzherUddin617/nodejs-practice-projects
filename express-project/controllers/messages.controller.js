const path = require('path');

function getMessages(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'images', 'skimountain.jpg'))
    // res.send("<ul><li>Hellooo</li></ul>");
}

function postMessages(req, res) {
    res.send('Updating messages'); 
}

module.exports = {
    getMessages,
    postMessages,
}