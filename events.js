const EventEmitter = require('events');

const celebrity = new EventEmitter();

// Subscribe to celebrity for observer 1
celebrity.on('race', (result)=> {
    if (result === 'win') {
        console.log('Congo! u win');
    }
    if (result === "lose") {
        console.log("Boo u lose");
    }
});

// Subscribe to celebrity for observer 2
celebrity.on('race', (result)=> {
    if (result === 'win') {
        console.log("I could do better!");
    }
    if (result === "lose") {
        console.log("lol what was expected");
    }
});

process.on('exit', (code) => {
    console.log('Program exit with code:', code);
});

celebrity.emit("race", "win");
celebrity.emit("race", "lose");