const friends = require('../models/friends.model');

function getFriends(req, res) {
    res.json(friends);
}

function postFriends(req, res) {
    if (!req.body.name) {
        return res.status(400).json({
            error: "Friend name missing"
        });
    }

    const newFriend = {
        id: friends.length,
        name: req.body.name
    }
    friends.push(newFriend);

    res.json(newFriend);
}

function getFriend(req, res) {
    const friendId = Number(req.params.friendId);
    const friend = friends[friendId];

    if (friend) {
        res.status(200).json(friend);
    } else {
        res.status(404).json({
            error: "Friend does not exist"
        });
    }
}

module.exports = {
    getFriends, 
    getFriend,
    postFriends,
}