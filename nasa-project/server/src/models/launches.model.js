const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLanches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: "name"
                }, {
                    path: "payloads",
                    select: "customers"
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.error("Problem downloading launch");
        throw new Error("Launch data download failed");
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        // const customers = launchDoc.payloads.reduce((arr, p) => arr.concat(p.customers), []);
        const customers = launchDoc.payloads.flatMap(p => p.customers);

        const launchData = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
        }
        // console.log(launchData.flightNumber, launchData.mission);

        await saveLaunch(launchData);
    }
    console.log(`Launch Docs: ${launchDocs.length}`);
}

async function loadLaunchesData() {
    const firstLaunch = findLaunch({
        flightNumber: 1,
        mission: "FalconSat",
        rocket: "Falcon 1"
    });

    if (firstLaunch) {
        populateLanches();
    } else {
        console.log("Launch Data already exist");
    }
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function launchExistWithId (id) {
    return (await findLaunch({ flightNumber: id }));
}


async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches (skip, limit) {

    return await launchesDatabase
        .find({}, "-_id -__v")
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error("Planet Not Found");
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
        customers: ['ZTM', 'NASA'],
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById (id) {
    await launchesDatabase.updateOne({
        flightNumber: id
    }, {
        success: false,
        upcoming: false
    });
}

module.exports = {
    launchExistWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchesData,
}