function getMessages(req, res) {
    res.send("Message");
}

function postMessages(req, res) {
    res.send('Updating messages'); 
}

module.exports = {
    getMessages,
    postMessages,
}