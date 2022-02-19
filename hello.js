const mission = process.argv[2];

if (mission == 'learn') {
    console.log("Lets learn something");
}
else {
    console.log(`Is ${mission} means something?`);
}

setTimeout(()=> console.log("TADAAAA!"), 5000);