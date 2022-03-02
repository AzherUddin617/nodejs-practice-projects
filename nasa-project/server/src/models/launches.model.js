const launchesDatabase = require('./launches.mongo');

const launches = new Map();

let latestFlightNumber = 100;
const launch = {
    flightNumber: latestFlightNumber,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date("December 27, 2030"),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

async function saveLaunch(launch) {
    await launchesDatabase.updateOne({
        flightNumber: flight.flightNumber
    }, launch, {
        upsert: true
    });
}

function launchExistWithId (id) {
    return launches.has(id);
}

function getAllLaunches () {
    return Array.from(launches.values());
}

function addNewLaunches (launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            flightNumber: latestFlightNumber,
            upcoming: true,
            success: true,
            customers: ['ZTM', 'NASA'],
        })
    )
}

function abortLaunchById (id) {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    launchExistWithId,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById,
}